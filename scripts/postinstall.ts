#!/usr/bin/env ts-node

import path from "path";
import { pathToFileURL } from "url";
import { runProtoc } from "../src/protoc"; // Adjust if needed
import type { Plugin } from "vite";
import type { ProtobufPluginOptions } from "../src";

const loadViteConfig = async () => {
  const viteConfigPath = path.resolve(process.cwd(), "vite.config.ts");

  // Dynamically import as ESM-compatible module
  const configModule = await import(pathToFileURL(viteConfigPath).href);
  const viteConfig = configModule.default;

  if (typeof viteConfig !== "function") {
    throw new Error("vite.config.ts does not export a function as default");
  }

  return viteConfig;
};

(async () => {
  const viteConfig = await loadViteConfig();
  const config = await viteConfig({ command: "build", mode: "development" });

  const plugin = config.plugins?.find((p: Plugin) =>
    p.name === "vite-plugin-protobuf"
  );

  if (!plugin || !("__options" in plugin)) {
    console.error("vite-plugin-protobuf not found or missing __options");
    process.exit(1);
  }

  const options = (plugin as any).__options as ProtobufPluginOptions;
  const outputDir = path.resolve("node_modules/.vite-plugin-protobuf");

  await runProtoc({ protoPath: options.protoPath, outputDir });

  console.log("✅ Protobuf compilation completed.");
})();
