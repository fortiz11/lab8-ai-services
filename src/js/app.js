import { ChatModel } from './model.js';
import { ChatView } from './view.js';
import { ChatController } from './controller.js';
import { getBotResponse } from './eliza.js';   

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

// Shim to match controller’s expected API
window.eliza = { respond: (text) => getBotResponse(text) };

// Boot
new ChatController(model, view);
