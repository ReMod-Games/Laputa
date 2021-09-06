import { WebGPUEngine } from "https://esm.sh/@babylonjs/core@5.0.0-alpha.42";

export default async function (canvas: HTMLCanvasElement) {
    const engine = new WebGPUEngine(canvas)
    await engine.initAsync();
    return engine;
}