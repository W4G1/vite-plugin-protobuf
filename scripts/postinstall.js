// scripts/postinstall.js
import { register } from 'ts-node';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Register ts-node with transpile-only mode
register({
  transpileOnly: true,
  project: path.resolve(__dirname, '../tsconfig.json'),
});

// Dynamically import your TypeScript entry file
const entryPath = path.resolve(__dirname, './postinstall-entry.ts');
await import(pathToFileURL(entryPath).href);
