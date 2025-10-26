import { AiPort } from "./AiPort.js";
 /**
     * Adapter for a local, rule-based Eliza-like chat box.
     * Implements the AiPort interface so it can be swapped with cloud providers.
     * This stays async for interface consistency, since the other providers await the network
     *  
     * @extends AiPort
     */

export class ElizaService extends AiPort {

    /**
     * Generates a local Eliza-Style reply using simple text rules 
     * @param {Array<{role: 'user'| 'assistant'| 'system', content:string}>} messages
     * The full chat history. Only the latest user message is used 
     * @returns {Promise<string>}
     * Resolves with the simulates Eliza reply  
     */

    async generate (message) {
        // copy of the message using spread syntax 
        const lastUser= {...message}
        //so that the newest message appears first 
        .reverse()
        //finds the latest user message 
        .find(m=> m.role==='user')?.content??'';

        if(/hello|hi/i.test(lastUser)) return "Eliza: Hello. How does that make you feel?";
        if (/bye|goodbye/i.test(lastUser)) return "Eliza: Goodbye. It was nice chatting. ";

        return `Eliza: You said, "${lastUser}". Tell me more`;
    }
}