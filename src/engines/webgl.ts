import { Engine } from "https://esm.sh/@babylonjs/core@5.0.0-alpha.42";

export default function (canvas: HTMLCanvasElement) {
    const engine = new Engine(canvas)
    return engine;
}