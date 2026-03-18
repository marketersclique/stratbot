// Get payload from sessionStorage (set by index.html before redirect)
const payload = JSON.parse(sessionStorage.getItem('strategyPayload') || 'null');

// State
let strategyData = null;
let progressInterval = null;

// DOM elements
const loadingState = document.getElementById('loadingState');
const resultState = document.getElementById('resultState');
const errorState = document.getElementById('errorState');
const strategyContent = document.getElementById('strategyContent');
const errorMessage = document.getElementById('errorMessage');

// Show loading state
function showLoading() {
  loadingState.classList.remove('hidden');
  resultState.classList.add('hidden');
  errorState.classList.add('hidden');
}

// Show result state
function showResult() {
  loadingState.classList.add('hidden');
  resultState.classList.remove('hidden');
  errorState.classList.add('hidden');
}

// Show error state
function showError(message) {
  loadingState.classList.add('hidden');
  resultState.classList.add('hidden');
  errorState.classList.remove('hidden');
  errorMessage.textContent = message;
}

// Show notification (if not already defined in HTML)
if (typeof showNotification === 'undefined') {
  function showNotification(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
      type === 'error' 
        ? 'bg-red-500 text-white' 
        : type === 'success'
        ? 'bg-green-500 text-white'
        : 'bg-blue-500 text-white'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
  window.showNotification = showNotification;
}

// Escape HTML
function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Format strategy text with better readability
function formatStrategyText(text) {
  if (!text) return '<div class="text-gray-400">No strategy content available.</div>';
  
  // Split by lines
  const lines = text.split('\n');
  let formatted = '';
  
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    
    if (!trimmed) {
      // Empty line - add spacing
      formatted += '<div class="mb-3"></div>';
      return;
    }
    
    // Detect section headers (numbered sections like "1. Strategy Level Tag")
    if (/^\d+\.\s+[A-Z]/.test(trimmed)) {
      formatted += `<div class="text-orange-400 font-bold text-lg mb-3 mt-6 first:mt-0">${escapeHtml(trimmed)}</div>`;
    }
    // Detect all-caps headers (like "PRIMARY OBJECTIVES")
    else if (/^[A-Z][A-Z\s]{3,}:?$/.test(trimmed) && trimmed.length < 60) {
      formatted += `<div class="text-orange-300 font-semibold text-base mb-3 mt-5">${escapeHtml(trimmed)}</div>`;
    }
    // Detect headers ending with colon (like "Context:")
    else if (trimmed.endsWith(':') && trimmed.length < 50 && !trimmed.includes(' - ')) {
      formatted += `<div class="text-orange-400 font-semibold text-base mb-2 mt-4">${escapeHtml(trimmed)}</div>`;
    }
    // Bullet points
    else if (trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.startsWith('*')) {
      formatted += `<div class="ml-6 mb-2 text-gray-200">${escapeHtml(trimmed)}</div>`;
    }
    // Sub-bullets (indented)
    else if (/^\s{2,}[-•*]/.test(line)) {
      formatted += `<div class="ml-10 mb-1 text-gray-300 text-sm">${escapeHtml(trimmed)}</div>`;
    }
    // Regular paragraphs
    else {
      formatted += `<div class="mb-2 text-gray-100 leading-relaxed">${escapeHtml(trimmed)}</div>`;
    }
  });
  
  return formatted || `<div class="text-gray-300 whitespace-pre-wrap">${escapeHtml(text)}</div>`;
}

// Simulate progress bar
function updateProgress(percent) {
  const progressBar = document.getElementById('progressBar');
  if (progressBar) {
    progressBar.style.width = `${percent}%`;
  }
}

// Generate strategy
async function generateStrategy() {
  if (!payload) {
    showError('No strategy data found. Please start over from the generator.');
    return;
  }

  showLoading();
  
  // Simulate progress
  let progress = 0;
  progressInterval = setInterval(() => {
    progress = Math.min(progress + Math.random() * 15, 90);
    updateProgress(progress);
  }, 500);

  try {
    const response = await fetch('/generate-strategy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorMessage = 'Request failed';
      try {
        const errorData = await response.json();
        if (response.status === 422 && errorData.detail) {
          const validationErrors = Array.isArray(errorData.detail) 
            ? errorData.detail.map(err => `${err.loc.join('.')}: ${err.msg}`).join('; ')
            : JSON.stringify(errorData.detail);
          errorMessage = `Validation error: ${validationErrors}`;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        }
      } catch (e) {
        const errText = await response.text();
        errorMessage = errText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    strategyData = data;
    
    // Complete progress
    clearInterval(progressInterval);
    updateProgress(100);
    
    // Display strategy
    const strategyText = data.strategy_text || data.strategy || 'No strategy text returned.';
    strategyContent.innerHTML = formatStrategyText(strategyText);
    
    // Show result with fade-in animation
    setTimeout(() => {
      showResult();
    }, 500);
    
  } catch (err) {
    clearInterval(progressInterval);
    console.error('Error generating strategy:', err);
    showError(err.message || 'An unexpected error occurred while generating your strategy.');
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  // Clear any old payload after a delay (optional)
  // sessionStorage.removeItem('strategyPayload');
  
  // Start generating strategy
  generateStrategy();
});

