import { AiPort } from "./AiPort.js";

export class OpenAIService extends AiPort {

     /**
   * Build a service instance with credentials and model choice.
   *
   * @param {{ apiKey?: string, model?: string }} [opts]
   *   - apiKey: your OpenAI API key (required for real calls)
   *   - model: OpenAI chat model id (default: 'gpt-4o-mini')
   */
  constructor({ apiKey, model = "gpt-4o-mini" } = {}) {
    super();
    this.apiKey = apiKey;
    this.model = model;
  }


/**
   * Sends the full chat history to OpenAI and returns the assistant's reply text.
   * Uses Fetch API with JSON POST. Throws on network or non-2xx responses.
   *
   * @async
   * @param {ChatMessage[]} messages  Full conversation so far.
   * @returns {Promise<string>}       Assistant message text.
   * @throws {Error}                  If apiKey is missing, network fails, or HTTP status is not 2xx.
   */

  async generate(messages) {
    if (!this.apiKey) throw new Error("Missing OpenAi API key");

    const res = await fetch("https://api.openai.com/va/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        //controls randomness
        temperature: 0.7,
      }),
    });
  }
}
