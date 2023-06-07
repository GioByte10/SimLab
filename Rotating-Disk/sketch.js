let n = -0.0000000012;
let s = 0.00000115;
let j = -0.00047;
let a = 0.1;
let w = -10;
let angle = 0;

let r;

function setup() {
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
    frameRate(60);
    pixelDensity(1);
    noFill();

    if(navigator.userAgent.match(/iPhone|iPod|Android|BlackBerry|Windows Phone/i))
        pixelDensity(1);

    r = min(width, height) / 2;
}

function draw() {
    background(220);

    translate(width/2, height/2);
    rotate(-angle);
    circle(0, 0, r);
    arc(0, 0, 20, 20, 90, 270)

    strokeWeight(3);
    point(0, 0);

    strokeWeight(1);
    line(0, 10, r / 2, 10);
    line(0, -10, r / 2, -10);

    s += n;
    j += s;
    a += j;
    w += a;
    angle += w;
}