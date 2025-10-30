//this 

import {AiPort} from './AiPort.js';

/**
 * Deterministic mock AI adapter for testing.
 * - Implements the AiPort interface.
 * - Returns a known string so that test are quick and reliable.
 */

export class MockService extends AiPort{
    // Add a small default delay so test harness can observe the user bubble
    // before the assistant reply appears. Tests rely on asynchronous behavior.
    constructor ({reply= 'Mock_Reply', delayMs=300 }={}){
        super();
        this.reply= reply;
        this.delayMs= delayMs;
    }

    /**
   * Returns a deterministic reply without using the network.
   * Ignores the input messages on purpose (predictability for tests).
   *
   * @async
   * @returns {Promise<string>} fixed reply string
   */


    async generate (){
        if (this.delayMs>0){
            //adds delay to mimic real API calls 
            await new Promise(r=>setTimeout(r, this.delayMs));
        }
        return this.reply;
    }
}