import { HemisphericLight, Vector3, MeshBuilder, Scene, StandardMaterial, Color3, ActionManager, ExecuteCodeAction, Scalar, FollowCamera, MotionBlurPostProcess, Mesh, VertexData, Viewport, Space } from "https://esm.sh/@babylonjs/core@5.0.0-alpha.42";
import { GrassProceduralTexture } from "https://esm.sh/@babylonjs/procedural-textures@5.0.0-alpha.42";
class PlayerInput {
    inputMap: Map<KeyboardEvent[ "key" ], boolean>;
    vertical = 0;
    verticalAxis = 0;
    horizontal = 0;
    horizontalAxis = 0;

    constructor(scene: Scene) {
        scene.actionManager = new ActionManager(scene);

        this.inputMap = new Map<string, boolean>();
        scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, (evt) => {
            this.inputMap.set(evt.sourceEvent.key, evt.sourceEvent.type === "keydown");
        }));
        scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, (evt) => {
            this.inputMap.set(evt.sourceEvent.key, evt.sourceEvent.type === "keydown");
        }));

        scene.onBeforeRenderObservable.add(() => {
            this._updateFromKeyboard();
        });
    }

    private _updateFromKeyboard(): void {
        const moveStart = 0.05;

        if (this.inputMap.get("ArrowUp") || this.inputMap.get("w")) {
            this.vertical = Scalar.Lerp(this.vertical, .5, moveStart);
            this.verticalAxis = 1;

        } else if (this.inputMap.get("ArrowDown") || this.inputMap.get("s")) {
            this.vertical = Scalar.Lerp(this.vertical, -.5, moveStart);
            this.verticalAxis = -1;
        } else {
            this.vertical = 0;
            this.verticalAxis = 0;
        }

        if (this.inputMap.get("ArrowLeft") || this.inputMap.get("a")) {
            this.horizontal = Scalar.Lerp(this.horizontal, -.5, moveStart);
            this.horizontalAxis = -1;

        } else if (this.inputMap.get("ArrowRight") || this.inputMap.get("d")) {
            this.horizontal = Scalar.Lerp(this.horizontal, .5, moveStart);
            this.horizontalAxis = 1;
        }
        else {
            this.horizontal = 0;
            this.horizontalAxis = 0;
        }
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


    const customMesh = new Mesh("custom", scene);

    createMesh(customMesh);

    const cube = MeshBuilder.CreateBox("box", {}, scene);
    cube.movePOV(0, 1, 0)
    const input = new PlayerInput(scene);
    camera.lockedTarget = cube;
    scene.onBeforeRenderObservable.add(() => {
        cube.movePOV(input.horizontalAxis, 0, input.verticalAxis);
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
