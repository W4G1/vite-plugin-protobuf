import path from "path";
import { runProtoc } from "./protoc";
import viteConfig from "../vite.config";
import type { ProtobufPluginOptions } from ".";

(async () => {
  // const protoDir = path.resolve(__dirname, "../proto");

  const options = viteConfig({ command: "build", mode: "dev" }).plugins!.find((
    p,
  ) => p.name === "vite-plugin-protobuf").__options as ProtobufPluginOptions;

  console.log("vite-plugin-protobuf options found!");

  const outputDir = path.resolve("node_modules/.vite-plugin-protobuf");

  await runProtoc({ protoPath: options.protoPath, outputDir });
})();
