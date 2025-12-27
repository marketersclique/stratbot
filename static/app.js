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
      <div class="flex gap-3 mt-6">
        <button onclick="copyStrategy()" class="btn-secondary text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex-1">
          📋 Copy Strategy
        </button>
        <button onclick="downloadStrategy()" class="btn-secondary text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex-1">
          💾 Download
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

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  updateProgress();
  updateStepIndicators();
});
