//This is the port that the app will depend on

export class AiPort{
    /**
     * @param {Array<{role:'user'| 'assistant'| "system", content:string}>} messages
     * -This is an array from the chat that the providers will read in order
     * to generate a reply
     * @returns {Promise<string>}
     */

    async generate(messages) {
        
        throw new Error('Not implemented')
    }
}