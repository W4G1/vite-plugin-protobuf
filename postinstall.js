#!/usr/bin/env node
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join } from 'path';

// ESM __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

// build the absolute path to your dist script
const scriptPath = join(__dirname, 'dist', 'generate-proto.js');
// convert it to a file:// URL
const scriptUrl  = pathToFileURL(scriptPath).href;

// dynamically import the ESM script
import(scriptUrl)
  .catch(err => {
    console.error('❌ postinstall failed:', err);
    process.exit(1);
  });
