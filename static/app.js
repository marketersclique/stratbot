// Platform-specific form field configurations
const PLATFORM_FORMS = {
  Instagram: {
    required: [
      { id: 'followers', label: 'Followers', placeholder: 'e.g. 1,200', helper: 'Available on your profile' },
      { id: 'average_reel_views', label: 'Average Reel Views', placeholder: 'e.g. 800', helper: 'Approx average of your recent reels' },
      { id: 'accounts_reached', label: 'Accounts Reached (Last 30 days)', placeholder: 'e.g. 12,000', helper: 'Profile → Insights → Reach' }
    ],
    optional: [
      { id: 'profile_visits', label: 'Profile Visits (Last 30 days)', placeholder: 'e.g. 1,500', type: 'text' },
      { id: 'posting_frequency', label: 'Posting Frequency', type: 'select', options: ['1–2 times per week', '3–4 times per week', 'Almost daily', 'Inconsistent'] },
      { id: 'primary_content_type', label: 'Primary Content Type', type: 'select', options: ['Reels', 'Carousels', 'Mixed'] }
    ],
    defaults: { followers: '1200', average_reel_views: '800', accounts_reached: '12000', profile_visits: '1500', posting_frequency: '3–4 times per week', primary_content_type: 'Mixed' }
  },
  Facebook: {
    required: [
      { id: 'page_followers', label: 'Page Followers', placeholder: 'e.g. 2,500', helper: '' },
      { id: 'average_reach', label: 'Average Reach per Post', placeholder: 'e.g. 900', helper: '' }
    ],
    optional: [
      { id: 'engagement_level', label: 'Engagement Level', type: 'select', options: ['Low', 'Medium', 'Good'] },
      { id: 'page_type', label: 'Page Type', type: 'select', options: ['Local Business', 'Brand / Community'] }
    ],
    defaults: { page_followers: '2500', average_reach: '900', engagement_level: 'Medium', page_type: 'Brand / Community' }
  },
  TikTok: {
    required: [
      { id: 'followers', label: 'Followers', placeholder: 'e.g. 3,000', helper: '' },
      { id: 'average_views', label: 'Average Views per Video', placeholder: 'e.g. 1,500', helper: '' }
    ],
    optional: [
      { id: 'average_watch_time', label: 'Average Watch Time (seconds)', placeholder: 'e.g. 6', type: 'text' },
      { id: 'posting_frequency', label: 'Posting Frequency', type: 'select', options: ['1–2 times per week', '3–5 times per week', 'Daily'] },
      { id: 'trend_usage', label: 'Trend Usage', type: 'select', options: ['Rare', 'Sometimes', 'Often'] }
    ],
    defaults: { followers: '3000', average_views: '1500', average_watch_time: '6', posting_frequency: '3–5 times per week', trend_usage: 'Sometimes' }
  },
  YouTube: {
    required: [
      { id: 'subscribers', label: 'Subscribers', placeholder: 'e.g. 5,000', helper: '' },
      { id: 'average_views', label: 'Average Views per Video', placeholder: 'e.g. 2,000', helper: '' }
    ],
    optional: [
      { id: 'average_watch_time', label: 'Average Watch Time (minutes)', placeholder: 'e.g. 3.5', type: 'text' },
      { id: 'upload_frequency', label: 'Upload Frequency', type: 'select', options: ['Weekly', '2–3 videos per week', 'Inconsistent'] },
      { id: 'post_shorts', label: 'Do you post Shorts?', type: 'select', options: ['Yes', 'No'] }
    ],
    defaults: { subscribers: '5000', average_views: '2000', average_watch_time: '3.5', upload_frequency: 'Weekly', post_shorts: 'Yes' }
  },
  LinkedIn: {
    required: [
      { id: 'followers', label: 'Followers / Connections', placeholder: 'e.g. 1,800', helper: '' },
      { id: 'average_impressions', label: 'Average Impressions per Post', placeholder: 'e.g. 1,200', helper: '' }
    ],
    optional: [
      { id: 'profile_views', label: 'Profile Views (Last 30 days)', placeholder: 'e.g. 300', type: 'text' },
      { id: 'content_type', label: 'Content Type', type: 'select', options: ['Text', 'Carousel', 'Video'] },
      { id: 'posting_frequency', label: 'Posting Frequency', type: 'select', options: ['1–2 times per week', '3–4 times per week', 'Almost daily'] }
    ],
    defaults: { followers: '1800', average_impressions: '1200', profile_views: '300', content_type: 'Text', posting_frequency: '3–4 times per week' }
  },
  Twitter: {
    required: [
      { id: 'followers', label: 'Followers', placeholder: 'e.g. 2,000', helper: '' },
      { id: 'average_impressions', label: 'Average Impressions per Post', placeholder: 'e.g. 1,500', helper: '' }
    ],
    optional: [
      { id: 'posting_frequency', label: 'Posting Frequency', type: 'select', options: ['1–2 tweets per day', '3–5 tweets per day', 'Inconsistent'] },
      { id: 'content_style', label: 'Content Style', type: 'select', options: ['Single tweets', 'Threads', 'Mixed'] },
      { id: 'profile_visits', label: 'Profile Visits (Last 30 days)', placeholder: 'e.g. 800', type: 'text' }
    ],
    defaults: { followers: '2000', average_impressions: '1500', posting_frequency: '3–5 tweets per day', content_style: 'Mixed', profile_visits: '800' }
  },
  Pinterest: {
    required: [
      { id: 'monthly_viewers', label: 'Monthly Viewers', placeholder: 'e.g. 120,000', helper: '' },
      { id: 'average_pin_impressions', label: 'Average Pin Impressions', placeholder: 'e.g. 2,500', helper: '' }
    ],
    optional: [
      { id: 'link_clicks', label: 'Link Clicks (Last 30 days)', placeholder: 'e.g. 1,200', type: 'text' },
      { id: 'content_type', label: 'Content Type', type: 'select', options: ['Product Pins', 'Idea Pins', 'Mixed'] },
      { id: 'posting_frequency', label: 'Posting Frequency', type: 'select', options: ['Daily', '3–4 times per week', 'Inconsistent'] }
    ],
    defaults: { monthly_viewers: '120000', average_pin_impressions: '2500', link_clicks: '1200', content_type: 'Mixed', posting_frequency: '3–4 times per week' }
  }
};

const state = {
  step: 1,
  platforms: new Set(),
  platformData: {}, // Store data per platform
  estimatedFlags: {} // Track which platforms have estimated data
};

const steps = Array.from(document.querySelectorAll(".step"));
const chips = Array.from(document.querySelectorAll(".chip"));
const stepDots = Array.from(document.querySelectorAll(".step-dot"));

// Initialize platform chips
chips.forEach((chip) => {
  chip.addEventListener("click", () => togglePlatform(chip.dataset.platform));
});

function togglePlatform(platform) {
  if (state.platforms.has(platform)) {
    state.platforms.delete(platform);
    delete state.platformData[platform];
    delete state.estimatedFlags[platform];
  } else {
    state.platforms.add(platform);
    state.platformData[platform] = {};
    state.estimatedFlags[platform] = false;
  }
  refreshChips();
  // Regenerate forms if we're on step 2
  if (state.step === 2) {
    renderPlatformForms();
  }
}

function refreshChips() {
  chips.forEach((chip) => {
    const isSelected = state.platforms.has(chip.dataset.platform);
    chip.classList.toggle("selected", isSelected);
  });
}

function updateProgress() {
  const progressFill = document.getElementById("progressFill");
  const progress = (state.step / 4) * 100;
  if (progressFill) {
    progressFill.style.width = `${progress}%`;
  }
}

function updateStepIndicators() {
  stepDots.forEach((dot, index) => {
    const stepNum = index + 1;
    if (stepNum <= state.step) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
}

function renderPlatformForms() {
  const container = document.getElementById("platformFormsContainer");
  if (!container) return;

  container.innerHTML = '';

  if (state.platforms.size === 0) {
    container.innerHTML = '<p class="text-gray-500 text-center py-8">Please select at least one platform in Step 1.</p>';
    return;
  }

  Array.from(state.platforms).forEach((platform) => {
    const config = PLATFORM_FORMS[platform];
    if (!config) return;

    const platformCard = document.createElement('div');
    platformCard.className = 'bg-gray-50 rounded-lg p-6 border border-gray-200';
    platformCard.innerHTML = `
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">${platform}</h3>
        <button onclick="fillDefaults('${platform}')" class="text-sm text-orange-600 hover:text-orange-700 font-medium">
          I don't know exact numbers
        </button>
      </div>
      <div class="space-y-4" id="platform-${platform}-fields">
        ${renderPlatformFields(platform, config)}
      </div>
    `;
    container.appendChild(platformCard);
  });
}

function renderPlatformFields(platform, config) {
  let html = '';

  // Required fields
  config.required.forEach(field => {
    html += `
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          ${field.label} <span class="text-red-500">*</span>
        </label>
        ${field.helper ? `<p class="text-xs text-gray-500 mb-1">${field.helper}</p>` : ''}
        <input
          type="text"
          id="${platform}-${field.id}"
          data-platform="${platform}"
          data-field="${field.id}"
          placeholder="${field.placeholder}"
          class="input-field w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          ${state.platformData[platform] && state.platformData[platform][field.id] ? `value="${state.platformData[platform][field.id]}"` : ''}
        />
      </div>
    `;
  });

  // Optional fields
  config.optional.forEach(field => {
    const isSelect = field.type === 'select';
    html += `
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          ${field.label} <span class="text-gray-400 font-normal text-xs">(optional)</span>
        </label>
        ${isSelect ? `
          <select
            id="${platform}-${field.id}"
            data-platform="${platform}"
            data-field="${field.id}"
            class="input-field w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 bg-white"
          >
            <option value="">Select...</option>
            ${field.options.map(opt => `<option value="${opt}" ${state.platformData[platform] && state.platformData[platform][field.id] === opt ? 'selected' : ''}>${opt}</option>`).join('')}
          </select>
        ` : `
          <input
            type="text"
            id="${platform}-${field.id}"
            data-platform="${platform}"
            data-field="${field.id}"
            placeholder="${field.placeholder}"
            class="input-field w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            ${state.platformData[platform] && state.platformData[platform][field.id] ? `value="${state.platformData[platform][field.id]}"` : ''}
          />
        `}
      </div>
    `;
  });

  return html;
}

function fillDefaults(platform) {
  const config = PLATFORM_FORMS[platform];
  if (!config || !config.defaults) return;

  state.estimatedFlags[platform] = true;
  state.platformData[platform] = { ...config.defaults };

  // Fill all fields with defaults
  Object.keys(config.defaults).forEach(fieldId => {
    const input = document.getElementById(`${platform}-${fieldId}`);
    if (input) {
      input.value = config.defaults[fieldId];
      // Trigger change event
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });

  showNotification(`Filled ${platform} with estimated industry averages`, "info");
}

function showStep(stepNumber) {
  // Validate step transitions
  if (stepNumber === 2 && !state.platforms.size) {
    showNotification("Please select at least one platform to continue.", "error");
    return;
  }

  // Allow going to step 4 only if explicitly allowed (via flag) or already on step 4
  if (stepNumber === 4 && state.step !== 4 && !state.allowStep4) {
    // Don't allow jumping to result step without submission
    return;
  }

  state.step = stepNumber;

  // Render platform forms when entering step 2
  if (stepNumber === 2) {
    renderPlatformForms();
    // Attach event listeners to collect data
    setTimeout(() => attachFormListeners(), 100);
  }

  // Hide all steps with fade out
  steps.forEach((step) => {
    const stepNum = Number(step.dataset.step);
    if (stepNum === stepNumber) {
      step.classList.remove("active");
      // Force reflow
      void step.offsetWidth;
      step.classList.add("active");
    } else {
      step.classList.remove("active");
    }
  });

  updateProgress();
  updateStepIndicators();
}

function attachFormListeners() {
  // Attach listeners to all platform-specific inputs
  document.querySelectorAll('[data-platform][data-field]').forEach(input => {
    input.addEventListener('input', (e) => {
      const platform = e.target.dataset.platform;
      const field = e.target.dataset.field;
      if (!state.platformData[platform]) {
        state.platformData[platform] = {};
      }
      state.platformData[platform][field] = e.target.value;
    });
    input.addEventListener('change', (e) => {
      const platform = e.target.dataset.platform;
      const field = e.target.dataset.field;
      if (!state.platformData[platform]) {
        state.platformData[platform] = {};
      }
      state.platformData[platform][field] = e.target.value;
    });
  });
}

function nextStep() {
  if (state.step === 1 && !state.platforms.size) {
    showNotification("Please select at least one platform to continue.", "error");
    return;
  }
  if (state.step === 2) {
    // Validate required fields for each platform
    let hasErrors = false;
    Array.from(state.platforms).forEach(platform => {
      const config = PLATFORM_FORMS[platform];
      if (!config) return;

      config.required.forEach(field => {
        const input = document.getElementById(`${platform}-${field.id}`);
        if (input && !input.value.trim()) {
          hasErrors = true;
          input.classList.add('border-red-500');
        } else if (input) {
          input.classList.remove('border-red-500');
        }
      });
    });

    if (hasErrors) {
      showNotification("Please fill in all required fields for each selected platform.", "error");
      return;
    }
  }
  showStep(Math.min(4, state.step + 1));
}

function prevStep() {
  if (state.step === 4) {
    // Can't go back from result step
    return;
  }
  showStep(Math.max(1, state.step - 1));
}

function resetWizard() {
  state.platforms = new Set();
  state.platformData = {};
  state.estimatedFlags = {};
  refreshChips();

  const goalEl = document.getElementById("goal");
  const durationEl = document.getElementById("duration");
  const audienceEl = document.getElementById("audience");

  if (goalEl) goalEl.value = "";
  if (durationEl) durationEl.value = "30";
  if (audienceEl) audienceEl.value = "";

  const resultArea = document.getElementById("resultArea");
  if (resultArea) {
    resultArea.innerHTML = '<div class="text-center py-12 text-gray-500"><p class="text-lg">Ready to generate your strategy</p></div>';
  }

  // Clear stored strategy data when user starts over
  localStorage.removeItem('stratbot_strategy_data');
  localStorage.removeItem('stratbot_has_strategy_response');
  localStorage.removeItem('stratbot_pending_calendar');

  showStep(1);
}

function showNotification(message, type = "info") {
  // Create a simple toast notification
  const toast = document.createElement("div");
  toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
    type === "error"
      ? "bg-red-500 text-white"
      : "bg-blue-500 text-white"
  }`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

async function submitWizard() {
  if (!state.platforms.size) {
    showNotification("Please select at least one platform.", "error");
    return;
  }

  const goalEl = document.getElementById("goal");
  const durationEl = document.getElementById("duration");

  if (goalEl && !goalEl.value) {
    showNotification("Please select a primary goal.", "error");
    return;
  }

  // Build platform-specific insights
  const insights = {};
  Array.from(state.platforms).forEach(platform => {
    const platformKey = platform.toLowerCase();
    insights[platformKey] = { ...state.platformData[platform] };
    if (state.estimatedFlags[platform]) {
      insights[platformKey]._estimated = true;
    }
  });

  // Ensure duration_days is a valid integer
  const durationValue = durationEl ? parseInt(durationEl.value, 10) : 30;
  if (isNaN(durationValue) || ![15, 30, 45, 60, 90].includes(durationValue)) {
    showNotification("Invalid duration selected. Please select a valid duration.", "error");
    return;
  }

  // Ensure platforms is a non-empty array
  const platformsArray = Array.from(state.platforms);
  if (!platformsArray || platformsArray.length === 0) {
    showNotification("Please select at least one platform.", "error");
    return;
  }

  const payload = {
    platforms: platformsArray,
    insights: insights,
    goal: goalEl && goalEl.value ? goalEl.value : null,
    duration_days: durationValue,
    audience: (() => {
      const audienceEl = document.getElementById("audience");
      return audienceEl && audienceEl.value ? audienceEl.value : null;
    })(),
  };

  // Log payload for debugging
  console.log("Submitting payload:", JSON.stringify(payload, null, 2));

  // Allow navigation to step 4
  state.allowStep4 = true;

  // Navigate to step 4 and show loading spinner
  showStep(4);

  // Show loading state in result area
  const resultArea = document.getElementById("resultArea");
  if (resultArea) {
    resultArea.innerHTML = `
      <div class="text-center py-12 text-gray-500">
        <div class="loading-spinner mx-auto mb-4"></div>
        <p class="text-lg">Generating your strategy...</p>
        <p class="text-sm mt-2 text-gray-400">This may take 30-60 seconds</p>
      </div>
    `;
  }

  try {
    // Call the FastAPI endpoint
    const response = await fetch('/generate-strategy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      // Handle HTTP errors
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(errorData.detail || errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    // Parse successful response
    const data = await response.json();

    // Render the strategy result
    renderResult(data);

  } catch (error) {
    // Handle network errors, parsing errors, or API errors
    console.error('Error generating strategy:', error);

    if (resultArea) {
      resultArea.innerHTML = `
        <div class="text-center py-12">
          <div class="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Failed to Generate Strategy</h3>
          <p class="text-gray-600 mb-4">${escapeHtml(error.message || 'An unexpected error occurred. Please try again.')}</p>
          <button onclick="prevStep()" class="btn-primary text-white px-6 py-2 rounded-lg font-medium">
            Go Back & Try Again
          </button>
        </div>
      `;
    }

    showNotification("Failed to generate strategy. Please try again.", "error");
  }

  // Reset the flag after navigation
  state.allowStep4 = false;
}

function renderResult(data) {
  const area = document.getElementById("resultArea");
  if (!area) return;

  const strategy = data.strategy_text || data.strategy || "No strategy text returned.";

  // Store original markdown text for copy/download
  area.dataset.originalMarkdown = strategy;

  // Store FULL strategy response data in localStorage for restoration after signup
  // Get duration from form input
  const durationEl = document.getElementById("duration");
  const durationValue = durationEl ? parseInt(durationEl.value, 10) : 30;

  // Validate duration
  if (isNaN(durationValue) || ![15, 30, 45, 60, 90].includes(durationValue)) {
    console.error('Invalid duration value:', durationValue);
    // Fallback to 30 if invalid
    const validDuration = 30;
    console.warn('Using fallback duration:', validDuration);
  }

  const strategyData = {
    strategy_text: strategy,
    raw_prompt: data.raw_prompt || null,
    platforms: state.platforms ? Array.from(state.platforms) : [],
    duration_days: durationValue,
    goal: document.getElementById("goal")?.value || null,
    audience: document.getElementById("audience")?.value || null,
    timestamp: Date.now(),
    // Store the full response for restoration
    fullResponse: data
  };

  // Log for debugging
  console.log('Storing strategy data with duration:', durationValue, 'days');

  localStorage.setItem('stratbot_strategy_data', JSON.stringify(strategyData));
  // Also store a flag to indicate we have a strategy response to restore
  localStorage.setItem('stratbot_has_strategy_response', 'true');

  // Parse markdown and render with beautiful formatting
  const formattedStrategy = renderMarkdown(strategy);

  const rawPrompt = data.raw_prompt
    ? `<details class="mt-4">
        <summary class="cursor-pointer text-gray-400 hover:text-gray-300 text-sm mb-2">View Prompt (Debug)</summary>
        <pre class="mt-2 text-xs bg-gray-50 p-3 rounded overflow-auto">${escapeHtml(data.raw_prompt)}</pre>
       </details>`
    : "";

  area.innerHTML = `
    <div class="space-y-4">
      <div class="result-content markdown-content shadow-sm">
        ${formattedStrategy}
      </div>
      ${rawPrompt}
      <div class="flex flex-wrap gap-3 mt-6">
        <button onclick="copyStrategy()" class="btn-secondary text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex-1 max-w-[180px]">
          📋 Copy Strategy
        </button>
        <button onclick="downloadStrategy()" class="btn-secondary text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex-1 max-w-[180px]">
          💾 Download
        </button>
        <button onclick="generateCalendar()" id="generateCalendarBtn" class="btn-primary text-white px-4 py-2 rounded-lg text-sm font-medium flex-1 max-w-[240px] shadow-md hover:shadow-lg">
          📅 Generate Personalized Calendar
        </button>
      </div>
    </div>
  `;

  // Restore the original markdown data attribute after innerHTML update
  area.dataset.originalMarkdown = strategy;
}

// Render markdown with marked.js and custom styling
function renderMarkdown(text) {
  if (!text) return '<div class="text-gray-400">No strategy content available.</div>';

  // Check if marked.js is available
  if (typeof marked === 'undefined') {
    // Fallback to plain text if marked.js is not loaded
    return `<div class="text-gray-700 whitespace-pre-wrap">${escapeHtml(text)}</div>`;
  }

  // Configure marked.js options
  marked.setOptions({
    breaks: true, // Convert line breaks to <br>
    gfm: true, // GitHub Flavored Markdown
    headerIds: false, // Don't add IDs to headers
    mangle: false, // Don't mangle email addresses
  });

  // Configure marked.js with custom renderer for enhanced styling
  const renderer = new marked.Renderer();

  // Custom heading renderers with icons
  renderer.heading = function(text, level) {
    const icons = {
      1: '🎯',
      2: '📋',
      3: '📌',
      4: '📍',
      5: '•',
      6: '◦'
    };
    const icon = icons[level] || '';
    const tag = `h${level}`;
    const id = text.toLowerCase().replace(/[^\w]+/g, '-');
    return `<${tag} id="${id}">${icon ? `<span class="mr-2">${icon}</span>` : ''}${text}</${tag}>`;
  };

  // Custom list item renderer
  renderer.listitem = function(text) {
    // Check if it's a task list item
    if (/^\[[ x]\]\s/.test(text)) {
      const checked = /^\[x\]\s/i.test(text);
      const content = text.replace(/^\[[ x]\]\s/i, '');
      return `<li class="task-item ${checked ? 'checked' : ''}">${checked ? '✅' : '☐'} ${content}</li>`;
    }
    return `<li>${text}</li>`;
  };

  // Custom blockquote renderer
  renderer.blockquote = function(quote) {
    return `<blockquote>💡 ${quote}</blockquote>`;
  };

  // Custom code block renderer
  renderer.code = function(code, language) {
    const lang = language || 'text';
    return `<pre><code class="language-${lang}">${escapeHtml(code)}</code></pre>`;
  };

  // Custom strong renderer
  renderer.strong = function(text) {
    return `<strong class="font-semibold text-gray-900">${text}</strong>`;
  };

  // Custom paragraph renderer
  renderer.paragraph = function(text) {
    // Skip empty paragraphs
    if (!text.trim()) return '';
    return `<p>${text}</p>`;
  };

  // Configure marked with options and custom renderer
  marked.setOptions({
    breaks: true,
    gfm: true,
    headerIds: false,
    mangle: false,
    renderer: renderer
  });

  try {
    // Parse and render markdown
    const html = marked.parse(text);
    return html;
  } catch (error) {
    console.error('Markdown parsing error:', error);
    // Fallback to escaped HTML
    return `<div class="text-gray-700 whitespace-pre-wrap">${escapeHtml(text)}</div>`;
  }
}

function copyStrategy() {
  // Try to get original markdown first, fallback to rendered text
  const resultArea = document.getElementById("resultArea");
  let text = '';

  if (resultArea && resultArea.dataset.originalMarkdown) {
    // Use original markdown text
    text = resultArea.dataset.originalMarkdown;
  } else {
    // Fallback to rendered text content
    const resultContent = document.querySelector("#resultArea .result-content");
    if (resultContent) {
      text = resultContent.textContent || resultContent.innerText;
    }
  }

  if (text) {
    navigator.clipboard.writeText(text).then(() => {
      showNotification("Strategy copied to clipboard!", "info");
    }).catch(() => {
      showNotification("Failed to copy. Please select and copy manually.", "error");
    });
  } else {
    showNotification("No strategy content found to copy.", "error");
  }
}

function downloadStrategy() {
  // Try to get original markdown first, fallback to rendered text
  const resultArea = document.getElementById("resultArea");
  let text = '';

  if (resultArea && resultArea.dataset.originalMarkdown) {
    // Use original markdown text
    text = resultArea.dataset.originalMarkdown;
  } else {
    // Fallback to rendered text content
    const resultContent = document.querySelector("#resultArea .result-content");
    if (resultContent) {
      text = resultContent.textContent || resultContent.innerText;
    }
  }

  if (text) {
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `marketing-strategy-${new Date().toISOString().split("T")[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification("Strategy downloaded!", "info");
  } else {
    showNotification("No strategy content found to download.", "error");
  }
}

// Check if user is authenticated by checking multiple sources
// Supabase auth helpers for Next.js use cookies primarily, but also check localStorage and Redux
function checkAuthentication() {
  try {
    // Method 1: Check for Supabase auth cookies (primary method for Next.js auth helpers)
    // Supabase stores cookies like "sb-<project-ref>-auth-token"
    const cookies = document.cookie.split(';');
    const supabaseCookie = cookies.find(cookie => {
      const trimmed = cookie.trim();
      return trimmed.includes('sb-') && trimmed.includes('-auth-token');
    });

    if (supabaseCookie) {
      // Cookie exists - user is likely authenticated
      // Note: We can't easily parse the cookie value here, but its presence indicates auth
      const cookieValue = supabaseCookie.split('=')[1];
      if (cookieValue && cookieValue.trim() !== '') {
        return true;
      }
    }

    // Method 2: Check localStorage for Supabase tokens (fallback)
    const keys = Object.keys(localStorage);
    const supabaseKey = keys.find(key => {
      // Match patterns like "sb-<project-ref>-auth-token" or similar
      return (key.includes('supabase') || key.startsWith('sb-')) &&
             (key.includes('auth-token') || key.includes('auth'));
    });

    if (supabaseKey) {
      const tokenData = localStorage.getItem(supabaseKey);
      if (tokenData) {
        try {
          const parsed = JSON.parse(tokenData);
          // Check if token exists and has access_token
          if (parsed && parsed.access_token) {
            // Check if token is not expired (basic check)
            if (parsed.expires_at) {
              const expiresAt = parsed.expires_at * 1000; // Convert to milliseconds
              if (expiresAt > Date.now()) {
                return true;
              }
            } else {
              // Token exists but no expiry - assume valid
              return true;
            }
          }
        } catch (e) {
          // Invalid JSON, continue checking other methods
        }
      }
    }

    // Method 3: Check Redux persisted auth state (if main app uses it)
    const reduxState = localStorage.getItem('persist:root');
    if (reduxState) {
      try {
        const parsed = JSON.parse(reduxState);
        if (parsed.auth) {
          const authState = JSON.parse(parsed.auth);
          // Check if user is authenticated according to Redux
          if (authState && authState.isAuthenticated === true) {
            // Also check if session exists
            if (authState.session) {
              return true;
            }
          }
        }
      } catch (e) {
        // Invalid state, continue
      }
    }

    // Method 4: Check for any Supabase-related cookies (broader check)
    const allCookies = document.cookie.split(';');
    const hasSupabaseSession = allCookies.some(cookie => {
      const trimmed = cookie.trim().toLowerCase();
      return trimmed.includes('sb-') || trimmed.includes('supabase');
    });

    if (hasSupabaseSession) {
      // Likely authenticated if Supabase cookies exist
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error checking authentication:', error);
    // On error, default to false (not authenticated) to be safe
    return false;
  }
}

// Show engagement modal for calendar generation
function showEngagementModal() {
  // FIRST: Check if user is already authenticated before showing modal
  // This prevents showing the modal if user just signed in on the main app
  if (window._userAuthenticated === true) {
    console.log('User is already authenticated, skipping engagement modal');
    // User is authenticated - trigger calendar generation directly
    generateCalendar();
    return;
  }

  // Double-check authentication status before showing modal
  checkBackendAuthentication().then(authResult => {
    if (authResult.authenticated) {
      console.log('User is authenticated, updating header and generating calendar');
      // Update header and proceed with calendar generation
      updateAuthStatus().then(() => {
        generateCalendar();
      });
      return;
    }

    // User is NOT authenticated - show the modal
    const modal = document.getElementById("engagementModal");
    if (modal) {
      modal.classList.add("active");
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }
  }).catch(error => {
    console.error('Error checking auth before showing modal:', error);
    // On error, show modal anyway
    const modal = document.getElementById("engagementModal");
    if (modal) {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  });
}

// Close engagement modal
function closeEngagementModal() {
  const modal = document.getElementById("engagementModal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";

    // Show notice that signup is mandatory
    showNotification("Sign up is required to generate your personalized calendar.", "info");

    // Re-enable button
    const btn = document.getElementById("generateCalendarBtn");
    if (btn) {
      btn.disabled = false;
      btn.textContent = "📅 Generate Personalized Calendar";
    }
  }
}

// Helper function to get the main app URL (auto-detects localhost for development)
function getMainAppUrl() {
  // If explicitly set via window variable, use that (for testing/override)
  if (window.STRATBOT_MAIN_APP_URL) {
    return window.STRATBOT_MAIN_APP_URL;
  }

  // Auto-detect: if stratbot is running on localhost, assume main app is also on localhost
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0') {
    // Development: use localhost:3000 (Next.js default port)
    return 'http://localhost:3000';
  }

  // Production: use the deployed URL
  return 'https://marketersclique.com';
}

// Check authentication before redirecting (prevents redirect if already authenticated)
async function checkAuthBeforeRedirect() {
  console.log('Checking authentication before redirect...');

  // Show loading in header
  const authLoading = document.getElementById('authLoading');
  const authNotAuthenticated = document.getElementById('authNotAuthenticated');
  if (authLoading) authLoading.classList.remove('hidden');
  if (authNotAuthenticated) authNotAuthenticated.classList.add('hidden');

  try {
    // Check authentication
    const authResult = await checkBackendAuthentication();

    // Update header
    await updateAuthStatus();

    if (authResult.authenticated) {
      console.log('✅ User is already authenticated! Updating header and proceeding with calendar generation');
      // Close modal if open
      closeEngagementModal();
      // User is authenticated - proceed with calendar generation
      generateCalendar();
      return;
    }

    // User is NOT authenticated - proceed with redirect
    console.log('❌ User not authenticated, redirecting to signup...');
    redirectToSignupPage();

  } catch (error) {
    console.error('Error checking auth before redirect:', error);
    // On error, try redirect anyway (user might need to sign in)
    redirectToSignupPage();
  }
}

// Actually perform the redirect to signup page
function redirectToSignupPage() {
  // Store intent to generate calendar after login
  localStorage.setItem('stratbot_pending_calendar', 'true');

  // Store current URL for redirect back (remove any existing action params to avoid duplicates)
  const currentUrl = new URL(window.location.href);
  currentUrl.searchParams.delete('action'); // Remove action param if present
  const cleanUrl = currentUrl.toString();
  localStorage.setItem('stratbot_return_url', cleanUrl);

  // Get main app URL (auto-detects localhost for development)
  const mainAppUrl = getMainAppUrl();

  // Redirect to signup with return URL parameter (SAME TAB - no new window)
  const signupUrl = `${mainAppUrl}/signup?returnUrl=${encodeURIComponent(cleanUrl)}&action=calendar`;
  window.location.href = signupUrl; // Same tab navigation
}

// Redirect to signup when user clicks modal button (legacy function name for backward compatibility)
function redirectToSignup() {
  checkAuthBeforeRedirect();
}

// Update authentication status in header
async function updateAuthStatus() {
  const authLoading = document.getElementById('authLoading');
  const authAuthenticated = document.getElementById('authAuthenticated');
  const authNotAuthenticated = document.getElementById('authNotAuthenticated');
  const userName = document.getElementById('userName');
  const userEmail = document.getElementById('userEmail');
  const userAvatar = document.getElementById('userAvatar');

  // Show loading state
  if (authLoading) authLoading.classList.remove('hidden');
  if (authAuthenticated) authAuthenticated.classList.add('hidden');
  if (authNotAuthenticated) authNotAuthenticated.classList.add('hidden');

  try {
    const authResult = await checkBackendAuthentication();

    // Hide loading
    if (authLoading) authLoading.classList.add('hidden');

    if (authResult.authenticated && authResult.profile) {
      // User is authenticated - show user info
      if (authAuthenticated) authAuthenticated.classList.remove('hidden');
      if (authNotAuthenticated) authNotAuthenticated.classList.add('hidden');

      // Update user info
      const profile = authResult.profile;
      const name = profile.full_name || profile.username || profile.email?.split('@')[0] || 'User';
      const email = profile.email || '';
      const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

      if (userName) userName.textContent = name;
      if (userEmail) userEmail.textContent = email;
      if (userAvatar) userAvatar.textContent = initials;

      // Store auth state globally for calendar generation
      window._userAuthenticated = true;
      window._userProfile = profile;

      console.log('✅ User authenticated:', name, email);
    } else {
      // User is not authenticated - show sign in button
      if (authAuthenticated) authAuthenticated.classList.add('hidden');
      if (authNotAuthenticated) authNotAuthenticated.classList.remove('hidden');

      // Clear auth state
      window._userAuthenticated = false;
      window._userProfile = null;

      console.log('❌ User not authenticated');
    }
  } catch (error) {
    console.error('Error updating auth status:', error);
    // On error, show not authenticated state
    if (authLoading) authLoading.classList.add('hidden');
    if (authAuthenticated) authAuthenticated.classList.add('hidden');
    if (authNotAuthenticated) authNotAuthenticated.classList.remove('hidden');

    window._userAuthenticated = false;
    window._userProfile = null;
  }
}

// Check authentication via backend
// Extract and store authentication token from URL parameters
function extractTokenFromUrl() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      console.log('✅ Found authentication token in URL, storing in localStorage...');
      // Store token in localStorage for future use
      localStorage.setItem('stratbot_auth_token', token);

      // Clean up URL by removing token parameter (for security and cleaner URLs)
      urlParams.delete('token');
      const newUrl = window.location.pathname +
                    (urlParams.toString() ? '?' + urlParams.toString() : '') +
                    window.location.hash;

      // Update URL without reloading page (using history API)
      window.history.replaceState({}, '', newUrl);

      console.log('🔒 Token stored and URL cleaned');
      return token;
    }

    return null;
  } catch (error) {
    console.error('Error extracting token from URL:', error);
    return null;
  }
}

async function checkBackendAuthentication() {
  try {
    console.log('🔍 Starting authentication check...');

    // Try to get Supabase session token from cookies or localStorage
    let authToken = null;
    let tokenSource = null;

    // Method 0: Check for token passed via URL (from Next.js app redirect)
    // This should be called first to extract token from URL if present
    console.log('🔗 Checking for token in URL...');
    const urlToken = extractTokenFromUrl();
    if (urlToken) {
      authToken = urlToken;
      tokenSource = 'url-parameter';
      console.log('✅ Found token in URL parameter');
    }

    // Method 0.5: Check localStorage for stored token (from URL or previous session)
    // This is checked after URL extraction, so stored token takes precedence if URL token was just extracted
    if (!authToken) {
      console.log('💾 Checking localStorage for stored token...');
      const storedToken = localStorage.getItem('stratbot_auth_token');
      if (storedToken && storedToken.length > 50) {
        authToken = storedToken;
        tokenSource = 'localStorage-stored';
        console.log('✅ Found stored token in localStorage');
      }
    }

    // Method 1: Check cookies for Supabase auth token
    console.log('📋 Checking cookies...');
    const cookies = document.cookie.split(';');
    console.log('All cookies:', cookies.map(c => c.trim().substring(0, 80)));

    for (let cookie of cookies) {
      const trimmed = cookie.trim();
      // Look for Supabase auth cookies - they can have various formats:
      // - sb-<project-ref>-auth-token
      // - sb-<project-ref>-auth-token-code-verifier
      // - Any cookie with 'sb-' and 'auth' in the name
      const isSupabaseCookie = trimmed.includes('sb-') &&
                                (trimmed.includes('auth') || trimmed.includes('session'));

      if (isSupabaseCookie) {
        console.log('Found Supabase cookie:', trimmed.substring(0, 100));
        const parts = trimmed.split('=');
        if (parts.length > 1) {
          try {
            const cookieName = parts[0].trim();
            const cookieValue = decodeURIComponent(parts.slice(1).join('='));

            // Try parsing as JSON (most common format)
            try {
              const parsed = JSON.parse(cookieValue);
              if (parsed && parsed.access_token) {
                authToken = parsed.access_token;
                tokenSource = `cookie-${cookieName}`;
                console.log('✅ Found token in cookie (JSON format):', cookieName);
                break;
              } else if (parsed && parsed.session && parsed.session.access_token) {
                authToken = parsed.session.access_token;
                tokenSource = `cookie-${cookieName}-session`;
                console.log('✅ Found token in cookie (session object):', cookieName);
                break;
              }
            } catch (jsonError) {
              // Cookie might be a direct token string (less common)
              if (cookieValue && cookieValue.length > 50 && cookieValue.startsWith('eyJ')) {
                // JWT tokens typically start with 'eyJ' (base64 encoded JSON)
                authToken = cookieValue;
                tokenSource = `cookie-${cookieName}-direct`;
                console.log('✅ Found token in cookie (direct JWT):', cookieName);
                break;
              }
            }
          } catch (e) {
            console.log('Error parsing cookie:', cookieName, e);
          }
        }
      }
    }

    // Method 2: Check localStorage for Supabase tokens
    if (!authToken) {
      console.log('📦 Checking localStorage...');
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('sb-') || key.includes('supabase'))) {
          console.log('Found Supabase key in localStorage:', key);
          try {
            const tokenData = localStorage.getItem(key);
            if (tokenData) {
              try {
                const parsed = JSON.parse(tokenData);
                // Check various possible token locations
                if (parsed && parsed.access_token) {
                  authToken = parsed.access_token;
                  tokenSource = 'localStorage-json-access_token';
                  console.log('✅ Found token in localStorage (access_token)');
                  break;
                } else if (parsed && parsed.token) {
                  authToken = parsed.token;
                  tokenSource = 'localStorage-json-token';
                  console.log('✅ Found token in localStorage (token)');
                  break;
                } else if (typeof parsed === 'string' && parsed.length > 50) {
                  authToken = parsed;
                  tokenSource = 'localStorage-string';
                  console.log('✅ Found token in localStorage (string)');
                  break;
                }
              } catch (parseError) {
                // If it's already a string token
                if (typeof tokenData === 'string' && tokenData.length > 50) {
                  authToken = tokenData;
                  tokenSource = 'localStorage-direct';
                  console.log('✅ Found token in localStorage (direct string)');
                  break;
                }
              }
            }
          } catch (e) {
            console.log('Error reading localStorage key:', key, e);
          }
        }
      }
    }

    // Method 3: Check for Redux persisted state (if available)
    if (!authToken) {
      console.log('🔄 Checking for Redux persisted state...');
      try {
        const reduxState = localStorage.getItem('persist:root') || localStorage.getItem('persist:auth');
        if (reduxState) {
          const parsed = JSON.parse(reduxState);
          // Look for auth state in Redux
          if (parsed.auth) {
            const authState = JSON.parse(parsed.auth);
            if (authState && authState.session && authState.session.access_token) {
              authToken = authState.session.access_token;
              tokenSource = 'redux-auth';
              console.log('✅ Found token in Redux state');
            }
          }
        }
      } catch (e) {
        console.log('Error checking Redux state:', e);
      }
    }

    if (!authToken) {
      console.log('❌ No authentication token found in any location');
      const relevantKeys = Object.keys(localStorage).filter(k =>
        k.includes('sb') || k.includes('supabase') || k.includes('auth') || k.includes('persist')
      );
      console.log('Relevant localStorage keys:', relevantKeys);
      console.log('All cookies:', document.cookie);
      console.log('Current origin:', window.location.origin);
      console.log('Main app URL:', getMainAppUrl());
      console.log('⚠️ Note: If Next.js app is on a different port, cookies/localStorage won\'t be shared');

      return { authenticated: false, message: 'No authentication token found' };
    }

    console.log('🔑 Token found from:', tokenSource);
    console.log('Token preview:', authToken.substring(0, 50) + '...');

    // Store token in localStorage for future API calls (if not already stored from URL)
    // This ensures we can use it in Authorization headers
    if (tokenSource !== 'url-parameter' && tokenSource !== 'localStorage-stored') {
      localStorage.setItem('stratbot_auth_token', authToken);
      console.log('💾 Stored token in localStorage for future API calls');
    }

    // Verify token with backend
    console.log('🌐 Verifying token with backend...');
    const response = await fetch('/verify-auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: authToken }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Backend verification failed:', response.status, errorText);
      return { authenticated: false, message: `Authentication verification failed: ${response.status}` };
    }

    const data = await response.json();
    console.log('✅ Backend verification result:', data);
    return { authenticated: data.authenticated || false, profile: data.profile };

  } catch (error) {
    console.error('❌ Error checking backend authentication:', error);
    return { authenticated: false, message: error.message };
  }
}

// Generate personalized calendar
async function generateCalendar() {
  const btn = document.getElementById("generateCalendarBtn");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Checking authentication...";
  }

  // STEP 1: Check authentication (use cached state if available, otherwise check backend)
  let authResult;

  // First check if we have cached auth state from header
  if (window._userAuthenticated !== undefined) {
    console.log('Using cached authentication state from header');
    authResult = {
      authenticated: window._userAuthenticated,
      profile: window._userProfile
    };
  } else {
    // If no cached state, check backend and update header
    console.log('No cached auth state, checking backend...');
    await updateAuthStatus();
    authResult = {
      authenticated: window._userAuthenticated || false,
      profile: window._userProfile || null
    };
  }

  console.log('Authentication check result:', authResult);

  // CONDITION 1: User is NOT authenticated → Show EngagementModal popup
  if (!authResult.authenticated) {
    console.log('User not authenticated - showing engagement modal');

    // Re-enable button
    if (btn) {
      btn.disabled = false;
      btn.textContent = "📅 Generate Personalized Calendar";
    }

    // Show engagement modal popup (user can signup or close)
    showEngagementModal();
    return; // Stop here - do NOT generate calendar
  }

  // CONDITION 2: User IS authenticated → Proceed with calendar generation
  console.log('User is authenticated - proceeding with calendar generation');

  // Check if profile is completed (if not, redirect to onboarding first)
  if (authResult.profile && authResult.profile.onboarding_completed === false) {
    console.log('Profile not completed - redirecting to onboarding');
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete('action');
    const cleanUrl = currentUrl.toString();
    localStorage.setItem('stratbot_return_url', cleanUrl);
    localStorage.setItem('stratbot_pending_calendar', 'true');
    const mainAppUrl = getMainAppUrl();
    const onboardingUrl = `${mainAppUrl}/onboarding?returnUrl=${encodeURIComponent(cleanUrl)}&action=calendar`;
    window.location.href = onboardingUrl;
    return;
  }

  // User is authenticated AND profile is completed → Make LLM call to generate calendar
  console.log('User authenticated and profile complete - generating calendar via LLM');
  if (btn) {
    btn.textContent = "Generating calendar...";
  }

  // Get strategy data from localStorage
  const strategyDataStr = localStorage.getItem('stratbot_strategy_data');
  if (!strategyDataStr) {
    showNotification("Strategy data not found. Please generate a strategy first.", "error");
    if (btn) {
      btn.disabled = false;
      btn.textContent = "📅 Generate Personalized Calendar";
    }
    return;
  }

  let strategyData;
  try {
    strategyData = JSON.parse(strategyDataStr);
  } catch (e) {
    showNotification("Invalid strategy data. Please generate a strategy again.", "error");
    if (btn) {
      btn.disabled = false;
      btn.textContent = "📅 Generate Personalized Calendar";
    }
    return;
  }

  // Build calendar request payload
  // Validate duration_days exists and is valid
  const durationDays = strategyData.duration_days;
  if (!durationDays || ![15, 30, 45, 60, 90].includes(durationDays)) {
    console.error('Invalid duration_days in strategy data:', durationDays);
    showNotification(`Invalid duration (${durationDays} days). Please generate a new strategy.`, "error");
    if (btn) {
      btn.disabled = false;
      btn.textContent = "📅 Generate Personalized Calendar";
    }
    return;
  }

  const calendarPayload = {
    strategy_text: strategyData.strategy_text,
    platforms: strategyData.platforms,
    duration_days: durationDays,
    goal: strategyData.goal,
    audience: strategyData.audience
  };

  // Log for debugging
  console.log('Generating calendar for', durationDays, 'days');
  console.log('Calendar payload:', { ...calendarPayload, strategy_text: calendarPayload.strategy_text?.substring(0, 100) + '...' });

  // Show loading state in result area
  const resultArea = document.getElementById("resultArea");
  const originalContent = resultArea ? resultArea.innerHTML : '';

  if (resultArea) {
    resultArea.innerHTML = `
      <div class="text-center py-12 text-gray-500">
        <div class="loading-spinner mx-auto mb-4"></div>
        <p class="text-lg">Generating your personalized calendar...</p>
        <p class="text-sm mt-2 text-gray-400">This may take 30-60 seconds</p>
      </div>
    `;
  }

  // Get authentication token for the API call
  const authToken = localStorage.getItem('stratbot_auth_token');
  if (!authToken) {
    console.error('No authentication token found. User must be authenticated.');
    showNotification('Authentication required. Please sign in to generate your calendar.', "error");
    if (btn) {
      btn.disabled = false;
      btn.textContent = "📅 Generate Personalized Calendar";
    }
    if (resultArea) {
      resultArea.innerHTML = originalContent;
    }
    // Show engagement modal if not authenticated
    showEngagementModal();
    return;
  }

  try {
    const response = await fetch('/generate-calendar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(calendarPayload),
    });

    if (!response.ok) {
      // Handle 401 Unauthorized - token expired or invalid
      if (response.status === 401) {
        console.warn('Authentication token expired or invalid. Clearing token and redirecting to signup.');
        localStorage.removeItem('stratbot_auth_token');
        showNotification('Your session has expired. Please sign in again.', "error");
        if (resultArea) {
          resultArea.innerHTML = originalContent;
        }
        showEngagementModal();
        return;
      }

      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(errorData.detail || errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    renderCalendarResult(data);

    // Clear pending calendar flag
    localStorage.removeItem('stratbot_pending_calendar');

  } catch (error) {
    console.error('Error generating calendar:', error);

    if (resultArea) {
      resultArea.innerHTML = `
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div class="flex items-center justify-center mb-3">
            <div class="text-red-500 text-xl mr-3">⚠️</div>
            <div>
              <h3 class="text-red-800 font-semibold mb-1">Error generating calendar</h3>
              <p class="text-red-600 text-sm">${escapeHtml(error.message)}</p>
            </div>
          </div>
          <button onclick="generateCalendar()" class="mt-4 btn-primary text-white px-6 py-3 rounded-lg font-semibold shadow-sm">
            Try Again
          </button>
        </div>
      `;
    }

    showNotification(`Error: ${error.message}`, "error");
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = "📅 Generate Personalized Calendar";
    }
  }
}

// Render calendar result
function renderCalendarResult(data) {
  const area = document.getElementById("resultArea");
  if (!area) return;

  const calendar = data.calendar_text || data.calendar || "No calendar content returned.";

  // Store original markdown text
  area.dataset.originalMarkdown = calendar;
  // Store calendar data for PDF generation
  area.dataset.calendarData = JSON.stringify(data);

  // Parse markdown and render
  const formattedCalendar = renderMarkdown(calendar);

  const rawPrompt = data.raw_prompt
    ? `<details class="mt-4">
        <summary class="cursor-pointer text-gray-400 hover:text-gray-300 text-sm mb-2">View Prompt (Debug)</summary>
        <pre class="mt-2 text-xs bg-gray-50 p-3 rounded overflow-auto max-h-48">${escapeHtml(data.raw_prompt)}</pre>
       </details>`
    : "";

  // Get strategy data for context
  const strategyDataStr = localStorage.getItem('stratbot_strategy_data');
  let strategyContext = '';
  if (strategyDataStr) {
    try {
      const strategyData = JSON.parse(strategyDataStr);
      strategyContext = `
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm">
          <p class="text-blue-800"><strong>Duration:</strong> ${strategyData.duration_days} days</p>
          <p class="text-blue-800"><strong>Platforms:</strong> ${strategyData.platforms?.join(', ') || 'N/A'}</p>
        </div>
      `;
    } catch (e) {
      // Ignore parse errors
    }
  }

  area.innerHTML = `
    <div class="space-y-6">
      <!-- Header Section -->
      <div class="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg p-6 shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold mb-2">📅 Your Personalized Content Calendar</h2>
            <p class="text-orange-50 text-sm">Weekly breakdown and day-wise actionable plan</p>
          </div>
          <div class="text-4xl">📆</div>
        </div>
      </div>

      ${strategyContext}

      <!-- Calendar Content -->
      <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6" id="calendarContent">
        <div class="result-content markdown-content prose prose-lg max-w-none">
          ${formattedCalendar}
        </div>
      </div>

      ${rawPrompt}

      <!-- Action Buttons -->
      <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">Download & Share</h3>
        <div class="flex flex-wrap gap-3">
          <button onclick="copyCalendar()" class="btn-secondary text-gray-700 px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-2">
            <span>📋</span> Copy Calendar
          </button>
          <button onclick="downloadCalendar()" class="btn-secondary text-gray-700 px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-2">
            <span>💾</span> Download Markdown
          </button>
          <button onclick="downloadCalendarPDF()" class="btn-primary text-white px-6 py-3 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2">
            <span>📄</span> Download PDF
          </button>
        </div>
      </div>
    </div>
  `;

  // Restore the original markdown data attribute
  area.dataset.originalMarkdown = calendar;

  // Scroll to top of result area
  area.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function copyCalendar() {
  const resultArea = document.getElementById("resultArea");
  let text = '';

  if (resultArea && resultArea.dataset.originalMarkdown) {
    text = resultArea.dataset.originalMarkdown;
  } else {
    const resultContent = document.querySelector("#resultArea .result-content");
    if (resultContent) {
      text = resultContent.textContent || resultContent.innerText;
    }
  }

  if (text) {
    navigator.clipboard.writeText(text).then(() => {
      showNotification("Calendar copied to clipboard!", "info");
    }).catch(() => {
      showNotification("Failed to copy. Please select and copy manually.", "error");
    });
  } else {
    showNotification("No calendar content found to copy.", "error");
  }
}

function downloadCalendar() {
  const resultArea = document.getElementById("resultArea");
  let text = '';

  if (resultArea && resultArea.dataset.originalMarkdown) {
    text = resultArea.dataset.originalMarkdown;
  } else {
    const resultContent = document.querySelector("#resultArea .result-content");
    if (resultContent) {
      text = resultContent.textContent || resultContent.innerText;
    }
  }

  if (text) {
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `content-calendar-${new Date().toISOString().split("T")[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification("Calendar downloaded!", "info");
  } else {
    showNotification("No calendar content found to download.", "error");
  }
}

// Download calendar as PDF (server-side generation)
async function downloadCalendarPDF() {
  const resultArea = document.getElementById("resultArea");
  if (!resultArea) {
    showNotification("No calendar content found to download.", "error");
    return;
  }

  // Get calendar data from stored data attribute or try to extract from DOM
  let calendarText = '';
  let calendarData = null;

  // Try to get from data attribute first
  if (resultArea.dataset.calendarData) {
    try {
      calendarData = JSON.parse(resultArea.dataset.calendarData);
      calendarText = calendarData.calendar_text || calendarData.calendar || '';
    } catch (e) {
      console.warn('Failed to parse calendar data:', e);
    }
  }

  // Fallback: get from original markdown
  if (!calendarText && resultArea.dataset.originalMarkdown) {
    calendarText = resultArea.dataset.originalMarkdown;
  }

  // Last resort: try to extract from DOM
  if (!calendarText) {
    const calendarContent = document.getElementById("calendarContent");
    if (calendarContent) {
      calendarText = calendarContent.textContent || calendarContent.innerText || '';
    }
  }

  if (!calendarText || !calendarText.trim()) {
    showNotification("Calendar content is empty. Please generate a calendar first.", "error");
    return;
  }

  // Get authentication token
  const authToken = localStorage.getItem('stratbot_auth_token');
  if (!authToken) {
    showNotification("Authentication required. Please sign in to download PDF.", "error");
    return;
  }

  // Get strategy data for context (duration, platforms)
  const strategyDataStr = localStorage.getItem('stratbot_strategy_data');
  let durationDays = null;
  let platforms = null;

  if (strategyDataStr) {
    try {
      const strategyData = JSON.parse(strategyDataStr);
      durationDays = strategyData.duration_days;
      platforms = strategyData.platforms;
    } catch (e) {
      console.warn('Failed to parse strategy data:', e);
    }
  }

  // Show loading notification
  showNotification("Generating PDF... This may take a moment.", "info");

  try {
    // Prepare request payload
    const payload = {
      calendar_text: calendarText,
      title: "Your Personalized Content Calendar",
      duration_days: durationDays,
      platforms: platforms
    };

    // Make request to server
    const response = await fetch('/download-calendar-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      // Handle 401 Unauthorized
      if (response.status === 401) {
        localStorage.removeItem('stratbot_auth_token');
        showNotification('Your session has expired. Please sign in again.', "error");
        return;
      }

      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(errorData.detail || errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    // Get PDF blob
    const blob = await response.blob();

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content-calendar-${new Date().toISOString().split("T")[0]}.pdf`;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    showNotification("Calendar PDF downloaded successfully!", "success");

  } catch (error) {
    console.error('PDF download error:', error);
    showNotification(`Failed to download PDF: ${error.message}`, "error");
  }
}

// Old client-side PDF generation functions removed - now using server-side PDF generation

// Make functions globally available
window.generateCalendar = generateCalendar;
window.copyCalendar = copyCalendar;
window.downloadCalendar = downloadCalendar;
window.downloadCalendarPDF = downloadCalendarPDF;


function escapeHtml(value) {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Make functions available globally for onclick handlers
window.fillDefaults = fillDefaults;
window.copyStrategy = copyStrategy;
window.downloadStrategy = downloadStrategy;
window.checkAuthBeforeRedirect = checkAuthBeforeRedirect;
window.updateAuthStatus = updateAuthStatus;
window.redirectToSignup = redirectToSignup;

// Restore strategy response from localStorage (after signup/onboarding or page reload)
function restoreStrategyResponse() {
  const hasStrategyResponse = localStorage.getItem('stratbot_has_strategy_response');
  if (hasStrategyResponse !== 'true') {
    return false;
  }

  const strategyDataStr = localStorage.getItem('stratbot_strategy_data');
  if (!strategyDataStr) {
    localStorage.removeItem('stratbot_has_strategy_response');
    return false;
  }

  try {
    const strategyData = JSON.parse(strategyDataStr);

    // Check if we have the full response data
    if (strategyData.fullResponse) {
      console.log('Restoring strategy response from localStorage');

      // Restore wizard state (platforms, form data) if available
      if (strategyData.platforms && Array.isArray(strategyData.platforms)) {
        state.platforms = new Set(strategyData.platforms);
        refreshChips();
        console.log('Restored selected platforms:', Array.from(state.platforms));
      }

      // Restore form values if available
      if (strategyData.goal) {
        const goalEl = document.getElementById("goal");
        if (goalEl) goalEl.value = strategyData.goal;
      }
      if (strategyData.duration_days) {
        const durationEl = document.getElementById("duration");
        if (durationEl) durationEl.value = strategyData.duration_days.toString();
      }
      if (strategyData.audience) {
        const audienceEl = document.getElementById("audience");
        if (audienceEl) audienceEl.value = strategyData.audience;
      }

      // Ensure we're on step 4 (should already be there from initialization, but double-check)
      if (state.step !== 4) {
        state.allowStep4 = true;
        state.step = 4;
        showStep(4);
      }

      // Restore the strategy response display
      renderResult(strategyData.fullResponse);

      return true;
    }
  } catch (e) {
    console.error('Error restoring strategy response:', e);
    localStorage.removeItem('stratbot_has_strategy_response');
    localStorage.removeItem('stratbot_strategy_data');
  }

  return false;
}

// Check for pending calendar generation on page load
// This function is called when user returns from signup/login/onboarding flow
function checkPendingCalendarGeneration() {
  // Prevent multiple executions
  if (window._calendarCheckExecuted) {
    return;
  }
  window._calendarCheckExecuted = true;

  // Check URL parameters for action=calendar
  const urlParams = new URLSearchParams(window.location.search);
  const action = urlParams.get('action');

  // Also check localStorage for pending calendar flag
  const pendingCalendar = localStorage.getItem('stratbot_pending_calendar');

  if (action === 'calendar' || pendingCalendar === 'true') {
    console.log('Step 9: Pending calendar generation detected after onboarding completion, checking authentication...');

    // Step 2: Check authentication via backend
    checkBackendAuthentication().then(authResult => {
      if (!authResult.authenticated) {
      // Still not authenticated, show message and clear flag
      console.log('User still not authenticated after return');
      showNotification("Please sign in to generate your personalized calendar.", "info");
      localStorage.removeItem('stratbot_pending_calendar');
      // Clean up URL parameters
      if (action) {
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }
      window._calendarCheckExecuted = false; // Reset flag for retry
      return;
      }

      // Check profile completion (Step 7 & 8 should be done)
      if (authResult.profile && authResult.profile.onboarding_completed === false) {
        console.log('Profile still not completed, redirecting to onboarding');
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.delete('action');
        const cleanUrl = currentUrl.toString();
        localStorage.setItem('stratbot_return_url', cleanUrl);
        localStorage.setItem('stratbot_pending_calendar', 'true');
        const mainAppUrl = getMainAppUrl();
        const onboardingUrl = `${mainAppUrl}/onboarding?returnUrl=${encodeURIComponent(cleanUrl)}&action=calendar`;
        window.location.href = onboardingUrl;
        return;
      }

      console.log('User is authenticated and profile completed, checking for strategy data...');

      // User is authenticated, check if we have strategy data
      const strategyData = localStorage.getItem('stratbot_strategy_data');

    if (!strategyData) {
      // No strategy data, clear the flag
      console.log('No strategy data found');
      showNotification("Strategy data not found. Please generate a strategy first.", "error");
      localStorage.removeItem('stratbot_pending_calendar');
      // Clean up URL parameters
      if (action) {
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }
      return;
    }

    console.log('Strategy data found, restoring strategy response first...');

    // FIRST: Restore the strategy response so user can see it
    const restored = restoreStrategyResponse();

    if (!restored) {
      // If restoration failed, try to show strategy from stored data
      const strategyData = JSON.parse(strategyDataStr);
      if (strategyData.strategy_text) {
        // Navigate to step 4
        if (state.step !== 4) {
          state.allowStep4 = true;
          showStep(4);
        }

        // Create a mock response object to render
        const mockResponse = {
          strategy_text: strategyData.strategy_text,
          raw_prompt: strategyData.raw_prompt || null
        };

        setTimeout(() => {
          renderResult(mockResponse);
        }, 500);
      }
    }

    // Strategy data exists - ensure we're on step 4
    if (state.step !== 4) {
      // Navigate to step 4 first
      state.allowStep4 = true;
      showStep(4);

      // Wait for step 4 to render and strategy to be restored, then trigger calendar generation (Step 9)
      setTimeout(() => {
        localStorage.removeItem('stratbot_pending_calendar');
        console.log('Step 9: Auto-triggering calendar generation after profile completion (navigated to step 4)');
        generateCalendar();
      }, 2000); // Increased delay to ensure strategy is restored first
    } else {
      // Already on step 4, wait for strategy restoration then trigger calendar generation (Step 9)
      setTimeout(() => {
        localStorage.removeItem('stratbot_pending_calendar');
        console.log('Step 9: Auto-triggering calendar generation after profile completion (already on step 4)');
        generateCalendar();
      }, 1500); // Increased delay to ensure strategy is restored first
    }

      // Clean up URL parameters immediately to prevent loops
      if (action) {
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }

      // Update auth status in header after authentication check
      updateAuthStatus();
    }).catch(error => {
      console.error('Error checking authentication for pending calendar:', error);
      showNotification("Error verifying authentication. Please try again.", "error");
      localStorage.removeItem('stratbot_pending_calendar');
      window._calendarCheckExecuted = false;

      // Update auth status in header even on error
      updateAuthStatus();
    });
  }
}

// Note: Strategy restoration is now handled directly in DOMContentLoaded
// This function is kept for backward compatibility but is no longer used

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  // Extract token from URL first (if present from redirect)
  extractTokenFromUrl();

  // Update authentication status in header (runs immediately)
  updateAuthStatus();

  // Refresh auth status periodically to keep it updated
  setInterval(() => {
    updateAuthStatus();
  }, 5 * 60 * 1000); // Every 5 minutes

  // Check for stored strategy FIRST before showing any step
  // This prevents the flash of Step 1 when refreshing on Step 4
  const hasStrategyFlag = localStorage.getItem('stratbot_has_strategy_response');

  if (hasStrategyFlag === 'true') {
    // Strategy exists - immediately hide Step 1 and show Step 4
    state.allowStep4 = true;
    state.step = 4;

    // Hide all steps immediately
    steps.forEach((step) => {
      step.classList.remove("active");
    });

    // Show step 4 immediately
    const step4 = steps.find(s => Number(s.dataset.step) === 4);
    if (step4) {
      step4.classList.add("active");
    }

    // Update progress and indicators
    updateProgress();
    updateStepIndicators();

    // Now restore strategy content
    const restored = restoreStrategyResponse();
    if (!restored) {
      // If restoration failed, go back to step 1
      console.log('Failed to restore strategy, going back to step 1');
      localStorage.removeItem('stratbot_has_strategy_response');
      state.step = 1;
      state.allowStep4 = false;
      showStep(1);
    }
  } else {
    // No strategy - show Step 1 as normal
    state.step = 1;
    updateProgress();
    updateStepIndicators();
    // Step 1 is already active in HTML, so we don't need to call showStep(1)
  }

  // Check for pending calendar generation (after signup/onboarding)
  checkPendingCalendarGeneration();

  // Also refresh auth status after a short delay (in case user just signed in)
  setTimeout(() => {
    updateAuthStatus();
  }, 2000);
});

// Also restore strategy when page is loaded from cache (browser back/forward navigation)
window.addEventListener("pageshow", (event) => {
  // Extract token from URL if present (in case of redirect)
  extractTokenFromUrl();

  // event.persisted is true when page is loaded from cache (back/forward navigation)
  if (event.persisted) {
    console.log('Page loaded from cache, checking for strategy to restore...');

    const hasStrategyFlag = localStorage.getItem('stratbot_has_strategy_response');
    if (hasStrategyFlag === 'true') {
      // Strategy exists - show Step 4
      state.allowStep4 = true;
      state.step = 4;

      // Hide all steps and show Step 4
      steps.forEach((step) => {
        step.classList.remove("active");
      });
      const step4 = steps.find(s => Number(s.dataset.step) === 4);
      if (step4) {
        step4.classList.add("active");
      }

      updateProgress();
      updateStepIndicators();

      // Restore strategy content
      restoreStrategyResponse();
    }

    // Check for pending calendar generation
    checkPendingCalendarGeneration();
  }
});
