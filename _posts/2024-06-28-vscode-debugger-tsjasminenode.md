---
title: "Debug Jasmine Tests in TypeScript on Node.js With VS Code"
tags: [typescript]
---
This post shows you how to configure the Visual Studio Code debugger to run on Jasmine unit tests written in TypeScript using Node.js as the test runner with minimal dependencies. I wrote this post because many other sources suggest installing additional packages such as `ts-node` and `jasmine-ts` but this doesn't seem to be necessary and it's good to remove unneeded dependencies to minimize the security risk.

This post assumes basic familiarity with these technologies. The written code should work on Unix systems and probably won't work on Windows. These steps probably work with test frameworks besides Jasmine (after minor adjustments) but I haven't tested it.

For an example of a minimal project with this set up working, see [my companion repository][mvp].

Here's what you need to do, assuming you already have Node.js installed and a basic Node.js project configured:

## 1) Install TypeScript, Jasmine, & types
With Node.js installed, run the following:
```sh
npm install --save-dev typescript jasmine @types/jasmine
```

You may also want to install Node.js' type definitions, `@types/node`.

## 2) Initialize TypeScript & Jasmine
If you don't already have TypeScript and Jasmine configured, you can run the following commands to create an initial configuration:
```sh
npx tsc --init
npx jasmine init
```

These will add the `tsconfig.json` and the `spec/support/jasmine.json` files respectively. You'll also need to add a build command to the `scripts` key of your `package.json`:
```json
    "scripts": {
        "build": "tsc --build",
    }
```

You should also add a spec/test file in `spec/` with at least one spec, e.g.:
```typescript
// spec/indexSpec.ts
describe('default spec', () => {
    it('has a spec', () => {
        expect(true).toBeTrue();
    });
});
```

If you wish to use **ES modules** in your project instead of commonjs modules, add the following to the root object in your `package.json` to notify Node.js:
```json
    "type": "module",
```

And the change the `module` key in your `tsconfig.json` to the following (or any equivalent value) to notify the TypeScript compiler:
```json
    "module": "ES2022",
```

## 3) Enable Source Maps
By default, TypeScript will not output [Source Maps][source maps]. To enable this, add the following to the `compilerOptions` key in your `tsconfig.json`:
```json
    "sourceMap": true,
```

By default, Node.js will not use the Source Maps, i.e. it will print stack traces referencing line numbers in the transpiled JavaScript files rather than the original TypeScript source. To enable Source Maps on Node, you must pass the `--enable-source-maps` flag to Node.js either on the command line or via the `NODE_OPTIONS` environment variable. A simple solution is to add it as part of your `package.json` scripts:
```json
    "scripts": {
        "start": "node --enable-source-maps index.js",
        "test": "export NODE_OPTIONS=--enable-source-maps; npx jasmine",
    },
```

Now you can execute your program (`npm start`) and its Jasmine tests (`npm test`) with full TypeScript support.

## 4) Add a debug Configuration to VS Code
Lastly, we must configure the debugger. In the `configurations` key of `.vscode/launch.json`, add the following:
```json
    "configurations": [
        {
            "name": "Debug Jasmine Tests",
            "type": "node",
            "program": "${workspaceFolder}/node_modules/jasmine/bin/jasmine.js",
        },
        {
            "name": "Debug Jasmine Current File",
            "type": "node",
            "program": "${workspaceFolder}/node_modules/jasmine/bin/jasmine.js",
            "args": ["${workspaceFolder}/${relativeFileDirname}/${fileBasenameNoExtension}.js"],
        },
    ],
```

The first configuration will run all of your Jasmine tests with the debugger attached and the second will run the current TypeScript spec file (i.e. whichever file the cursor is placed in) with the debugger attached. When testing the debugging functionality, don't forget to add a breakpoint by clicking in the left margin of the line you wish to stop on.

To see a minimal project with these configurations applied, see [my companion repository][mvp].

That's all you need – now go fix those bugs! 😝

[mvp]: https://github.com/mcomella/vscode-debugger-tsjasminenode
[source maps]: https://en.wikipedia.org/wiki/Minification_(programming)#Source_mapping
