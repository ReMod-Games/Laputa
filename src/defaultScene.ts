import { HemisphericLight, Vector3, MeshBuilder, Scene, StandardMaterial, Color3, Scalar, FollowCamera } from "https://esm.sh/@babylonjs/core@5.0.0-alpha.42";
import { MovementControls } from "./consts/MovementControls.ts";
import { createPlayerMovement } from "./helper/createPlayerMovement.ts";

export function defaultScene(scene: Scene, _canvas: HTMLCanvasElement) {
    const camera = new FollowCamera("camera", new Vector3(0, 0, 0), scene);
    camera.attachControl(true);
    camera.radius = 10;
    camera.speed = 0;
    camera.heightOffset = 20;
    camera.upperHeightOffsetLimit = 20
    camera.lowerHeightOffsetLimit = 10

    //Acceleration of camera in moving from current to goal position
    camera.cameraAcceleration = 0.1
    //The speed at which acceleration is halted
    camera.maxCameraSpeed = 3

    new HemisphericLight("light", new Vector3(0, 1, 0), scene);

    const ground = MeshBuilder.CreateGround("ground", { width: 10, height: 10 })
    const groundMat = new StandardMaterial("bawl", scene);

    groundMat.diffuseColor = new Color3(.9, .6, 0);
    ground.material = groundMat;
    groundMat.backFaceCulling = false;

    // const customMesh = new Mesh("custom", scene);
    // customMesh.material = groundMat;
    // createMesh(customMesh);

    const cube = MeshBuilder.CreateTiledBox("box", { depth: 5 }, scene);
    cube.movePOV(0, 1, 0)

    const input = createPlayerMovement(scene);

    const playerHitbox = MeshBuilder.CreateLines("playerHitbox", { points: [] }, scene);
    playerHitbox.movePOV(0, 2, 0)
    playerHitbox.outlineWidth = 1
    playerHitbox.outlineColor = Color3.Black()

    camera.lockedTarget = playerHitbox;
    let step = 0
    scene.onBeforeRenderObservable.add(() => {
        const right = input.state.inputs.get(MovementControls.Right);
        const left = input.state.inputs.get(MovementControls.Left);
        const back = input.state.inputs.get(MovementControls.Back);
        const forward = input.state.inputs.get(MovementControls.Forward);

        // console.log(cube.rotation.y, input.horizontal, input.vertical)
        playerHitbox.position.copyFrom(cube.position);
        const fullcycle = Math.PI * 2;
        const rotDenormal = parseFloat(((Scalar.Denormalize(cube.rotation.y / fullcycle, -1, 1)) * 100).toPrecision(2)) / 100;
        if ((back && left) || (right && back)) return;
        if (back || step == 2) {
            step = 2
            cube.rotatePOV(0, (Scalar.DeltaAngle(rotDenormal, rotDenormal > 0 ? 1 : -1) / 4) * 2, 0)
        }
        if (right || step == 1) {
            step = 1
            cube.rotatePOV(0, (Scalar.DeltaAngle(rotDenormal, 0.5) / 4) * 2, 0)
        }
        if (left || step == 3) {
            step = 3
            cube.rotatePOV(0, (Scalar.DeltaAngle(rotDenormal, -0.5) / 4) * 2, 0)
        }
        if (forward || step == 0) {
            step = 0
            cube.rotatePOV(0, (Scalar.DeltaAngle(rotDenormal, 0) / 4) * 2, 0)
        }
    });
}
