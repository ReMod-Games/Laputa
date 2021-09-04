export function createPerfectCanvas() {
    const canvas = document.createElement("canvas");
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
    document.body.append(canvas);
    return canvas;
}
