// scripts/postinstall.js
const { register } = require("ts-node");
const path = require("path");

// Register ts-node for the current process
register({
  transpileOnly: true,
  project: path.resolve(__dirname, "../tsconfig.json"),
});

require("./postinstall-entry.ts");
