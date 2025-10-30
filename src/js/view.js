export class ChatView {
  // forms the dom elements that will be
  constructor({
    model,
    listEl,
    emptyEl,
    formEl,
    inputEl,
    clearBtn,
    exportBtn,
    importInput,
    messageTemplate,
    messageCountEl,
    lastSavedEl,
  }) {
    this.model = model;
    this.listEl = listEl;
    this.emptyEl = emptyEl;
    this.formEl = formEl;
    this.inputEl = inputEl;
    this.clearBtn = clearBtn;
    this.exportBtn = exportBtn;
    this.importInput = importInput;
    this.messageTemplate = messageTemplate;
    this.messageCountEl = messageCountEl;
    this.lastSavedEl = lastSavedEl;

    this.handlers = {
      submit: null,
      clearAll: null,
      export: null,
      import: null,
      edit: null,
      del: null,
    };

    // expose the template with a consistent property name
    this.template = messageTemplate;

    // Subscribe to model events
    this.unsubscribe = this.model.subscribe((evt) => {
      // extracts info from the event
      const { type, payload } = evt;

      if (type === "loaded") {
        // if payload is defined then it is used. If not then use empty array
        this.renderAll(payload.messages ?? []);
        // updates message count
        this.setCounts(this.model.messages.length);
      }

      if (type === "created") {
        this.appendMessage(payload.message);
        this.setCounts(this.model.messages.length);
      }

      if (type === "updated") {
        this.updateMessage(payload.message);
      }

      if (type === "deleted") {
        this.removeMessage(payload.message.id);
        this.setCounts(this.model.messages.length);
      }

      if (type === "cleared") {
        this.renderAll([]);
        this.setCounts(0);
      }
      if (type === "saved") {
        this.setLastSaved(payload.at);
      }

      //used when you import JSON
      //Re-renders the full chat
      if (type === "changed") {
        this.renderAll(this.model.messages);
        this.setCounts(this.model.messages.length);
      }
    });

    this.listEl.addEventListener("click", (e) => {
      // finds the nearest ancestor that matches CSS selector
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;
      // once the button is clicked, finds which message it belongs to.
      const li = btn.closest("[data-message-id]");
      if (!li) return;
      const id = li.dataset.messageId;
      if (btn.dataset.action === "edit") this.handlers.edit?.(id);
      if (btn.dataset.action === "delete") this.handlers.del?.(id);
    });
  }

  //connects DOM event to a function that will be called by the controller
  onSubmit(fn) {
    this.handlers.submit = fn;
    //attaches the function to the submit event
    this.formEl.addEventListener("submit", fn);
  }
  onClearAll(fn) {
    this.handlers.clearAll = fn;
    this.clearBtn.addEventListener("click", fn);
  }
  onExport(fn) {
    this.handlers.export = fn;
    this.exportBtn.addEventListener("click", fn);
  }
  onImport(fn) {
    this.handlers.import = fn;
    this.importInput.addEventListener("change", fn);
  }
  onEdit(fn) {
    this.handlers.edit = fn;
  }
  onDelete(fn) {
    this.handlers.del = fn;
  }

  //renders the entire chat view
  renderAll(messages) {
    //empties the container to be able to start with a fresh view rendering
    this.listEl.innerHTML = "";
    messages.forEach((m) => this._appendMessage(m));
    this._afterRender(messages.length);
  }

  //meant to add one message to the screen
  appendMessage(msg) {
    this._appendMessage(msg);
    this._afterRender();
  }

  updateMessage(msg) {
    //finds the element that matches message ID
    const li = this.listEl.querySelector(`[data-message-id="${msg.id}"]`);
    if (!li) return;
    li.querySelector(".text").textContent = msg.text;
    //updates edited flag
    li.classList.toggle("edited", !!msg.edited);
  }

  removeMessage(id) {
    this.listEl.querySelector(`[data-message-id="${id}"]`)?.remove();
    this._afterRender();
  }

  //calculates messages in chat
  setCounts(n) {
    //Condition if there is exactly one message or multiple
    this.messageCountEl.textContent = `${n} message${n === 1 ? "" : "s"}`;
  }

  setLastSaved(date) {
    if (!date) {
      this.lastSavedEl.textContent = "-";
      return;
    }
    const fmt = new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
    this.lastSavedEl.textContent = fmt;
  }

  clearComposer() {
    this.inputEl.value = "";
    this.inputEl.focus();
  }

  confirm(t) {
    return window.confirm(t);
  }
  prompt(t, d = "") {
    return window.prompt(t, d);
  }

  _assistantName() {
    const p = (localStorage.getItem("provider") || "eliza").toLowerCase();
    const map = {
      openai: "ChatGPT",
      gemini: "Gemini",
      eliza: "Eliza",
      mock: "Mock AI",
    };
    return map[p] || p;
  }

  //internal helper that creates and appends a single chat message element
  _appendMessage(msg) {
    const li = this.template.content.firstElementChild.cloneNode(true);
    li.dataset.messageId = msg.id;

    const wrapper = li.firstElementChild;
    wrapper.classList.remove("user", "message-bot");
    wrapper.classList.add(msg.isUser ? "user" : "message-bot");

    li.classList.toggle("edited", !!msg.edited);
    const senderName = msg.isUser ? "You" : this._assistantName();
    li.querySelector(".sender").textContent = senderName;

    li.querySelector(".text").textContent = msg.text;

    const t = li.querySelector(".timestamp");
    const dt =
      msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp);
    t.dateTime = dt.toISOString();
    t.textContent = new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    }).format(dt);

    const actions = li.querySelector(".actions");
    actions.innerHTML = msg.isUser
      ? `<button data-action="edit" aria-label="Edit">Edit</button>
         <button data-action="delete" aria-label="Delete">Delete</button>`
      : "";

    this.listEl.appendChild(li);
  }
  //helper that updates interface after messages are added and removed
  _afterRender(n = this.listEl.children.length) {
    this.emptyEl.style.display = n ? "none" : "block";
    this.listEl.scrollTop = this.listEl.scrollHeight;
    this.setCounts(n);
  }
}
