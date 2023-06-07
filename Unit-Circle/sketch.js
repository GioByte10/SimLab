let w = 1;
let angle = 0;

let r = 400;
let lineOffset = 50;
let l = 500;
let m;

let sinArray = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
    frameRate(60);

    if(navigator.userAgent.match(/iPhone|iPod|Android|BlackBerry|Windows Phone/i))
        pixelDensity(1);

    m = min(width, height);
    background(220);
    textSize(18);

}

function draw() {

    background(220);
    if(m === height)
        translate(width/2 - 270, height/2);
    else
        translate(width/2, height/2 + 175);
    strokeWeight(2);

    push();
    rotate(-angle);
    fill(220);
    circle(0, 0, r);
    line(0, 0, r / 2, 0);
    pop();

    text(floor(angle).toString() + '°', -210, 210);

    if(m === width)
        rotate(-90);

    line(r/2 + lineOffset, -r/2, r/2 + lineOffset, r/2);
    line(r/2 + lineOffset, 0, 3/2 * r + lineOffset + 160, 0);

    strokeWeight(12);
    point(r/2 + lineOffset, r/2 * sin(-angle));
    point(0, 0);

    textAlign(CENTER);
    strokeWeight(4);

    for(let i = 0; i < sinArray.length; i++)
        point(r/2 + lineOffset + i, sinArray[i] * r /2);

    push();
    strokeWeight(2);
    setLineDash([7, 7]);
    line(cos(angle) * r/2, -sin(angle) * r/2, r/2 + lineOffset, -sin(angle) * r/2)
    pop();

    angle += w;
    angle %= 360

    sinArray.unshift(sin(-angle));

    if(sinArray.length > l)
        sinArray.pop();

}

function setLineDash(list) {
    drawingContext.setLineDash(list);
}