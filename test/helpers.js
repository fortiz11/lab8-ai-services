// tests/helpers.js
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export function fileUrl(relativePathFromRoot) {
  const p = path.resolve(process.cwd(), relativePathFromRoot);
  return pathToFileURL(p).href; // e.g., file:///.../index.html
}
