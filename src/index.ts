import type { Plugin } from 'vite';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { exec } from 'child_process';
import chokidar, { type FSWatcher } from 'chokidar';

const execAsync = promisify(exec);
const DEBOUNCE_COOLDOWN_MS = 100;

export default function createProtocTempPlugin(): Plugin {
  let cacheDir: string;
  let outputDir: string;
  let protoDir: string;
  let lastRun = 0;
  let busy = false;
  let watcherInstance: FSWatcher | null = null;

  async function runProtoc() {
    // clean & recreate output
    await fs.promises.rm(outputDir, { force: true, recursive: true });
    await fs.promises.mkdir(outputDir, { recursive: true });

    try {
      // adjust your --ts_out flags if needed
      await execAsync(
        `protoc --ts_out=${outputDir} --proto_path=${protoDir} ${path.join(protoDir, '*.proto')}`
      );
    } catch (err: any) {
      console.error('[vite-plugin-protobuf] protoc error:', err.stderr || err);
      throw err;
    }
  }

  return {
    name: 'vite-plugin-protobuf',

    configResolved(config) {
      cacheDir = path.isAbsolute(config.cacheDir)
        ? config.cacheDir
        : path.resolve(config.root, config.cacheDir);
      outputDir = path.resolve(cacheDir, 'proto-gen');
      protoDir = path.resolve(config.root, '../proto');
    },

    async buildStart() {
      await runProtoc();
    },

    resolveId(id) {
      if (id === '@proto-gen') {
        return outputDir;
      }
      if (id.startsWith('@proto-gen/')) {
        const rel = id.slice('@proto-gen/'.length);
        for (const ext of ['.ts', '.js']) {
          const full = path.join(outputDir, rel + ext);
          if (fs.existsSync(full)) {
            return full;
          }
        }
        return path.join(outputDir, rel);
      }
      return null;
    },

    async configureServer(server) {
      const handle = async () => {
        const now = Date.now();
        if (busy || now - lastRun < DEBOUNCE_COOLDOWN_MS) return;
        busy = true;
        lastRun = now;
        try {
          await runProtoc();
          server.ws.send({ type: 'full-reload', path: '*' });
        } catch {
          // swallow errors
        } finally {
          busy = false;
        }
      };

      try {
        watcherInstance = chokidar.watch(protoDir, {
          ignored: ['**/.git/**', '**/node_modules/**'],
          ignoreInitial: true,
        });

        watcherInstance.on('add', handle);
        watcherInstance.on('change', handle);
        watcherInstance.on('unlink', handle);

        server.httpServer?.once('close', () => {
          watcherInstance?.close();
        });
      } catch (err) {
        console.error('[vite-plugin-protobuf] chokidar setup failed:', err);
      }
    }
  };
}
