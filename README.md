# vite-plugin-protobuf

A Vite plugin that compiles `.proto` files using `protoc` and [`@protobuf-ts`](https://github.com/timostamm/protobuf-ts) to generate TypeScript clients, ready for use in your frontend app.

- Powered by [protobuf-ts](https://github.com/timostamm/protobuf-ts)
- The plugin watches your `.proto` files and regenerates output on changes
- All generated files are written to `node_modules/.vite/proto-gen`
- You can access this output using the alias `@proto-gen`

---

## Installation

Install the plugin:

```bash
npm install --save-dev vite-plugin-protobuf
```

### Required Dependencies

You **must manually add** the following dependencies to your `package.json`:

```json
{
  "dependencies": {
    "@protobuf-ts/runtime": "^2.9.6",
    "@protobuf-ts/runtime-rpc": "^2.9.6"
  },
  "devDependencies": {
    "@protobuf-ts/plugin": "^2.9.6",
    "@protobuf-ts/protoc": "^2.9.6",
  }
}
```

Then run:

```bash
npm install
```

## Configuration

Add the plugin to your `vite.config.ts` or `vite.config.js`:

```ts
import protobuf from 'vite-plugin-protobuf';

export default {
  plugins: [
    protobuf({
      protoPath: '../proto'
    })
  ]
};
```
---

### Usage with Vite + SPA (React, Vue, Svelte etc.)

Update your `tsconfig.app.json` (or equivalent) with the following path alias:

```json
{
  "compilerOptions": {
    "paths": {
      "@proto-gen/*": [
        "./node_modules/.vite/proto-gen/*"
      ]
    }
  }
}
```

This ensures TypeScript can resolve the generated files.

---

### Usage with SvelteKit

Modify the `vite.config.ts` like so:

```ts
import protobuf from 'vite-plugin-protobuf';

export default {
  plugins: [
    protobuf({
      protoPath: "../proto",
      outputDir: "./src/lib/proto",
    })
  ]
};
```

Once your `.proto` files are compiled, you can import the generated clients like so:

```ts
// Compiled from helloworld.proto
import { GreeterClient } from "$lib/proto/helloworld.client";
```

---

## Next steps with gRPC Web

To use the generated clients with gRPC over HTTP in the browser, install:

```bash
npm install @protobuf-ts/grpcweb-transport
```

Then, create your gRPC client like this:

```ts
import { GreeterClient } from "@proto-gen/helloworld.client";
import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";

const transport = new GrpcWebFetchTransport({
  baseUrl: "https://your-grpc-api.com"
});

const client = new GreeterClient(transport);

async function greet() {
  const response = await client.sayHello({ name: "World" });
  console.log(response.response.message);
}
```

> The `GrpcWebFetchTransport` provides a browser-friendly implementation of the gRPC-web protocol using standard `fetch`.

For more information, see [protobuf-ts](https://github.com/timostamm/protobuf-ts).
