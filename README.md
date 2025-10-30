# Lab 8 — AI Services Chat Application

## Live Demo
✅ Deployed on Netlify:  
https://resonant-cendol-b9dfd7.netlify.app/

---

## Overview
This lab extends the MVC chat application by adding support for AI providers. Users can chat with a built-in Eliza bot or switch to OpenAI using a provider dropdown and an API key input. The design emphasizes clean separation of concerns, a pluggable service layer for AI backends, persistent state, and tested model logic.

## Features
- Selectable AI provider: Eliza (offline) or OpenAI (online)
- API key entry UI for OpenAI; settings persist across reloads
- Chat history saved in LocalStorage
- Reactive updates via model subscriptions
- Tested model behavior: add, update, clear, and notify

## How to Use
1. Open the app in your browser.  
2. Choose **Eliza** or **OpenAI** from the provider dropdown.  
3. If choosing **OpenAI**, enter your API key in the input field.  
4. Send messages; the bot replies and the chat persists after refresh.  
5. Your selected provider and API key are remembered for next time.

## AI Provider System

### BaseAIService (Concept)
All AI providers conform to a shared contract that can generate a response to user input. This abstraction lets the app switch providers without changing controller or model code.

### ElizaService (Offline Default Provider)
Eliza is a built-in, rule-based chatbot that produces deterministic, pattern-driven replies. It requires no internet and no API key, so it’s always available and serves as a reliable fallback.
- Always available and zero-cost  
- No external dependencies  
- Instant responses  
- Ideal for offline use, testing, and demos

### OpenAIService (Online AI Provider)
The OpenAI provider uses the user’s OpenAI API key to produce model-generated responses. It requires network access and a valid key entered by the user. The selected provider and key are stored in LocalStorage so settings persist between sessions. If the key is missing or invalid, the app falls back to Eliza.
- Real LLM-powered conversation  
- Async request/response handling  
- User-managed API key stored locally  
- Graceful fallback to Eliza on errors

### Provider Flow Summary
- User selects a provider in the UI.  
- Selection and (if applicable) API key are saved in LocalStorage.  
- On startup, the app loads the saved provider and key.  
- The controller uses the selected service to request a reply.  
- The model updates state and notifies subscribers.  
- The view re-renders the chat when events arrive.

## Testing
This project includes Jest tests to validate model behavior.

**Tests confirm:**  
- Messages are stored correctly (add)  
- Messages can be updated (update)  
- Messages can be cleared (clear)  
- Subscribed listeners are notified with the right payloads (notify)

**How to run tests:** run `npm test`.  
All tests should pass, confirming reliable model logic and event triggers. No external API calls are made during tests.

## Key Concepts Practiced
- **MVC Architecture:** Clear separation between Model, View, and Controller for maintainability and testability.  
- **Service Layer / Dependency Inversion:** Swappable provider implementations behind a common interface.  
- **Event-Driven Updates:** Model publishes events; the view subscribes and re-renders accordingly.  
- **LocalStorage Persistence:** Provider choice, API key, and chat history persist across sessions.  
- **Asynchronous Programming:** Handling async request/response flow for online providers.  
- **Unit Testing with Jest:** Verifying core model operations and subscription notifications with mocks.

## Troubleshooting & Lessons Learned
| Challenge | Resolution |
|---|---|
| Provider kept reverting to Eliza | Persisted provider in LocalStorage and loaded on startup |
| OpenAI key not applied | Bound input to provider init and persisted key locally |
| Chat UI not updating | Ensured model emits events and the view subscribes correctly |
| Tests failing on state changes | Used mock subscribers and asserted expected payloads |

## Extending the App
To add another AI provider (e.g., Gemini, Claude, or a local model):  
1) Implement a new service following the BaseAIService contract.  
2) Add the provider to the dropdown and provider registry.  
3) (Optional) Add any provider-specific settings to LocalStorage.  
The architecture is intentionally modular, enabling easy expansion.

## Conclusion
This lab delivers an extensible, testable chat application that supports multiple AI backends, clean MVC separation, persistent state, and a graceful offline fallback. It provides a solid foundation for future enhancements and additional AI integrations.
