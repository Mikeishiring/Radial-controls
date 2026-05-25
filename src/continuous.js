const STAGES = [
  {
    id: "team",
    label: "Team",
    prompt: "Start with where you plug into the cohort.",
    options: [
      ["product", "Product", "roadmap"],
      ["design", "Design", "surface"],
      ["engineering", "Engineering", "systems"],
      ["research", "Research", "proof"],
      ["growth", "GTM", "signal"],
      ["other", "Other", "custom"],
    ],
  },
  {
    id: "role",
    label: "Role",
    prompt: "Now make it more specific.",
    options: [
      ["frontend", "Frontend", "ui"],
      ["fullstack", "Full-stack", "ship"],
      ["protocol", "Protocol", "infra"],
      ["product-design", "Product design", "flows"],
      ["pm", "PM", "scope"],
      ["other", "Other", "custom"],
    ],
  },
  {
    id: "geo",
    label: "Geo",
    prompt: "Let the shape pick the local rhythm.",
    options: [
      ["nyc", "NYC", "dense"],
      ["sf-bay", "SF Bay", "network"],
      ["london", "London", "gmt"],
      ["remote-us", "Remote US", "async"],
      ["europe", "Europe", "overlap"],
      ["other", "Other", "custom"],
    ],
  },
  {
    id: "domain",
    label: "Domain",
    prompt: "What should the agent bias toward?",
    options: [
      ["ai-tools", "AI tools", "agent"],
      ["mechanism", "Mechanism", "design"],
      ["infra", "Infra", "scale"],
      ["community", "Community", "cohort"],
      ["markets", "Markets", "liquidity"],
      ["other", "Other", "custom"],
    ],
  },
  {
    id: "comm_style",
    label: "Comm Style",
    prompt: "Choose the path people should use to reach you.",
    options: [
      ["async-first", "Async first", "docs"],
      ["fast-dm", "Fast DM", "urgent"],
      ["issues-prs", "Issues / PRs", "tracked"],
      ["live-pair", "Live pair", "high-band"],
      ["office-hours", "Office hours", "batched"],
      ["other", "Other", "custom"],
    ],
  },
  {
    id: "contribute",
    label: "Contribute",
    prompt: "What would you happily pair on?",
    options: [
      ["review", "Review", "critique"],
      ["demo-build", "Build demo", "prototype"],
      ["research", "Research", "sources"],
      ["design-crit", "Design crit", "ux"],
      ["docs", "Docs", "clarity"],
      ["other", "Other", "custom"],
    ],
  },
  {
    id: "availability",
    label: "Availability",
    prompt: "Give the shape a time signature.",
    options: [
      ["mornings", "Mornings", "focus"],
      ["afternoons", "Afternoons", "calls"],
      ["no-meet", "No-meet blocks", "deep"],
      ["timezone-overlap", "Timezone overlap", "sync"],
      ["weekends", "Weekends", "rare"],
      ["other", "Other", "custom"],
    ],
  },
  {
    id: "intent",
    label: "This Week",
    prompt: "Finish with one concrete intention.",
    options: [
      ["ship", "Ship", "done"],
      ["learn", "Learn", "new"],
      ["pair", "Pair", "together"],
      ["find-users", "Find users", "signal"],
      ["unblock", "Unblock", "next"],
      ["other", "Other", "custom"],
    ],
  },
];

const COLORS = ["#d84b28", "#d6a84c", "#56b88d", "#5b9dce", "#9a80c7", "#c95f7f"];

const state = {
  phase: "idle",
  stageIndex: 0,
  pointer: null,
  active: null,
  root: null,
  trail: [],
  commits: [],
  hotOption: null,
  armed: true,
  size: { w: 900, h: 760 },
  fields: {
    handle: "your-handle",
    name: "",
    github: "",
  },
  context: "",
  copied: false,
};

const app = document.querySelector("#continuous-app");
let stageEl;
let renderQueued = false;
let globalGestureBound = false;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function slugify(value) {
  return String(value || "your-handle")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "your-handle";
}

function getStage() {
  return STAGES[Math.min(state.stageIndex, STAGES.length - 1)];
}

function stageProgress() {
  return state.commits.length / STAGES.length;
}

function rootPoint() {
  const { w, h } = state.size;
  return {
    x: clamp(w * 0.18, 98, w - 118),
    y: clamp(h * 0.68, 300, h - 118),
  };
}

function fanRadius() {
  const { w, h } = state.size;
  return clamp(Math.min(w, h) * 0.22, 112, 190);
}

function bubbleRadius() {
  return state.size.w < 620 ? 34 : 52;
}

function mainAngle() {
  const progress = state.stageIndex / Math.max(1, STAGES.length - 1);
  return (-36 + progress * 204) * Math.PI / 180;
}

function clampOptionPoint(point) {
  const margin = bubbleRadius() + 14;
  return {
    x: clamp(point.x, margin, state.size.w - margin),
    y: clamp(point.y, margin, state.size.h - margin),
  };
}

function optionPositions() {
  if (state.stageIndex >= STAGES.length || !state.active) return [];
  const stage = getStage();
  const count = stage.options.length;
  if (state.size.w < 620 && count === 6) {
    const scale = clamp(state.size.h / 760, 0.88, 1.05);
    const offsets = [
      [-30, -136],
      [52, -124],
      [122, -80],
      [150, -8],
      [128, 70],
      [72, 138],
    ];
    return stage.options.map(([key, label, signal], index) => ({
      key,
      label,
      signal,
      index,
      color: COLORS[index % COLORS.length],
      point: clampOptionPoint({
        x: state.active.x + offsets[index][0] * scale,
        y: state.active.y + offsets[index][1] * scale,
      }),
      angle: Math.atan2(offsets[index][1], offsets[index][0]),
    }));
  }
  const radius = fanRadius();
  const spread = (count > 5 ? 132 : 112) * Math.PI / 180;
  const start = mainAngle() - spread / 2;
  const step = count === 1 ? 0 : spread / (count - 1);
  return stage.options.map(([key, label, signal], index) => {
    const angle = start + step * index;
    const raw = {
      x: state.active.x + Math.cos(angle) * radius,
      y: state.active.y + Math.sin(angle) * radius,
    };
    return {
      key,
      label,
      signal,
      index,
      color: COLORS[index % COLORS.length],
      point: clampOptionPoint(raw),
      angle,
    };
  });
}

function toLocalPoint(event) {
  const rect = stageEl.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function angleDiff(a, b) {
  let d = a - b;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return Math.abs(d);
}

function driftTrail(nextAnchor) {
  const pivot = {
    x: state.size.w * 0.34,
    y: state.size.h * 0.56,
  };
  const turn = 12 * Math.PI / 180;
  const pull = {
    x: -18 - state.stageIndex * 1.5,
    y: 8,
  };
  state.trail = state.trail.map((node, index) => {
    const dx = node.x - pivot.x;
    const dy = node.y - pivot.y;
    const strength = index === state.trail.length - 1 ? 0.38 : 0.74;
    return {
      ...node,
      x: pivot.x + (dx * Math.cos(turn) - dy * Math.sin(turn)) * (1 - 0.018 * strength) + pull.x * strength,
      y: pivot.y + (dx * Math.sin(turn) + dy * Math.cos(turn)) * (1 - 0.018 * strength) + pull.y * strength,
    };
  });

  const last = state.trail[state.trail.length - 1];
  if (last) {
    last.x = last.x * 0.6 + nextAnchor.x * 0.4;
    last.y = last.y * 0.6 + nextAnchor.y * 0.4;
  }
}

function startGesture(event) {
  if (!event.isPrimary && event.pointerType !== "mouse") return;
  event.preventDefault();
  state.phase = "drawing";
  state.stageIndex = 0;
  state.commits = [];
  state.pointer = toLocalPoint(event);
  state.root = rootPoint();
  state.active = { ...state.root };
  state.trail = [{ ...state.root, stage: "start", label: "Start" }];
  state.hotOption = null;
  state.armed = true;
  try {
    stageEl.setPointerCapture(event.pointerId);
  } catch {
    // Synthetic events in verification do not always support capture.
  }
  bindGlobalGesture();
  queueRender();
}

function nearestCommitOption(point) {
  if (!state.active || state.stageIndex >= STAGES.length) return null;
  const options = optionPositions();
  let best = null;
  for (const option of options) {
    const direct = distance(point, option.point);
    const fromActive = distance(point, state.active);
    const pointerAngle = Math.atan2(point.y - state.active.y, point.x - state.active.x);
    const targetAngle = Math.atan2(option.point.y - state.active.y, option.point.x - state.active.x);
    const angular = angleDiff(pointerAngle, targetAngle);
    const threshold = bubbleRadius() * 0.88;
    const magneticCommit = fromActive > fanRadius() * 0.66 && angular < Math.PI / 9;
    const score = direct - (magneticCommit ? 34 : 0);
    if (direct < threshold || magneticCommit) {
      if (!best || score < best.score) best = { ...option, score };
    }
  }
  return best;
}

function commitOption(option) {
  const stage = getStage();
  const anchor = { ...option.point };
  driftTrail(anchor);
  state.trail.push({
    ...anchor,
    stage: stage.id,
    label: option.label,
    color: option.color,
  });
  state.commits.push({
    stage: stage.id,
    label: stage.label,
    key: option.key,
    value: option.label,
    signal: option.signal,
  });
  state.stageIndex += 1;
  state.active = anchor;
  state.hotOption = null;
  state.armed = false;

  if (state.stageIndex >= STAGES.length) {
    state.phase = "revealed";
  }
}

function moveGesture(event) {
  if (state.phase !== "drawing") return;
  const point = toLocalPoint(event);
  state.pointer = point;

  if (!state.armed) {
    if (state.active && distance(point, state.active) > bubbleRadius() * 0.92) {
      state.armed = true;
    } else {
      queueRender();
      return;
    }
  }

  const option = nearestCommitOption(point);
  state.hotOption = option ? option.key : null;
  if (option) commitOption(option);
  queueRender();
}

function endGesture(event) {
  if (state.phase !== "drawing" && state.phase !== "revealed") return;
  try {
    if (stageEl.hasPointerCapture(event.pointerId)) stageEl.releasePointerCapture(event.pointerId);
  } catch {
    // no-op
  }
  unbindGlobalGesture();
  state.pointer = null;
  state.hotOption = null;
  if (state.commits.length === 0) {
    resetShape();
  } else {
    state.phase = state.stageIndex >= STAGES.length ? "revealed" : "idle";
  }
  queueRender();
}

function resetShape() {
  unbindGlobalGesture();
  state.phase = "idle";
  state.stageIndex = 0;
  state.pointer = null;
  state.active = null;
  state.root = rootPoint();
  state.trail = [];
  state.commits = [];
  state.hotOption = null;
  state.armed = true;
}

function selectByClick(optionKey) {
  if (state.phase === "idle" && state.commits.length === 0) {
    state.phase = "drawing";
    state.root = rootPoint();
    state.active = { ...state.root };
    state.trail = [{ ...state.root, stage: "start", label: "Start" }];
  }
  const option = optionPositions().find((item) => item.key === optionKey);
  if (!option) return;
  commitOption(option);
  if (state.stageIndex < STAGES.length) state.phase = "idle";
  queueRender();
}

function polylinePath(points) {
  if (points.length === 0) return "";
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");
}

function shapePath() {
  if (state.trail.length < 3) return "";
  return `${polylinePath(state.trail)} Z`;
}

function normalizedShapePoints(size = 260, pad = 28) {
  const source = state.trail.length > 1
    ? state.trail
    : [
      { x: 0, y: 54 },
      { x: 86, y: 16 },
      { x: 172, y: 52 },
      { x: 214, y: 128 },
      { x: 142, y: 210 },
      { x: 42, y: 184 },
    ];
  const xs = source.map((point) => point.x);
  const ys = source.map((point) => point.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const width = Math.max(1, maxX - minX);
  const height = Math.max(1, maxY - minY);
  const scale = Math.min((size - pad * 2) / width, (size - pad * 2) / height);
  const offsetX = (size - width * scale) / 2;
  const offsetY = (size - height * scale) / 2;
  return source.map((point) => ({
    x: offsetX + (point.x - minX) * scale,
    y: offsetY + (point.y - minY) * scale,
  }));
}

function generatedShapePath(close = true) {
  const points = normalizedShapePoints();
  if (points.length === 0) return "";
  return `${polylinePath(points)}${close && points.length > 2 ? " Z" : ""}`;
}

function generatedShapeStats() {
  const points = normalizedShapePoints(220, 26);
  if (points.length < 2) return { length: 0, turns: 0, spread: 0, read: "waiting" };
  let length = 0;
  let turns = 0;
  for (let i = 1; i < points.length; i += 1) {
    length += distance(points[i - 1], points[i]);
    if (i > 1) {
      const a = Math.atan2(points[i - 1].y - points[i - 2].y, points[i - 1].x - points[i - 2].x);
      const b = Math.atan2(points[i].y - points[i - 1].y, points[i].x - points[i - 1].x);
      turns += angleDiff(a, b);
    }
  }
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const spread = (Math.max(...xs) - Math.min(...xs)) / Math.max(1, Math.max(...ys) - Math.min(...ys));
  const read = turns > 6 ? "angular" : spread > 1.18 ? "stretched" : "compact";
  return { length: Math.round(length), turns: Math.round(turns * 10) / 10, spread: Math.round(spread * 100) / 100, read };
}

function livePath() {
  if (!state.pointer || !state.active || state.phase !== "drawing") return "";
  return `M ${state.active.x.toFixed(1)} ${state.active.y.toFixed(1)} L ${state.pointer.x.toFixed(1)} ${state.pointer.y.toFixed(1)}`;
}

function currentSummary() {
  if (state.commits.length === 0) return "Press the red root orb and drag through the first bubble.";
  const last = state.commits[state.commits.length - 1];
  if (state.stageIndex >= STAGES.length) {
    return `Shape reads ${state.commits.map((item) => item.value).slice(0, 4).join(" / ")} with ${last.value} as the closing intention.`;
  }
  return `${last.value} selected. Keep holding and cross into the next bubble.`;
}

function markdownProfile() {
  const rows = Object.fromEntries(state.commits.map((item) => [item.stage, item.value]));
  const handle = slugify(state.fields.handle);
  const lines = [
    "---",
    `record_id: ${handle}`,
    "record_type: person",
    `name: ${state.fields.name || handle}`,
    `github: ${state.fields.github || "null"}`,
    `shape_completion: ${Math.round(stageProgress() * 100)}%`,
    "radial_path:",
    ...state.commits.map((item, index) => `  - ${index + 1}. ${item.label}: ${item.value} (${item.signal})`),
    "profile:",
    `  team: ${rows.team || "null"}`,
    `  role: ${rows.role || "null"}`,
    `  geo: ${rows.geo || "null"}`,
    `  domain: ${rows.domain || "null"}`,
    `  comm_style: ${rows.comm_style || "null"}`,
    `  contribute: ${rows.contribute || "null"}`,
    `  availability: ${rows.availability || "null"}`,
    `  this_week: ${rows.intent || "null"}`,
    `other_context: ${state.context ? JSON.stringify(state.context) : "null"}`,
    "---",
  ];
  return lines.join("\n");
}

async function copyMarkdown() {
  const text = markdownProfile();
  try {
    await navigator.clipboard.writeText(text);
    state.copied = true;
    queueRender();
    setTimeout(() => {
      state.copied = false;
      queueRender();
    }, 1400);
  } catch {
    state.copied = false;
  }
}

function bindGlobalGesture() {
  if (globalGestureBound) return;
  globalGestureBound = true;
  window.addEventListener("pointermove", moveGesture);
  window.addEventListener("pointerup", endGesture);
  window.addEventListener("pointercancel", endGesture);
}

function unbindGlobalGesture() {
  if (!globalGestureBound) return;
  globalGestureBound = false;
  window.removeEventListener("pointermove", moveGesture);
  window.removeEventListener("pointerup", endGesture);
  window.removeEventListener("pointercancel", endGesture);
}

function syncPreview() {
  const preview = app.querySelector(".profile-preview");
  if (preview) preview.textContent = markdownProfile();
}

function renderShapePreview() {
  const stats = generatedShapeStats();
  const complete = state.stageIndex >= STAGES.length;
  const points = normalizedShapePoints();
  return `
    <section class="shape-preview" aria-label="Generated profile shape">
      <div class="shape-preview-head">
        <p class="question-label mono">generated shape</p>
        <span class="shape-read mono">${escapeHtml(stats.read)}</span>
      </div>
      <svg class="shape-preview-svg" viewBox="0 0 260 260" role="img" aria-label="Generated onboarding mark preview">
        <circle class="mini-orbit" cx="130" cy="130" r="102" />
        <circle class="mini-orbit faint" cx="130" cy="130" r="54" />
        <path class="mini-fill ${complete ? "is-final" : ""}" d="${generatedShapePath(true)}" />
        <path class="mini-line" d="${generatedShapePath(false)}" />
        ${points.map((point, index) => `<circle class="mini-node ${index === points.length - 1 ? "is-current" : ""}" cx="${point.x}" cy="${point.y}" r="${index === 0 ? 5 : 4}" />`).join("")}
      </svg>
      <div class="shape-facts">
        <span><b>${state.commits.length}</b> crossings</span>
        <span><b>${stats.length}</b> path</span>
        <span><b>${stats.turns}</b> turn</span>
      </div>
    </section>
  `;
}

function renderStageSvg() {
  const { w, h } = state.size;
  const orbitCx = w * 0.34;
  const orbitCy = h * 0.56;
  const nodes = state.trail;
  return `
    <svg class="orbit-svg" viewBox="0 0 ${w} ${h}" aria-hidden="true">
      <circle class="orbit-guide major" cx="${orbitCx}" cy="${orbitCy}" r="${Math.min(w, h) * 0.36}" />
      <circle class="orbit-guide" cx="${orbitCx}" cy="${orbitCy}" r="${Math.min(w, h) * 0.24}" />
      <circle class="orbit-guide" cx="${orbitCx}" cy="${orbitCy}" r="${Math.min(w, h) * 0.12}" />
      <path class="shape-fill" d="${shapePath()}" />
      <path class="ink-path" d="${polylinePath(nodes)}" />
      <path class="ink-path live-path" d="${livePath()}" />
      ${nodes.map((node, index) => `
        <circle class="node-dot ${index === 0 ? "root" : ""}" cx="${node.x}" cy="${node.y}" r="${index === nodes.length - 1 ? 8 : 6}" />
        ${index > 0 ? `<text class="node-label" x="${node.x + 12}" y="${node.y - 10}">${index}</text>` : ""}
      `).join("")}
    </svg>
  `;
}

function renderOptions() {
  if (state.stageIndex >= STAGES.length) return "";
  return optionPositions().map((option) => `
    <button
      class="option-bubble ${option.key === state.hotOption ? "is-hot" : ""} ${option.key === "other" ? "is-other" : ""}"
      data-option="${escapeHtml(option.key)}"
      style="left:${option.point.x}px;top:${option.point.y}px;--choice-color:${option.color};"
      type="button"
      aria-label="${escapeHtml(getStage().label)} ${escapeHtml(option.label)}"
    >
      <span class="bubble-index">${option.index + 1}</span>
      <span>
        <span class="bubble-label">${escapeHtml(option.label)}</span>
        <span class="bubble-signal">${escapeHtml(option.signal)}</span>
      </span>
    </button>
  `).join("");
}

function renderCrumbs() {
  return state.commits.map((item) => `
    <div class="crumb">
      <b>${escapeHtml(item.label)}</b>
      <span>${escapeHtml(item.value)}</span>
    </div>
  `).join("");
}

function render() {
  const root = state.root || rootPoint();
  const stage = getStage();
  const complete = state.stageIndex >= STAGES.length;
  app.className = `shape-shell ${state.phase === "drawing" ? "is-drawing-shell" : ""} ${complete ? "is-complete" : ""}`;
  app.innerHTML = `
    <section class="stage-panel">
      <header class="stage-header">
        <p class="kicker">continuous radial onboarding</p>
        <h1 class="stage-title">Draw the profile shape.</h1>
        <p class="stage-copy">${escapeHtml(currentSummary())}</p>
      </header>
      <section
        class="gesture-stage ${state.phase === "drawing" ? "is-drawing" : ""} ${complete ? "is-revealed" : ""}"
        data-stage
      >
        ${renderStageSvg()}
        ${state.trail.length > 0 ? `<div class="active-node" style="left:${state.active?.x ?? root.x}px;top:${state.active?.y ?? root.y}px;"></div>` : ""}
        <button class="root-orb" data-root style="left:${root.x}px;top:${root.y}px;" type="button" aria-label="Hold and drag to begin">
          <span class="root-mark"></span>
        </button>
        ${renderOptions()}
        ${state.pointer && state.phase === "drawing" ? `<div class="cursor-halo" style="left:${state.pointer.x}px;top:${state.pointer.y}px;"></div>` : ""}
      </section>
      <footer class="stage-meter">
        <div>
          <div class="progress-number">${Math.round(stageProgress() * 100)}%</div>
          <div class="progress-label mono">${complete ? "shape revealed" : `${state.commits.length}/${STAGES.length} crossings`}</div>
        </div>
        <div class="crumbs">${renderCrumbs()}</div>
      </footer>
    </section>
    <aside class="side-panel">
      ${renderShapePreview()}
      <section class="side-block">
        <p class="question-label mono">${complete ? "reveal" : `step ${Math.min(state.stageIndex + 1, STAGES.length)} / ${STAGES.length}`}</p>
        <h2 class="question-title">${complete ? "This is the onboarding mark." : escapeHtml(stage.label)}</h2>
        <p class="question-copy">${complete ? "The jaggedness is intentional: the final mark records the route, not a normalized chart." : escapeHtml(stage.prompt)}</p>
      </section>
      <p class="agent-note">Agent context can pre-rank these bubbles from cohort data. The final bubble stays Other when the prediction misses.</p>
      <section class="side-block fields">
        <div class="field-row">
          <label for="handle">Handle</label>
          <input id="handle" data-field="handle" value="${escapeHtml(state.fields.handle)}" autocomplete="off" />
        </div>
        <div class="field-row">
          <label for="name">Name</label>
          <input id="name" data-field="name" value="${escapeHtml(state.fields.name)}" placeholder="your name" autocomplete="off" />
        </div>
        <div class="field-row">
          <label for="github">Github</label>
          <input id="github" data-field="github" value="${escapeHtml(state.fields.github)}" placeholder="username" autocomplete="off" />
        </div>
      </section>
      <section class="side-block">
        <p class="question-label mono">anything else</p>
        <textarea class="context-area" data-context placeholder="Add nuance that did not fit the rings.">${escapeHtml(state.context)}</textarea>
      </section>
      <section class="side-block">
        <p class="reveal-line">Reveal complete. The drawn path can now become the PR body.</p>
        <div class="output-actions">
          <button class="command primary" data-reset type="button">Reset shape</button>
          <button class="command" data-copy type="button">${state.copied ? "Copied" : "Copy markdown"}</button>
        </div>
      </section>
      <pre class="profile-preview">${escapeHtml(markdownProfile())}</pre>
    </aside>
  `;

  stageEl = app.querySelector("[data-stage]");
  stageEl.addEventListener("pointermove", moveGesture);
  stageEl.addEventListener("pointerup", endGesture);
  stageEl.addEventListener("pointercancel", endGesture);
  app.querySelector("[data-root]").addEventListener("pointerdown", startGesture);
  app.querySelectorAll("[data-option]").forEach((button) => {
    button.addEventListener("click", () => selectByClick(button.dataset.option));
  });
  app.querySelector("[data-reset]").addEventListener("click", resetShape);
  app.querySelector("[data-copy]").addEventListener("click", copyMarkdown);
  app.querySelectorAll("[data-field]").forEach((input) => {
    input.addEventListener("input", () => {
      state.fields[input.dataset.field] = input.value;
      syncPreview();
    });
  });
  app.querySelector("[data-context]").addEventListener("input", (event) => {
    state.context = event.target.value;
    syncPreview();
  });
}

function queueRender() {
  if (renderQueued) return;
  renderQueued = true;
  requestAnimationFrame(() => {
    renderQueued = false;
    render();
  });
}

function measure() {
  if (!stageEl) return;
  const rect = stageEl.getBoundingClientRect();
  state.size = {
    w: Math.max(320, rect.width),
    h: Math.max(480, rect.height),
  };
  state.root = rootPoint();
  if (state.trail.length === 0) state.active = null;
  queueRender();
}

render();
measure();
window.addEventListener("resize", measure);

window.__continuousShapeDemo = {
  state,
  resetShape,
  render,
  STAGES,
};
