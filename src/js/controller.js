//   Responsibilities:
//   1. Handle user input
//   2. Coordinate Model updates
//   3. Trigger View rendering actions

import {createService} from './services/ServiceFactory.js'



export class ChatController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    //Initialization of the provider and service (new to lab 8)
    this.provider = localStorage.getItem('provider') || 'eliza';
    this.service = createService(this.provider, { openaiKey:
      localStorage.getItem('openaiKey'), 
    });
    

    // Bind handlers to maintain correct 'this' context when passed as callbacks
    this.handleSend = this.handleSend.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleImport = this.handleImport.bind(this);
    this.handleExport = this.handleExport.bind(this);

    // Attach event listeners for user actions via the View
    this._wireUpEvents();

    // Initialize the app by loading stored messages
    this.model.load();
  }

    setProvider(name){
      this.provider = name;
      localStorage.setItem('provider', name);
      this.service = createService(name, { openaiKey:localStorage.getItem('openaiKey'),
    });
  }

  //
  //     Internal setup for event wiring between View and Controller.
  //      Handles form submission for sending messages
  //     Handles edit/delete/clear actions
  //     Handles import/export actions
  //
  _wireUpEvents() {
    // Send message when user submits form
    this.view.formEl.addEventListener("submit", this.handleSend);

    // Listen for delegated edit/delete actions from the message list
    this.view.listEl.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;

      const action = btn.dataset.action;
      const li = btn.closest("[data-message-id]");
      const id = li?.dataset.messageId;
      if (!id) return;

      if (action === "edit") this.handleEdit(id);
      if (action === "delete") this.handleDelete(id);
    });

    // Clear chat when the user clicks "Clear Chat"
    this.view.clearBtn.addEventListener("click", this.handleClear);

    // Import/export chat JSON
    // the import input is a file input; listen for change
    if (this.view.importInput) {
      this.view.importInput.addEventListener('change', this.handleImport);
    }
    this.view.exportBtn.addEventListener("click", this.handleExport);
  }

  //
  //     Handles sending a new message.
  //     - Prevents form reload behavior
  //     - Grabs input text, trims it, and sends to Model as user message
  //     - Generates and adds bot response
  //     - Clears the input field

  async handleSend(e) {
  e.preventDefault();
  const text = this.view.inputEl.value.trim();
  if (!text){
    return;
  }

  this.model.createMessage(text, true);

  try {
    const reply = await this.service.generate([{role: 'user', content: text}]);

    this.model.createMessage(reply, false);

  }
  catch (err){
    const msg = (err && err.message)? err.message : String (err);
    this.model.createMessage(`${msg}`, false);
  }

  this.view.inputEl.value='';
}

  handleEdit(id) {
    const msg = this.model.messages.find((m) => m.id === id);
    if (!msg) return;

    const newText = prompt("Edit your message:", msg.text);
    if (newText !== null && newText.trim() !== msg.text) {
      this.model.updateMessage(id, {text: newText.trim()});
    }
  }

  //     Handles message deletion.
  //    Confirms with the user
  //    Removes the message from the Model and View

  handleDelete(id) {
    const confirmDelete = confirm(
      "Are you sure you want to delete this message?"
    );
    if (confirmDelete) {
      this.model.deleteMessage(id);
    }
  }

  // Handles clearing the entire chat history.
  // Confirms destructive action
  // Clears all messages from Model (and therefore View)
  handleClear() {
    const confirmClear = confirm("Clear entire chat history?");
    if (confirmClear) {
      this.model.clearMessages();
    }
  }


  handleExport() {
    const data = JSON.stringify(this.model.messages, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "chat-history.json";
    a.click();

    URL.revokeObjectURL(url);
  }


  async handleImport(e) {
  const file = e?.target?.files?.[0];
  if (!file) return;

  
  try {
    const text = await file.text();
    const importedMessages = JSON.parse(text);
    this.model.replaceAll(importedMessages);
  } catch (err) {
    alert("Import failed: Invalid JSON file.");
      
    }finally{
      if (e?.target){
        e.target.value='';
      }
    }
  }
}
