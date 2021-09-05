import { build } from 'https://deno.land/x/esbuild@v0.12.25/mod.js';
import { httpImports } from 'https://deno.land/x/esbuild_plugin_http_imports@v1.1.3/index.ts'
import { emptyDir } from "https://deno.land/std@0.106.0/fs/mod.ts";


await emptyDir("./out")
build({
    entryPoints: {
        "main": "./src/main.ts",
    },
    platform: "browser",
    target: "esnext",
    format: "esm",
    treeShaking: true,
    external: [],
    chunkNames: "chunks/[name]-[hash]",
    watch: true,
    splitting: true,
    loader: {
        ".css": "file",
        ".wasm": "binary",
        ".fx": "text"
    },
    plugins: [
        httpImports({
            defaultToJavascriptIfNothingElseFound: true
        })
    ],
    bundle: true,
    logLevel: 'debug',
    outdir: "./out/",
    minify: true
})

await Deno.copyFile("index.html", "./out/index.html")
Deno.run({
    cmd: "deno run --allow-net --allow-read https://deno.land/std@0.106.0/http/file_server.ts ./out".split(" ")
})
for await (const _ of Deno.watchFs("index.html")) {
    Deno.copyFileSync("index.html", "./out/index.html")
}