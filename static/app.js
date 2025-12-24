const state = {
  step: 1,
  platforms: new Set(),
};

const steps = Array.from(document.querySelectorAll(".step"));
const chips = Array.from(document.querySelectorAll(".chip"));

chips.forEach((chip) => {
  chip.addEventListener("click", () => togglePlatform(chip.dataset.platform));
});

function togglePlatform(platform) {
  if (state.platforms.has(platform)) {
    state.platforms.delete(platform);
  } else {
    state.platforms.add(platform);
  }
  refreshChips();
}

function refreshChips() {
  chips.forEach((chip) => {
    const isSelected = state.platforms.has(chip.dataset.platform);
    chip.classList.toggle("selected", isSelected);
  });
}

function showStep(stepNumber) {
  state.step = stepNumber;
  steps.forEach((step) => {
    step.classList.toggle("active", Number(step.dataset.step) === stepNumber);
  });
}

function nextStep() {
  showStep(Math.min(4, state.step + 1));
}

function prevStep() {
  showStep(Math.max(1, state.step - 1));
}

function resetWizard() {
  state.platforms = new Set();
  refreshChips();
  ["followers", "avg_reach", "engagement", "audience"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  document.getElementById("goal").value = "";
  document.getElementById("duration").value = "30";
  document.getElementById("resultArea").innerHTML = '<em class="muted">Waiting to generate…</em>';
  showStep(1);
}

async function submitWizard() {
  if (!state.platforms.size) {
    alert("Select at least one platform.");
    return;
  }

  const payload = {
    platforms: Array.from(state.platforms),
    insights: {
      followers: document.getElementById("followers").value || null,
      average_reach: document.getElementById("avg_reach").value || null,
      engagement_rate: document.getElementById("engagement").value || null,
    },
    goal: document.getElementById("goal").value || null,
    duration_days: Number(document.getElementById("duration").value),
    audience: document.getElementById("audience").value || null,
  };

  showStep(4);
  const area = document.getElementById("resultArea");
  area.innerHTML = "<em>Generating strategy…</em>";

  try {
    const response = await fetch("/generate-strategy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText || "Request failed");
    }

    const data = await response.json();
    renderResult(data);
  } catch (err) {
    area.innerHTML = `<div style="color:#b91c1c">Error generating strategy: ${err.message}</div>`;
  }
}

function renderResult(data) {
  const area = document.getElementById("resultArea");
  const strategy = data.strategy_text || data.strategy || "No strategy text returned.";
  const rawPrompt = data.raw_prompt ? `<details><summary>Prompt (debug)</summary><pre>${escapeHtml(data.raw_prompt)}</pre></details>` : "";
  area.innerHTML = `<pre>${escapeHtml(strategy)}</pre>${rawPrompt}`;
}

function escapeHtml(value) {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}


