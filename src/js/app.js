// src/js/app.js
import { ChatModel } from './model.js';
import { ChatView } from './view.js';
import { ChatController } from './controller.js';

// Helper
const qs = (sel) => document.querySelector(sel);

// Model
const model = new ChatModel();

// View (adjust IDs only if yours differ)
const view = new ChatView({
  model,
  listEl: qs('#messageList'),
  emptyEl: qs('#emptyState'),
  formEl: qs('#messageForm'),
  inputEl: qs('#messageInput'),
  clearBtn: qs('#clearChat'),
  exportBtn: qs('#exportChat'),
  importInput: qs('#importFile'),
  messageTemplate: qs('#messageTemplate'),
  messageCountEl: qs('#messageCount'),
  lastSavedEl: qs('#lastSaved'),
});

// Controller
const controller = new ChatController(model, view);
window.controller = controller; // expose for console debugging

// ---- Provider dropdown wiring ----
const providerSelect = document.getElementById('providerSelect');
if (providerSelect) {
  // SANITIZE the stored provider to avoid stray quotes/case issues
  const saved = (localStorage.getItem('provider') || 'eliza')
    .trim()
    .replace(/^['"]|['"]$/g, '')
    .toLowerCase();

  providerSelect.value = saved;
  controller.setProvider(saved); // ensure controller matches UI on load

  providerSelect.addEventListener('change', (e) => {
    const name = String(e.target.value).trim().toLowerCase();
    controller.setProvider(name);           // rebuild service
    localStorage.setItem('provider', name); // persist selection
  });
}

// ---- OpenAI key save wiring ----
const openaiKeyInput = document.getElementById('openaiKeyInput');
const saveOpenAIKeyBtn = document.getElementById('saveOpenAIKeyBtn');

if (saveOpenAIKeyBtn && openaiKeyInput) {
  saveOpenAIKeyBtn.addEventListener('click', () => {
    const key = openaiKeyInput.value.trim();
    if (!key) {
      alert('Please enter a valid OpenAI API key.');
      return;
    }
    localStorage.setItem('openaiKey', key);
    openaiKeyInput.value = '';
    alert('✅ OpenAI key saved to localStorage.');
  });
}
