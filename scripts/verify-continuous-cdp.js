const { spawn } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const port = 9226;
const appPort = Number(process.env.APP_PORT || process.env.PORT || 4173);
const userDataDir = path.join(os.tmpdir(), `radial-continuous-edge-${Date.now()}`);
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const readJson = async (url) => (await fetch(url)).json();

async function waitForCdp() {
  for (let i = 0; i < 60; i += 1) {
    try { return await readJson(`http://127.0.0.1:${port}/json/version`); } catch { await delay(100); }
  }
  throw new Error("CDP endpoint did not become available");
}

function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 0;
  const pending = new Map();
  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (!pending.has(message.id)) return;
    const callbacks = pending.get(message.id);
    pending.delete(message.id);
    message.error ? callbacks.reject(new Error(JSON.stringify(message.error))) : callbacks.resolve(message.result);
  };
  return new Promise((resolve, reject) => {
    ws.onopen = () => resolve({
      send(method, params = {}, sessionId) {
        const message = { id: ++id, method, params };
        if (sessionId) message.sessionId = sessionId;
        ws.send(JSON.stringify(message));
        return new Promise((resolveSend, rejectSend) => pending.set(id, { resolve: resolveSend, reject: rejectSend }));
      },
      close() { ws.close(); },
    });
    ws.onerror = reject;
  });
}

async function evaluate(cdp, sessionId, expression) {
  const result = await cdp.send("Runtime.evaluate", { awaitPromise: true, returnByValue: true, expression }, sessionId);
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || "evaluation failed");
  return result.result.value;
}

async function capture(cdp, sessionId, file) {
  const shot = await cdp.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false }, sessionId);
  fs.writeFileSync(file, Buffer.from(shot.data, "base64"));
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
    cdp = await connect((await waitForCdp()).webSocketDebuggerUrl);
    const target = await cdp.send("Target.createTarget", { url: `http://localhost:${appPort}/continuous.html` });
    const { sessionId } = await cdp.send("Target.attachToTarget", { targetId: target.targetId, flatten: true });
    await cdp.send("Page.enable", {}, sessionId);
    await cdp.send("Runtime.enable", {}, sessionId);
    await cdp.send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 930, deviceScaleFactor: 1, mobile: false }, sessionId);
    await cdp.send("Page.navigate", { url: `http://localhost:${appPort}/continuous.html` }, sessionId);
    await delay(1200);

    const desktop = await evaluate(cdp, sessionId, `(async () => {
      const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      for (let attempt = 0; attempt < 50 && !window.__continuousShapeDemo; attempt += 1) await wait(100);
      const api = window.__continuousShapeDemo;
      if (!api) return { missingApi: true, title: document.title };
      const state = api.state;
      state.phase = "revealed";
      state.stageIndex = api.STAGES.length;
      state.root = { x: 190, y: 620 };
      state.active = { x: 850, y: 680 };
      state.trail = [{ x: 190, y: 620, stage: "start", label: "Start" }];
      state.commits = api.STAGES.map((stage, index) => {
        const option = stage.options[index % (stage.options.length - 1)];
        state.trail.push({ x: 330 + index * 70, y: 360 + Math.sin(index / 1.4) * 120, stage: stage.id, label: option[1], color: "#50c99a" });
        return { stage: stage.id, label: stage.label, key: option[0], value: option[1], signal: option[2] };
      });
      api.render();
      await wait(120);
      return {
        title: document.title,
        commits: api.state.commits.length,
        phase: api.state.phase,
        complete: document.querySelector(".shape-shell")?.classList.contains("is-complete"),
        markdown: document.querySelector(".profile-preview")?.textContent.includes("radial_path:"),
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth
      };
    })()`);
    if (!(desktop.title || "").includes("Continuous Profile") || desktop.commits < 8 || !desktop.complete || !desktop.markdown || desktop.scrollWidth > desktop.clientWidth + 1) {
      throw new Error(JSON.stringify(desktop, null, 2));
    }
    await capture(cdp, sessionId, "prototype-continuous-shape.png");

    const responsive = {};
    for (const width of [768, 375, 320]) {
      await cdp.send("Emulation.setDeviceMetricsOverride", {
        width,
        height: width <= 375 ? 844 : 900,
        deviceScaleFactor: 1,
        mobile: width <= 375,
      }, sessionId);
      await cdp.send("Page.navigate", { url: `http://localhost:${appPort}/continuous.html` }, sessionId);
      await delay(700);
      responsive[width] = await evaluate(cdp, sessionId, `(async () => {
        const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        for (let attempt = 0; attempt < 50 && !window.__continuousShapeDemo; attempt += 1) await wait(100);
        const root = document.querySelector("[data-root]");
        const api = window.__continuousShapeDemo;
        if (!root || !api) return { hasRoot: Boolean(root), missingApi: !api };
        root.dispatchEvent(new MouseEvent("click", { detail: 0, bubbles: true, cancelable: true }));
        await wait(120);
        const keyboardStarted = api.state.phase === "drawing" && Boolean(document.activeElement?.dataset.option);
        api.resetShape();
        api.render();
        await wait(60);
        const pointerRoot = document.querySelector("[data-root]");
        const rect = pointerRoot.getBoundingClientRect();
        pointerRoot.dispatchEvent(new PointerEvent("pointerdown", {
          pointerId: 11,
          pointerType: "mouse",
          isPrimary: true,
          bubbles: true,
          cancelable: true,
          clientX: rect.left + rect.width / 2,
          clientY: rect.top + rect.height / 2,
          buttons: 1
        }));
        api.render();
        await wait(120);
        const clipped = [...document.querySelectorAll('button, a, input, textarea')]
          .filter((node) => {
            const box = node.getBoundingClientRect();
            return box.right > innerWidth + 1 || box.left < -1;
          })
          .map((node) => node.className || node.tagName)
          .slice(0, 6);
        return {
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          hasRoot: true,
          hasOptions: document.querySelectorAll("[data-option]").length === 6,
          optionCount: document.querySelectorAll("[data-option]").length,
          keyboardStarted,
          phase: api.state.phase,
          active: Boolean(api.state.active),
          clipped
        };
      })()`);
      await capture(cdp, sessionId, `prototype-continuous-shape-${width}.png`);
      if (width === 375) await capture(cdp, sessionId, "prototype-continuous-shape-mobile.png");
    }

    await cdp.send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 930, deviceScaleFactor: 1, mobile: false }, sessionId);
    await cdp.send("Emulation.setEmulatedMedia", {
      features: [{ name: "prefers-color-scheme", value: "light" }],
    }, sessionId);
    await cdp.send("Page.navigate", { url: `http://localhost:${appPort}/continuous.html` }, sessionId);
    await delay(700);
    const light = await evaluate(cdp, sessionId, `({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      background: getComputedStyle(document.body).backgroundColor
    })`);
    await capture(cdp, sessionId, "prototype-continuous-shape-light.png");

    const failedResponsive = Object.values(responsive).some((value) => value.scrollWidth > value.clientWidth + 1 || !value.hasRoot || !value.hasOptions || !value.keyboardStarted || value.clipped.length > 0);
    if (failedResponsive || light.scrollWidth > light.clientWidth + 1) throw new Error(JSON.stringify({ responsive, light }, null, 2));
    console.log(JSON.stringify({ desktop, responsive, light }, null, 2));
  } finally {
    if (cdp) cdp.close();
    edge.kill();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

