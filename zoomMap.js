// Canvas and Context
let canvas = null;
let context = null;

// Canvas positioning
let canvasX = 0;
let canvasY = 0;
let canvasMaxX = 0;
let canvasMaxY = 0;

// Scaling
let canvasScale = 1;
let minScale = 1;
let maxScale = 5;

// Image properties
let canvasImage = new Image();
let canvasImageX = 0;
let canvasImageY = 0;

// Mouse properties
let mouseDown = 0;
let mouseDx = 0;
let mouseDy = 0;

function clamp(v, min, max) {
    return Math.min(Math.max(v, min), max);
}

function lerp(a, b, t) {
    return (1 - t) * a + (t * b);
}

function updateCanvasSize() {
    canvasX = canvas.getBoundingClientRect().x;
    canvasY = canvas.getBoundingClientRect().y;
    if (canvasImage.width > canvasImage.height) {
        minScale = canvas.width / canvasImage.width;
    } else {
        minScale = canvas.height / canvasImage.height;
    }
}

function updateMousePosition(event) {
    event = event || window.event;
    mouseDx = event.offsetX;
    mouseDy = event.offsetY;
}

function getScrollFactor(event) {
    event = event || window.event;
    let delta = 1 + event.deltaY * 0.033333333;
    canvasScale /= delta;
    canvasScale = clamp(canvasScale, minScale, maxScale);
    canvasMaxX = -(canvasImage.width - canvas.width / canvasScale);
    canvasMaxY = -(canvasImage.height - canvas.height / canvasScale);
}

function clampImage() {
    canvasImageX = clamp(canvasImageX, canvasMaxX, 0);
    canvasImageY = clamp(canvasImageY, canvasMaxY, 0);
}

function moveImage() {
    canvasImageX += mouseDx;
    canvasImageY += mouseDy;
    clampImage();
}

function draw() {
    if (mouseDown == 1) moveImage();
    let transform = context.getTransform();
    context.setTransform(
        lerp(transform.a, canvasScale, 0.1),
        0,
        0,
        lerp(transform.d, canvasScale, 0.1),
        0,
        0
    );
    clampImage();
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(canvasImage, canvasImageX, canvasImageY);
    window.requestAnimationFrame(draw);
}

function init() {
    canvas = document.getElementById('tilemap');
    updateCanvasSize();
    let size = Math.min(canvas.width, canvas.height);
    let aspectRatio = window.innerWidth / window.innerHeight;
    canvas.width = size * aspectRatio * 5;
    canvas.height = size * aspectRatio * 5;
    context = canvas.getContext('2d');
    canvas.addEventListener('mousemove', updateMousePosition);
    canvas.addEventListener('wheel', getScrollFactor);
    canvas.onmousedown = function () {
        mouseDown = 1;
    };
    canvas.onmouseup = function () {
        mouseDown = 0;
    };
    canvas.onmouseleave = function () {
        mouseDown = 0;
    };
    updateCanvasSize();
    canvasScale = minScale;
    window.requestAnimationFrame(draw);
}

canvasImage.src = 'map.svg';
window.onresize = updateCanvasSize;
window.onload = init;
