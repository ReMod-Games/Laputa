import { ArcRotateCamera, HemisphericLight, Vector3, MeshBuilder, Scene } from "https://esm.sh/@babylonjs/core@5.0.0-alpha.42";

export function defaultScene(scene: Scene, canvas: HTMLCanvasElement) {
    const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);
    new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    MeshBuilder.CreateBox("box", {}, scene);
}
