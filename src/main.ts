console.time()
import thing from "../css/main.css";
import { Scene } from "https://esm.sh/@babylonjs/core@5.0.0-alpha.42";
import { loadStyle } from "./helper/loader.ts";
import { createPerfectCanvas } from "./helper/canvas.ts";
import { createRenderLoop } from "./createRenderLoop.ts";
import { defaultScene } from "./defaultScene.ts";
loadStyle(thing);
const canvas = createPerfectCanvas();

//This line of code querys the browser for support for the WebGPU Specifications (https://www.w3.org/TR/webgpu/) and if it is supported, then it will attempt to initialize the canvas with WebGPU enabled. If the browser doesn't support the WebGPU specifications (https://www.w3.org/TR/webgpu/) then it will attempt to initialize the canvas with WebGL instead.
const engine = await (await import(navigator.gpu ? "./engines/webgpu.ts" : "./engines/webgl.ts")).default(canvas);

const scene = new Scene(engine);
defaultScene(scene, canvas);
createRenderLoop(engine, scene)

console.timeEnd()
