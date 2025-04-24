#!/usr/bin/env node
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// build an absolute file:// URL to your dist script
const moduleUrl =
  new URL(join(__dirname, "dist", "generate-proto.js"), import.meta.url).href;

import(moduleUrl)
  .catch((err) => {
    console.error("❌ postinstall failed:", err);
    process.exit(1);
  });
