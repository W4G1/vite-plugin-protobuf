import path from "path";
import fs from "fs";
import { promisify } from "util";
import { exec } from "child_process";

const execAsync = promisify(exec);

export async function runProtoc(
  { outputDir, protoPath }: {
    outputDir: string;
    protoPath: string;
  },
) {
  // clean & recreate output
  await fs.promises.rm(outputDir, { force: true, recursive: true });
  await fs.promises.mkdir(outputDir, { recursive: true });

  try {
    await execAsync(
      `npx protoc --ts_out=${outputDir} --proto_path=${protoPath} ${
        path.join(protoPath, "*.proto")
      }`,
    );
  } catch (err: any) {
    console.error("[vite-plugin-protobuf] protoc error:", err.stderr || err);
    throw err;
  }
}
