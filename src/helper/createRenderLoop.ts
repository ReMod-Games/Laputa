import { Scene, Engine } from "https://esm.sh/@babylonjs/core@5.0.0-alpha.42";

export function createRenderLoop(engine: Engine, scene: Scene) {
    engine.runRenderLoop(() => scene.render());
    addEventListener("resize", () => engine.resize());
}