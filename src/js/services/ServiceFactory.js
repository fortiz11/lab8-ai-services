import {ElizaService} from './ElizaService.js';
import { OpenAIService } from './OpenAIService.js';
import {MockService} from './MockService.js';

/**
 * Creates an AI service instance based on the selected provider.
 * @param {string} provider - The name of the AI service to use ("eliza", "openai", "mock").
 * @param {object} [keys] - Optional API keys for cloud providers.
 * @returns {ElizaService | OpenAIService | MockService} A ready-to-use service object.
 */


export function createService(provider,  keys ={}){
    switch (provider){
        case 'openai':
            return new OpenAIService({apiKey: keys.openaiKey});

        case 'mock':
            return new MockService();

        case 'eliza':
            //in case the other providers are undefined then it wil default to Eliza
            default:
                return new ElizaService();
    }
}

