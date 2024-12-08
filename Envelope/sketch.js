const FPS = 60;
let env;

let duration = 5;
let timeStamp = -(duration * 1000 + 1);
let t;
let axesLength = 400

let x0 = 150;
let y0 = 150;

let x1 = x0;
let y1 = y0 + axesLength;

let x2 = x0 + axesLength;
let y2 = y0;

let sliderNumberLines;

function setup(){
    createCanvas(windowWidth, windowHeight);
    frameRate(FPS);

    if(navigator.userAgent.match(/iPhone|iPad|iPod|Android|webOs|BlackBerry|Windows Phone/i))
        pixelDensity(1);

    env = new Envelope;
    createUI();
}

function draw(){
    background(220);
    translate(0, windowHeight);
    scale(1, -1);

    translate(50, 50)

    if(t >= duration)
        timeStamp = millis();

    t = (millis() - timeStamp) / 1000;

    displayAxes();
    env.display(sliderNumberLines.value());
    displayVectors();

}

function displayVectors(){
    push();
    strokeWeight(1);
    let xa = x1 + t * (x0 - x1) / duration;
    let ya = y1 + t * (y0 - y1) / duration;

    let xb = x0 + t * (x2 - x0) / duration;
    let yb = y0 + t * (y2 - y0) / duration;

    let xc = xa + t * (xb - xa) / duration;
    let yc = ya + t * (yb - ya) / duration;

    line(0, 0, xa, ya);
    createArrow(xa, ya, atan2(ya, xa));

    line(0, 0, xb, yb)
    createArrow(xb, yb, atan2(yb, xb));

    line(xa, ya, xb, yb);

    stroke(200, 0, 0)
    strokeWeight(5);
    point(xc, yc);
    pop()

}

function createArrow(x, y, a){
    push();

    translate(x - 2 * cos(a), y - 2 * sin(a));
    rotate(a);

    beginShape();
    noFill();

    vertex(-10, -5);
    vertex(0, 0);
    vertex(-10, 5);

    endShape();
    pop();
}

function displayAxes(){
    line(0, 0, 0, 600);
    line(0, 0, 600, 0);
}

function createUI(){
    sliderNumberLines = createSlider(0, 100, 0, 1);
    sliderNumberLines.position(15, 35);
    sliderNumberLines.style('width', 100);
}

class Envelope{

    display(nLines){

        push();
        stroke(0);
        strokeWeight(1);

        line(x0, y0, x1, y1);
        line(x0, y0, x2, y2);

        if(nLines === 0)
            return;

        let spacing = axesLength / (nLines + 1);

        for(let i = 0; i <= nLines; i++)
            line(x2 - spacing * i, y0, x0, y0 + spacing * i);

        pop();
    }
}