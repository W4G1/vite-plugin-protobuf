// scripts/postinstall.js (ESM)
import { register } from 'ts-node';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

register({
  transpileOnly: true,
  // you can ignore node_modules by default
  ignore: ['**/node_modules/**'],
  compilerOptions: {
    module: 'ESNext',
    moduleResolution: 'NodeNext',
    target: 'ES2020',
    esModuleInterop: true,
    skipLibCheck: true
  }
});

const entryURL = pathToFileURL(path.resolve(__dirname, './postinstall-entry.ts')).href;
await import(entryURL);
