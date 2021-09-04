import { WebGPUEngine, Scene } from "https://esm.sh/@babylonjs/core@5.0.0-alpha.42";

export function createRenderLoop(engine: WebGPUEngine, scene: Scene) {
    engine.runRenderLoop(() => scene.render());
    addEventListener("resize", () => engine.resize());
}