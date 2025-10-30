import path from 'node:path';
import { pathToFileURL } from 'node:url';

export function fileUrl() {
  const abs = path.resolve(process.cwd(), 'src/index.html'); // your HTML lives in src/
  return pathToFileURL(abs).href;
}

// convenience locators for your markup (see index.html template)
export function senderLocator(page) {
  return page.locator('#messageList .message .sender');
}
export function textLocator(page) {
  return page.locator('#messageList .message .text');
}
export function allMessages(page) {
  return page.locator('#messageList .message');
}
