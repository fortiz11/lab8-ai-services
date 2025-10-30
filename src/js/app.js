import { ChatModel } from './model.js';
import { ChatView } from './view.js';
import { ChatController } from './controller.js';
  

// Helper
const qs = (sel) => document.querySelector(sel);

// Model
const model = new ChatModel();

// View
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

const controller = new ChatController(model, view);

const providerSelect = document.getElementById('providerSelect');
if (providerSelect) {
  providerSelect.value = localStorage.getItem('provider') || 'eliza';
  providerSelect.addEventListener('change', (e) => {
    controller.setProvider(e.target.value);
    alert(`Switched to ${e.target.value} provider`);
  });
}

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