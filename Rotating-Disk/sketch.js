let n = -0.0000000012;
let s = 0.00000115;
let j = -0.00047;
let a = 0.1;
let w = -10;
let angle = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
    frameRate(60);
    pixelDensity(1);
    noFill();
}

function draw() {
    background(220);

    translate(width/2, height/2);
    rotate(-angle);
    circle(0, 0, width / 3 - 60);
    arc(0, 0, 20, 20, 90, 270)

    strokeWeight(3);
    point(0, 0);

    strokeWeight(1);
    line(0, 10, (width / 3 - 60) / 2, 10);
    line(0, -10, (width / 3 - 60) / 2, -10);

    s += n;
    j += s;
    a += j;
    w += a;
    angle += w;
}