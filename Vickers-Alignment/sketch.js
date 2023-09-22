let fps = 30;
let bg;
let variation;

let knobs = [];

let focus;
let focusKnob;
let measuringKnob;
let baseKnob;

let inputButton;
let vertical = true;
let done = false;

let filarBounds = [[-250, -227, 0, 25], [-185, -150, 55, 96]];


function preload(){
    bg = loadImage('images/sample.png');
}
function setup(){
    createCanvas(windowWidth, windowHeight);
    frameRate(fps);
    textAlign(CENTER);
    textSize(16);

    angleMode(DEGREES);
    fill(192);

    focusKnob = new Knob(windowWidth * 1.2 / 10, windowHeight * 2 / 10, windowWidth / 20,
        -360, 360, 0, 12);
    baseKnob = new Knob(windowWidth * 1.2 / 10, windowHeight * 8 / 10, windowWidth / 20,
        -2 * 360, 2 * 360, random(-1.8 * 360, 0), 12)
    measuringKnob = new Knob(windowWidth * 9 / 10, windowHeight * 8 / 10, windowWidth / 20,
        baseKnob.theta0, 4 * 360 + baseKnob.theta0, random(baseKnob.theta0, 1.7 * 360), 12)

    knobs.push(focusKnob);
    knobs.push(measuringKnob);
    knobs.push(baseKnob);

    focus = random(focusKnob.lowerTheta, focusKnob.upperTheta);
    inputButton = new Button(windowWidth * 8 / 10, windowHeight * 8 / 10, 40, 40, checkVerticalFilars);
    variation = random(-1.5, 1.5);
}
function draw(){
    background(0);

    blur();
    drawFilars();
    inputButton.display();

    for(let i = 0; i < knobs.length; i++)
        knobs[i].display();

    staticSetup();
    logs();
}

function staticSetup(){
    textSize(16);
    text('Focus', focusKnob.x, focusKnob.y + focusKnob.r * 1.4);
    text('Base', baseKnob.x, baseKnob.y + baseKnob.r * 1.4);
    text('Measuring', measuringKnob.x, measuringKnob.y + measuringKnob.r * 1.4);

    text('Input', inputButton.x, measuringKnob.y + measuringKnob.r * 1.4);

    textSize(36);
    if(done)
        text(str((206.9 + variation).toFixed(1)) + '  HV0.5', windowWidth * 8.8 / 10, windowHeight * 5 / 10);

}
function blur(){
    push();
    drawingContext.filter = 'blur(' + str(abs(focusKnob.theta - focus)) / 30 + 'px)';
    image(bg, (windowWidth - bg.width) / 2, (windowHeight - bg.height) / 2, bg.width, bg.height);
    pop();
}
function drawFilars(){

    push();
    translate(windowWidth / 2, windowHeight / 2);

    if(!vertical)
        rotate(-90);

    strokeWeight(0.9);
    line(baseKnob.theta * bg.width * (795 / 1280) / (baseKnob.upperTheta - baseKnob.lowerTheta), -windowHeight / 2,
        baseKnob.theta * bg.width * (795 / 1280) / (baseKnob.upperTheta - baseKnob.lowerTheta), windowHeight / 2);

    line((measuringKnob.theta + baseKnob.theta - baseKnob.theta0) * bg.width * (795 / 1280) / (measuringKnob.upperTheta - measuringKnob.lowerTheta), -windowHeight / 2,
        (measuringKnob.theta + baseKnob.theta - baseKnob.theta0) * bg.width * (795 / 1280) / (measuringKnob.upperTheta - measuringKnob.lowerTheta), windowHeight / 2);

    strokeWeight(1.4);
    line(baseKnob.theta * bg.width * (795 / 1280) / (baseKnob.upperTheta - baseKnob.lowerTheta), 250 / 1280 * bg.width - windowHeight / 2,
        baseKnob.theta * bg.width * (795 / 1280) / (baseKnob.upperTheta - baseKnob.lowerTheta) - 97 / 1280 * bg.width, 250 / 1280 * bg.width - windowHeight / 2);

    line(baseKnob.theta * bg.width * (795 / 1280) / (baseKnob.upperTheta - baseKnob.lowerTheta), 380 / 1280 * bg.width -windowHeight / 2,
        baseKnob.theta * bg.width * (795 / 1280) / (baseKnob.upperTheta - baseKnob.lowerTheta) - 160 / 1280 * bg.width, 380 / 1280 * bg.width -windowHeight / 2);

    line(baseKnob.theta * bg.width * (795 / 1280) / (baseKnob.upperTheta - baseKnob.lowerTheta), 510 / 1280 * bg.width -windowHeight / 2,
        baseKnob.theta * bg.width * (795 / 1280) / (baseKnob.upperTheta - baseKnob.lowerTheta) - 97 / 1280 * bg.width, 510 / 1280 * bg.width -windowHeight / 2);

    pop();

}
function checkVerticalFilars(){
    if(baseKnob.theta > filarBounds[0][0] && baseKnob.theta < filarBounds[0][1] && measuringKnob.theta + baseKnob.theta - baseKnob.theta0 > filarBounds[0][2] && measuringKnob.theta + baseKnob.theta - baseKnob.theta0 < filarBounds[0][3]) {
        inputButton.setCallback(checkHorizontalFilars);
        vertical = false;
    }
    else
        text("Please align filars", windowWidth * 9 / 10, windowHeight * 6 / 10);

}
function checkHorizontalFilars(){
    if(baseKnob.theta > filarBounds[1][0] && baseKnob.theta < filarBounds[1][1] && measuringKnob.theta + baseKnob.theta - baseKnob.theta0 > filarBounds[1][2] && measuringKnob.theta + baseKnob.theta - baseKnob.theta0 < filarBounds[1][3]) {
        inputButton.setCallback(noCallback);
        done = true;
    }else
        text("Please align filars", windowWidth * 9 / 10, windowHeight * 6 / 10);

}
class Knob{
    constructor(x, y, r, lowerTheta, upperTheta, theta0, sides){
        this.x = x;
        this.y = y;
        this.r = r;

        this.lowerTheta = lowerTheta;
        this.upperTheta = upperTheta;
        this.theta = theta0;
        this.theta0 = theta0;

        this.sides = sides;

        this.previousPosition = createVector(0, -this.r);
        this.currentPosition = createVector(0, -this.r);
    }

    display(){
        let dtheta = 0;

        if(mouseIsPressed && dist(mouseX, mouseY, this.x, this.y) < this.r) {
            this.previousPosition = this.currentPosition;
            this.currentPosition = createVector(this.x - mouseX, mouseY - this.y);
            dtheta = this.currentPosition.angleBetween(this.previousPosition);

        }else{
            this.currentPosition = createVector(this.x - mouseX, mouseY - this.y);
            this.previousPosition = this.currentPosition;
        }

        push();
        translate(this.x, this.y);
        this.theta -= dtheta;
        this.theta = constrain(this.theta, this.lowerTheta, this.upperTheta);
        rotate(-this.theta);

        linearGradient(-this.r * cos(45 + this.theta), -this.r * sin(45 + this.theta), this.r * cos(45 + this.theta), this.r * sin(45 + this.theta), color(230), color(60));
        strokeWeight(6);
        polygon(0, 0, this.r, this.sides);

        stroke(0);
        strokeWeight(3);
        fill(0);
        line(0, -this.r / 1.8, 0, (-1.5 / 2) * this.r);
        pop();
    }
}
class Button {
    constructor(x, y, w, h, callback) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h
        this.callback = callback;
    }

    display() {
        if (mouseIsPressed && mouseX > this.x - this.w / 2 && mouseX < this.x + this.w / 2 && mouseY > this.y - this.h / 2 && mouseY < this.y + this.h / 2) {
            push();
            noStroke();
            //stroke(192);
            rect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
            fill(128);
            rect(this.x - this.w / 2 - 2, this.y - this.h / 2, 2.2, this.h);
            rect(this.x - this.w / 2 - 2, this.y - this.h / 2, this.w + 2, 2);

            fill(223);
            rect(this.x + this.w / 2, this.y - this.h / 2, 2, this.h + 2);
            rect(this.x - this.w / 2 - 2, this.y + this.h / 2, this.w + 3, 2);

            fill(60);
            rect(this.x - this.w / 2 - 4, this.y - this.h / 2, 2.2, this.h + 2);
            rect(this.x - this.w / 2 - 4, this.y - this.h / 2 - 2, this.w + 6, 2.2);

            fill(255);
            rect(this.x + this.w / 2 + 2, this.y - this.h / 2 - 2, 2, this.h + 6);
            rect(this.x - this.w / 2 - 4, this.y + this.h / 2 + 2, this.w + 7, 2);
            this.callback();
            pop();

        } else {
            push();
            noStroke();
            //stroke(192);
            rect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
            fill(223);
            rect(this.x - this.w / 2 - 2, this.y - this.h / 2, 2.2, this.h);
            rect(this.x - this.w / 2 - 2, this.y - this.h / 2, this.w + 2, 2);

            fill(128);
            rect(this.x + this.w / 2, this.y - this.h / 2, 2, this.h + 2);
            rect(this.x - this.w / 2 - 2, this.y + this.h / 2, this.w + 3, 2);

            fill(255);
            rect(this.x - this.w / 2 - 4, this.y - this.h / 2, 2.2, this.h + 2);
            rect(this.x - this.w / 2 - 4, this.y - this.h / 2 - 2, this.w + 6, 2.2);

            fill(60);
            rect(this.x + this.w / 2 + 2, this.y - this.h / 2 - 2, 2, this.h + 6);
            rect(this.x - this.w / 2 - 4, this.y + this.h / 2 + 2, this.w + 7, 2);
            pop();
        }
    }
    setCallback(callback) {
        this.callback = callback;
    }
}
function noCallback(){}
function polygon(x, y, radius, sides) {
    if(sides !== 0) {
        let angle = 360 / sides;
        beginShape();
        for (let a = 0; a < 360; a += angle) {
            let sx = x + cos(a) * radius;
            let sy = y + sin(a) * radius;
            vertex(sx, sy);
        }
        endShape(CLOSE);

    }else{
        circle(x, y, radius * 2);
    }
}
function linearGradient(x0, y0, x1, y1, color0, colorE){
    let gradient = drawingContext.createLinearGradient(
        x0, y0, x1, y1,
    );
    gradient.addColorStop(0, color0);
    gradient.addColorStop(1, colorE);

    drawingContext.strokeStyle = gradient;
}
function logs(){
    if(keyIsDown(68)){
        text(baseKnob.theta, 50, 30);
        text(measuringKnob.theta + baseKnob.theta - baseKnob.theta0, 50, 50);
    }
}