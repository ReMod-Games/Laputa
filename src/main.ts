console.time()
import thing from "../css/main.css";
import { Scene } from "https://esm.sh/@babylonjs/core@5.0.0-alpha.42";
import { loadStyle } from "./helper/loader.ts";
import { createPerfectCanvas } from "./helper/canvas.ts";
import { createRenderLoop } from "./createRenderLoop.ts";
import { defaultScene } from "./defaultScene.ts";
loadStyle(thing);
const canvas = createPerfectCanvas();

//either webgl or webgpu, depending on if webgpu is supported.
const engine = await (await import(navigator.gpu ? "./engines/webgpu.ts" : "./engines/webgl.ts")).default(canvas);

const scene = new Scene(engine);
defaultScene(scene, canvas);
createRenderLoop(engine, scene)

console.timeEnd()
