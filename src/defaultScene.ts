import { HemisphericLight, Vector3, MeshBuilder, Scene, StandardMaterial, Color3, ActionManager, ExecuteCodeAction, Scalar, FollowCamera, Mesh, VertexData } from "https://esm.sh/@babylonjs/core@5.0.0-alpha.42";
import { MovementControls } from "./consts/MovementControls.ts";

function createPlayerMovement(scene: Scene) {

    const state = {
        inputs: new Map<MovementControls, boolean>(),
        vertical: 0,
        verticalAxis: 0,
        horizontal: 0,
        horizontalAxis: 0,
    }

    const accelerationR = 0.04;
    const speedR = 0.5;

    const acceleration = 0.05;
    const speed = 0.05;
    scene.actionManager = new ActionManager(scene);

    scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, (evt) => {
        state.inputs.set(evt.sourceEvent.key, evt.sourceEvent.type === "keydown");
    }));
    scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, (evt) => {
        state.inputs.set(evt.sourceEvent.key, evt.sourceEvent.type === "keydown");
    }));

    scene.onBeforeRenderObservable.add(() => {
        if (state.inputs.get(MovementControls.Forward)) {
            state.vertical = Scalar.Lerp(state.vertical, speed, acceleration);
            state.verticalAxis = 1;

        } else if (state.inputs.get(MovementControls.Back)) {
            state.vertical = Scalar.Lerp(state.vertical, -speed, acceleration);
            state.verticalAxis = -1;
        } else {
            state.vertical = 0;
            state.verticalAxis = 0;
        }

        if (state.inputs.get(MovementControls.Left)) {
            state.horizontal = Scalar.Lerp(state.horizontal, -speedR, accelerationR);
            state.horizontalAxis = -1;

        } else if (state.inputs.get(MovementControls.Right)) {
            state.horizontal = Scalar.Lerp(state.horizontal, speedR, accelerationR);
            state.horizontalAxis = 1;
        }
        else {
            state.horizontal = 0;
            state.horizontalAxis = 0;
        }
    });
    return {
        state
    }
}

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

function createMesh(customMesh: Mesh) {
    const positions = [ -5, 2, -3, -7, -2, -3, -3, -2, -3, 5, 2, 3, 7, -2, 3, 3, -2, 3 ];
    const indices = [ 0, 1, 2, 3, 4, 5 ];

    //Empty array to contain calculated values or normals added
    const normals: number[] = [];

    //Calculations of normals added
    VertexData.ComputeNormals(positions, indices, normals);

    const vertexData = new VertexData();

    vertexData.positions = positions;
    vertexData.indices = indices;
    vertexData.normals = normals; //Assignment of normal to vertexData added

    vertexData.applyToMesh(customMesh);
}
