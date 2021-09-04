import thing from "../css/main.css";
import { WebGPUEngine, Scene, ArcRotateCamera, HemisphericLight, Vector3, MeshBuilder } from "https://esm.sh/@babylonjs/core@5.0.0-alpha.42";
import { loadStyle } from "./helper/loader.ts";
import { createPerfectCanvas } from "./helper/canvas.ts";

loadStyle(thing);

const canvas = createPerfectCanvas();

const engine = new WebGPUEngine(canvas);
await engine.initAsync();

const scene = new Scene(engine);
const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new Vector3(0, 0, 0), scene);
camera.attachControl(canvas, true);
new HemisphericLight("light", new Vector3(0, 1, 0), scene);
MeshBuilder.CreateBox("box", {}, scene);
engine.runRenderLoop(() => scene.render())

addEventListener("resize", () => {
    engine.resize()
});