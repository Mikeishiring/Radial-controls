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

const SHAPE_PULLS = {
  product: { r: 1.05, twist: -0.04, x: -0.1, y: -0.18 },
  design: { r: 0.86, twist: 0.13, x: 0.2, y: -0.08 },
  engineering: { r: 1.3, twist: -0.18, x: -0.24, y: 0.06 },
  research: { r: 0.98, twist: 0.08, x: 0.12, y: -0.02 },
  growth: { r: 1.14, twist: 0.12, x: 0.16, y: 0.08 },
  frontend: { r: 1.02, twist: 0.02, x: 0.04, y: -0.12 },
  fullstack: { r: 1.18, twist: -0.08, x: -0.12, y: -0.02 },
  protocol: { r: 1.34, twist: -0.2, x: -0.18, y: 0.16 },
  "product-design": { r: 0.82, twist: 0.18, x: 0.28, y: -0.04 },
  pm: { r: 1.0, twist: 0.08, x: 0.06, y: 0.08 },
  nyc: { r: 1.28, twist: -0.16, x: -0.3, y: -0.08 },
  "sf-bay": { r: 1.12, twist: 0.06, x: 0.12, y: -0.1 },
  london: { r: 1.04, twist: -0.02, x: -0.04, y: 0.08 },
  "remote-us": { r: 0.78, twist: 0.22, x: 0.28, y: 0.1 },
  europe: { r: 0.94, twist: 0.08, x: 0.1, y: 0.12 },
  "ai-tools": { r: 1.1, twist: 0.1, x: 0.1, y: -0.12 },
  mechanism: { r: 1.24, twist: -0.12, x: -0.14, y: 0.02 },
  infra: { r: 1.28, twist: -0.1, x: -0.2, y: 0.16 },
  community: { r: 0.88, twist: 0.18, x: 0.22, y: 0.06 },
  markets: { r: 1.16, twist: -0.02, x: -0.06, y: -0.08 },
  "async-first": { r: 0.78, twist: 0.24, x: 0.26, y: 0.12 },
  "fast-dm": { r: 1.32, twist: -0.2, x: -0.24, y: -0.08 },
  "issues-prs": { r: 1.08, twist: -0.04, x: -0.08, y: 0.1 },
  "live-pair": { r: 1.0, twist: 0.12, x: 0.08, y: -0.02 },
  "office-hours": { r: 0.92, twist: 0.14, x: 0.1, y: 0.14 },
  review: { r: 1.04, twist: -0.04, x: -0.06, y: -0.04 },
  "demo-build": { r: 1.16, twist: 0.02, x: -0.08, y: -0.12 },
  "design-crit": { r: 0.84, twist: 0.2, x: 0.26, y: -0.04 },
  docs: { r: 0.9, twist: 0.12, x: 0.12, y: 0.1 },
  mornings: { r: 1.02, twist: -0.08, x: -0.08, y: -0.12 },
  afternoons: { r: 0.98, twist: 0.06, x: 0.08, y: 0.02 },
  "no-meet": { r: 1.2, twist: -0.14, x: -0.18, y: 0.1 },
  "timezone-overlap": { r: 0.9, twist: 0.16, x: 0.18, y: 0.1 },
  weekends: { r: 0.82, twist: 0.18, x: 0.2, y: 0.16 },
  ship: { r: 1.26, twist: -0.16, x: -0.18, y: -0.1 },
  learn: { r: 0.9, twist: 0.18, x: 0.18, y: -0.02 },
  pair: { r: 0.96, twist: 0.1, x: 0.08, y: 0.04 },
  "find-users": { r: 1.12, twist: 0.08, x: 0.14, y: -0.08 },
  unblock: { r: 1.22, twist: -0.12, x: -0.18, y: 0.02 },
  other: { r: 1.36, twist: 0.26, x: 0.18, y: 0.18 },
};

const GUIDE_OPTION_INDEX = 2;

const PREDICTIVE_WEIGHTS = {
  product: {
    role: { pm: 5, frontend: 3, fullstack: 2 },
    geo: { "sf-bay": 3, nyc: 2, london: 1 },
    domain: { "ai-tools": 4, markets: 2, community: 1 },
    comm_style: { "issues-prs": 3, "async-first": 2, "office-hours": 1 },
    contribute: { "demo-build": 4, review: 2, docs: 1 },
    intent: { ship: 5, "find-users": 3, unblock: 2 },
  },
  design: {
    role: { "product-design": 6, frontend: 2, pm: 1 },
    geo: { "remote-us": 3, nyc: 2, "sf-bay": 2 },
    domain: { community: 3, "ai-tools": 2, mechanism: 1 },
    comm_style: { "async-first": 4, "live-pair": 2, "office-hours": 2 },
    contribute: { "design-crit": 5, "demo-build": 3, review: 2 },
    intent: { learn: 3, ship: 3, pair: 2 },
  },
  engineering: {
    role: { fullstack: 5, protocol: 4, frontend: 3 },
    geo: { nyc: 3, "sf-bay": 3, "remote-us": 2 },
    domain: { infra: 5, mechanism: 3, "ai-tools": 2 },
    comm_style: { "issues-prs": 5, "async-first": 3, "fast-dm": 2 },
    contribute: { review: 4, "demo-build": 3, docs: 2 },
    availability: { "no-meet": 4, mornings: 3, "timezone-overlap": 2 },
    intent: { ship: 5, unblock: 4, learn: 1 },
  },
  research: {
    role: { protocol: 3, pm: 2, "product-design": 2 },
    domain: { mechanism: 5, markets: 3, "ai-tools": 2 },
    comm_style: { "async-first": 4, "issues-prs": 2, "office-hours": 2 },
    contribute: { research: 5, review: 3, docs: 2 },
    intent: { learn: 4, unblock: 2, ship: 1 },
  },
  nyc: {
    comm_style: { "fast-dm": 4, "live-pair": 3, "issues-prs": 1 },
    availability: { afternoons: 3, mornings: 2, "timezone-overlap": 1 },
    intent: { ship: 4, pair: 2, "find-users": 2 },
  },
  "remote-us": {
    comm_style: { "async-first": 5, "issues-prs": 3, "office-hours": 2 },
    availability: { "timezone-overlap": 4, "no-meet": 3, mornings: 2 },
    intent: { learn: 3, unblock: 3, ship: 2 },
  },
  "product-design": {
    domain: { community: 3, "ai-tools": 2, mechanism: 2 },
    comm_style: { "async-first": 4, "live-pair": 3 },
    contribute: { "design-crit": 5, "demo-build": 3 },
  },
  protocol: {
    domain: { infra: 5, mechanism: 4, markets: 2 },
    comm_style: { "issues-prs": 5, "async-first": 3 },
    availability: { "no-meet": 5, "timezone-overlap": 2 },
    intent: { unblock: 4, ship: 3, learn: 2 },
  },
};

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
  const minY = Math.min(300, h * 0.48);
  const maxY = Math.max(minY, h - 118);
  return {
    x: clamp(w * 0.18, 98, w - 118),
    y: clamp(h * 0.68, minY, maxY),
  };
}

function fanRadius() {
  const { w, h } = state.size;
  return clamp(Math.min(w, h) * 0.22, 112, 190);
}

function bubbleRadius() {
  return state.size.w < 620 ? 31 : 46;
}

function mainAngle() {
  const progress = state.stageIndex / Math.max(1, STAGES.length - 1);
  return (-36 + progress * 204) * Math.PI / 180;
}

function clampOptionPoint(point) {
  const radius = bubbleRadius();
  const sideMargin = radius + 14;
  const topMargin = Math.min(state.size.h * 0.44, radius + 260);
  const bottomMargin = radius + 92;
  return {
    x: clamp(point.x, sideMargin, state.size.w - sideMargin),
    y: clamp(point.y, topMargin, state.size.h - bottomMargin),
  };
}

function relaxOptionPoints(options) {
  const desiredGap = bubbleRadius() * 2.08;
  const sideMargin = bubbleRadius() + 14;
  const relaxed = options.map((option) => ({ ...option, point: { ...option.point } }));
  for (let pass = 0; pass < 5; pass += 1) {
    for (let i = 0; i < relaxed.length; i += 1) {
      for (let j = i + 1; j < relaxed.length; j += 1) {
        const a = relaxed[i].point;
        const b = relaxed[j].point;
        if (Math.abs(a.y - b.y) > desiredGap * 0.72) continue;
        const dx = b.x - a.x;
        const overlap = desiredGap - Math.abs(dx);
        if (overlap <= 0) continue;
        const direction = dx >= 0 ? 1 : -1;
        a.x = clamp(a.x - direction * overlap * 0.5, sideMargin, state.size.w - sideMargin);
        b.x = clamp(b.x + direction * overlap * 0.5, sideMargin, state.size.w - sideMargin);
      }
    }
  }
  return relaxed;
}

function rankedStageOptions(stage) {
  const scored = stage.options.map((option, originalIndex) => {
    const [key] = option;
    if (key === "other") return { option, originalIndex, score: -999 };
    let score = stage.options.length - originalIndex;
    for (const commit of state.commits) {
      score += PREDICTIVE_WEIGHTS[commit.key]?.[stage.id]?.[key] || 0;
    }
    return { option, originalIndex, score };
  });
  scored.sort((a, b) => b.score - a.score || a.originalIndex - b.originalIndex);
  return scored.map((item) => item.option);
}

function optionPositions() {
  if (state.stageIndex >= STAGES.length) return [];
  const anchor = state.active || rootPoint();
  const stage = getStage();
  const optionsForStage = rankedStageOptions(stage);
  const count = optionsForStage.length;
  if (state.size.w < 620 && count === 6) {
    const scale = clamp(state.size.h / 760, 0.88, 1.05);
    const offsets = [
      [-30, -136],
      [52, -124],
      [122, -80],
      [150, -8],
      [154, 68],
      [74, 148],
    ];
    return relaxOptionPoints(optionsForStage.map(([key, label, signal], index) => ({
      key,
      label,
      signal,
      index,
      predicted: state.commits.length > 0 && index < 2 && key !== "other",
      color: COLORS[index % COLORS.length],
      point: clampOptionPoint({
        x: anchor.x + offsets[index][0] * scale,
        y: anchor.y + offsets[index][1] * scale,
      }),
      angle: Math.atan2(offsets[index][1], offsets[index][0]),
    })));
  }
  const radius = fanRadius();
  const spread = (count > 5 ? 132 : 112) * Math.PI / 180;
  const start = mainAngle() - spread / 2;
  const step = count === 1 ? 0 : spread / (count - 1);
  return relaxOptionPoints(optionsForStage.map(([key, label, signal], index) => {
    const angle = start + step * index;
    const raw = {
      x: anchor.x + Math.cos(angle) * radius,
      y: anchor.y + Math.sin(angle) * radius,
    };
    return {
      key,
      label,
      signal,
      index,
      predicted: state.commits.length > 0 && index < 2 && key !== "other",
      color: COLORS[index % COLORS.length],
      point: clampOptionPoint(raw),
      angle,
    };
  }));
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
      renderGestureFrame();
      return;
    }
  }

  const option = nearestCommitOption(point);
  state.hotOption = option ? option.key : null;
  if (option) {
    commitOption(option);
    queueRender();
    return;
  }
  renderGestureFrame();
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

function semanticCommits() {
  return STAGES.map((stage, index) => {
    const selected = state.commits.find((commit) => commit.stage === stage.id);
    if (selected) return { ...selected, ghost: false };
    const fallback = stage.options[Math.min(GUIDE_OPTION_INDEX, stage.options.length - 1)];
    return {
      stage: stage.id,
      label: stage.label,
      key: fallback[0],
      value: fallback[1],
      signal: fallback[2],
      ghost: true,
    };
  });
}

function semanticSourcePoints() {
  const commits = semanticCommits();
  const count = Math.max(1, commits.length);
  return commits.map((commit, index) => {
    const pull = SHAPE_PULLS[commit.key] || SHAPE_PULLS.other;
    const stage = STAGES.find((item) => item.id === commit.stage);
    const optionIndex = Math.max(0, stage?.options.findIndex((option) => option[0] === commit.key) ?? 0);
    const base = -Math.PI / 2 + (index / count) * Math.PI * 2;
    const angle = base + (pull.twist || 0) + (optionIndex - 2.5) * 0.018;
    const radius = 86 * (pull.r || 1);
    return {
      x: Math.cos(angle) * radius + (pull.x || 0) * 44,
      y: Math.sin(angle) * radius + (pull.y || 0) * 44,
      ghost: commit.ghost,
      key: commit.key,
    };
  });
}

function normalizedShapePoints(size = 260, pad = 28) {
  const source = semanticSourcePoints();
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
    ghost: point.ghost,
    key: point.key,
  }));
}

function generatedShapePath(close = true) {
  const points = normalizedShapePoints().filter((point) => !point.ghost);
  if (points.length < 2) return "";
  return `${polylinePath(points)}${close && points.length > 2 ? " Z" : ""}`;
}

function generatedGuidePath() {
  const points = normalizedShapePoints();
  return points.length > 2 ? `${polylinePath(points)} Z` : "";
}

function generatedShapeStats() {
  const points = normalizedShapePoints(220, 26).filter((point) => !point.ghost);
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
  const keys = state.commits.map((commit) => commit.key);
  const hasSharp = keys.some((key) => ["engineering", "fullstack", "protocol", "nyc", "infra", "fast-dm", "ship", "unblock"].includes(key));
  const hasRounded = keys.some((key) => ["design", "product-design", "remote-us", "async-first", "community", "design-crit", "learn"].includes(key));
  const read = state.commits.length === 0
    ? "forming"
    : hasSharp && keys.includes("nyc")
      ? "triangular"
      : hasRounded && (keys.includes("remote-us") || keys.includes("async-first"))
        ? "rounded"
        : turns > 6
          ? "angular"
          : spread > 1.18
            ? "stretched"
            : "compact";
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
  return `${last.value} selected. Cross into the next bubble.`;
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

function renderGestureFrame() {
  const live = app.querySelector(".live-path");
  if (live) live.setAttribute("d", livePath());
  const cursor = app.querySelector(".cursor-halo");
  if (cursor && state.pointer) {
    cursor.style.left = `${state.pointer.x}px`;
    cursor.style.top = `${state.pointer.y}px`;
  }
  app.querySelectorAll(".option-bubble").forEach((bubble) => {
    bubble.classList.toggle("is-hot", bubble.dataset.option === state.hotOption);
  });
}

function renderShapePreview() {
  const stats = generatedShapeStats();
  const complete = state.stageIndex >= STAGES.length;
  const points = normalizedShapePoints();
  return `
    <section class="shape-preview" aria-label="Generated profile shape">
      <div class="shape-preview-head">
        <p class="question-label mono">generated shape</p>
        <div class="shape-preview-actions">
          <span class="shape-read mono">${escapeHtml(stats.read)}</span>
          <button class="mini-reset mono" data-reset type="button">reset</button>
        </div>
      </div>
      <svg class="shape-preview-svg" viewBox="0 0 260 260" role="img" aria-label="Generated onboarding mark preview">
        <circle class="mini-orbit" cx="130" cy="130" r="102" />
        <circle class="mini-orbit faint" cx="130" cy="130" r="54" />
        <path class="mini-guide-shape" d="${generatedGuidePath()}" />
        <path class="mini-fill ${complete ? "is-final" : ""}" d="${generatedShapePath(true)}" />
        <path class="mini-line" d="${generatedShapePath(false)}" />
        ${points.map((point, index) => `<circle class="mini-node ${point.ghost ? "is-ghost" : "is-selected"} ${!point.ghost && index === state.commits.length - 1 ? "is-current" : ""} ${point.ghost && index === state.commits.length ? "is-next" : ""}" cx="${point.x}" cy="${point.y}" r="${!point.ghost && index === state.commits.length - 1 ? 6 : 4}" />`).join("")}
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
      class="option-bubble ${option.key === state.hotOption ? "is-hot" : ""} ${option.key === "other" ? "is-other" : ""} ${option.predicted ? "is-predicted" : ""}"
      data-option="${escapeHtml(option.key)}"
      style="left:${option.point.x}px;top:${option.point.y}px;--choice-color:${option.color};"
      type="button"
      aria-label="${escapeHtml(getStage().label)} ${escapeHtml(option.label)}"
    >
      <span class="bubble-index">${option.index + 1}</span>
      <span>
        <span class="bubble-label">${escapeHtml(option.label)}</span>
        <span class="bubble-signal">${escapeHtml(option.predicted ? `suggested / ${option.signal}` : option.signal)}</span>
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
  app.querySelector("[data-root]").addEventListener("pointerdown", startGesture);
  app.querySelectorAll("[data-option]").forEach((button) => {
    button.addEventListener("click", () => selectByClick(button.dataset.option));
  });
  app.querySelectorAll("[data-reset]").forEach((button) => {
    button.addEventListener("click", resetShape);
  });
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
