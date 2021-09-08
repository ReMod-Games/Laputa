import { Scene, ActionManager, ExecuteCodeAction, Scalar } from "https://esm.sh/@babylonjs/core@5.0.0-alpha.42";
import { MovementControls } from "../consts/MovementControls.ts";

export function createPlayerMovement(scene: Scene) {

    const state = {
        inputs: new Map<MovementControls, boolean>(),
        vertical: 0,
        verticalAxis: 0,
        horizontal: 0,
        horizontalAxis: 0,
    };

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
    };
}
