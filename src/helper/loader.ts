export function loadStyle(src: string) {
    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.href = src;
    document.head.append(style);
}