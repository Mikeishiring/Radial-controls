const { spawn } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const port = 9225;
const appPort = Number(process.env.APP_PORT || process.env.PORT || 4173);
const userDataDir = path.join(os.tmpdir(), `radial-controls-edge-${Date.now()}`);

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function readJson(url) {
  const response = await fetch(url);
  return response.json();
}

async function waitForCdp() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      return await readJson(`http://127.0.0.1:${port}/json/version`);
    } catch {
      await delay(100);
    }
  }
  throw new Error("CDP endpoint did not become available");
}

function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 0;
  const pending = new Map();

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (!message.id || !pending.has(message.id)) return;
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(JSON.stringify(message.error)));
    else resolve(message.result);
  };

  return new Promise((resolve, reject) => {
    ws.onopen = () => {
      resolve({
        send(method, params = {}, sessionId) {
          const message = { id: ++id, method, params };
          if (sessionId) message.sessionId = sessionId;
          ws.send(JSON.stringify(message));
          return new Promise((resolveSend, rejectSend) => {
            pending.set(id, { resolve: resolveSend, reject: rejectSend });
          });
        },
        close() {
          ws.close();
        },
      });
    };
    ws.onerror = reject;
  });
}

async function main() {
  const edge = spawn(edgePath, [
    "--headless=new",
    "--disable-gpu",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    "about:blank",
  ], { stdio: "ignore" });

  let cdp;
  try {
    const version = await waitForCdp();
    cdp = await connect(version.webSocketDebuggerUrl);
    const target = await cdp.send("Target.createTarget", {
      url: `http://localhost:${appPort}/`,
    });
    const attached = await cdp.send("Target.attachToTarget", {
      targetId: target.targetId,
      flatten: true,
    });
    const sessionId = attached.sessionId;

    await cdp.send("Page.enable", {}, sessionId);
    await cdp.send("Runtime.enable", {}, sessionId);
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width: 1440,
      height: 950,
      deviceScaleFactor: 1,
      mobile: false,
    }, sessionId);
    await delay(700);

    const result = await cdp.send("Runtime.evaluate", {
      awaitPromise: true,
      returnByValue: true,
      expression: `(async () => {
        const seed = document.querySelector('[data-action="seed"]');
        if (seed) seed.click();
        await new Promise((resolve) => setTimeout(resolve, 120));
        return {
          title: document.title,
          heading: document.querySelector(".brand-title")?.textContent,
          mark: document.querySelector(".reveal-head h2")?.textContent,
          hasJson: Boolean(document.querySelector(".json-preview")?.textContent.includes("onboarding-v1-radial-controls")),
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth
        };
      })()`,
    }, sessionId);

    if (result.exceptionDetails) {
      throw new Error(result.exceptionDetails.text || "verification evaluation failed");
    }

    const value = result.result.value;
    if (!value.title.includes("Onboarding V1") || !value.hasJson || value.scrollWidth > value.clientWidth + 1) {
      throw new Error(JSON.stringify(value, null, 2));
    }

    const shot = await cdp.send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: false,
    }, sessionId);
    fs.writeFileSync("prototype-radial-controls.png", Buffer.from(shot.data, "base64"));
    console.log(JSON.stringify(value, null, 2));
  } finally {
    if (cdp) cdp.close();
    edge.kill();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
