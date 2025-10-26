/**
 * Allows for the ChatModel to be called in other files
 * Default key of Lab7-chat but can also allows to be called with no parameters
 */

export class ChatModel {
  constructor({ storageKey = "Lab7-chat" } = {}) {
    this.storageKey = storageKey;
    this.messages = [];
    this.lastSavedAt = null;
    this.listeners = {};
  }

  //Function that subscribes to an event
  //callback is a function that will be defined depending on the event
  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  // Subscribe to all events; returns an unsubscribe function
  subscribe(callback) {
    if (!this.listeners["*"]) this.listeners["*"] = [];
    this.listeners["*"] .push(callback);
    return () => this.Off("*", callback);
  }

  //function to unsubscribe to an event
  Off(event, callback) {
    if (!this.listeners[event]) return;
    //checks each stored function and keeps the ones not equal to the one we're removing
    this.listeners[event] = this.listeners[event].filter(
      (fn) => fn !== callback
    );
  }
  //Used to announce any data changes for each event
  emit(event, payload) {
    // notify event-specific listeners
    if (this.listeners[event]) {
      for (const fn of this.listeners[event]) fn({ type: event, payload });
    }
    // notify wildcard subscribers
    if (this.listeners['*']) {
      for (const fn of this.listeners['*']) fn({ type: event, payload });
    }
  }

  //CRUD Operations

  save() {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify({ messages: this.messages })
    );
    this.lastSavedAt = new Date();
    //this is so view can update "last saved"
    this.emit("saved", { at: this.lastSavedAt });
  }

  load() {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return;
    this.messages = JSON.parse(raw).messages || [];
    this.emit("loaded", { messages: this.messages });
  }

  createMessage(text, isUser = false) {
    const msg = {
      id: crypto.randomUUID(),
      text,
      isUser,
      timestamp: new Date(),
      edited: false,
    };
    this.messages.push(msg);
    this.save();
    this.emit("created", { message: msg });
    return msg;
  }

  // Replace entire message array (used for import)
  replaceAll(messages) {
    if (!Array.isArray(messages)) return;
    this.messages = messages.map((m) => ({
      ...m,
      timestamp: m.timestamp ? new Date(m.timestamp) : new Date(),
    }));
    this.save();
    this.emit('changed', {});
  }

  //updates parameter is used for the specific info we want to change
  updateMessage(id, updates) {
    //loops through messages to find the ID of the message we want to update
    const i = this.messages.findIndex((m) => m.id === id);
    if (i < 0) return;
    this.messages[i] = { ...this.messages[i], ...updates, edited: true };
    this.save();
    this.emit("updated", { message: this.messages[i] });
  }

  deleteMessage(id) {
    this.messages = this.messages.filter((m) => m.id !== id);
    this.save();
    this.emit("deleted", { message: { id } });
  }

  clearMessages() {
    this.messages = [];
    localStorage.removeItem(this.storageKey);
    this.emit("cleared", {});
  }
}
