import path from "path";
import { pathToFileURL } from "url";
import { runProtoc } from "../src/protoc";
import type { Plugin } from "vite";
import type { ProtobufPluginOptions } from "../src";

const loadViteConfig = async () => {
  const viteConfigPath = path.resolve(process.cwd(), "vite.config.ts");
  const configModule = await import(pathToFileURL(viteConfigPath).href);
  return configModule.default;
};

(async () => {
  const viteConfig = await loadViteConfig();
  const config = await viteConfig({ command: "build", mode: "development" });

  const plugin = config.plugins?.find((p: Plugin) =>
    p.name === "vite-plugin-protobuf"
  );

  if (!plugin || !("__options" in plugin)) {
    throw new Error("vite-plugin-protobuf not found or missing __options");
  }

  const options = (plugin as any).__options as ProtobufPluginOptions;
  const outputDir = path.resolve("node_modules/.vite-plugin-protobuf");

  await runProtoc({ protoPath: options.protoPath, outputDir });
})();
