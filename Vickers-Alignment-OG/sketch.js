let fps = 60;
let bg;
let variation;

let knobs = [];

let focus;
let focusKnob;
let measuringKnob;
let baseKnob;
let lensKnob;

let inputButton;
let vertical = true;
let done = false;

let filarBounds = [[-250, -227, 0, 25], [-185, -150, 55, 96]];

let imageHeight;
let imageWidth;

let videoBack = false;
let videoForward = false;
let prevMouse = false;

function preload(){
    bg = loadImage('images/sample.png');
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
    imageHeight = windowHeight;
    imageWidth = imageHeight * (1280 / 720);

    focusKnob.x = windowWidth / 10;
    focusKnob.y = windowHeight * 2 / 10;
    focusKnob.r = windowWidth / 20;

    baseKnob.x = windowWidth / 10;
    baseKnob.y = windowHeight * 8 / 10;
    baseKnob.r = windowWidth / 20;

    measuringKnob.x = windowWidth * 9 / 10;
    measuringKnob.y = windowHeight * 8 / 10;
    measuringKnob.r = windowWidth / 20;

    lensKnob.x = windowWidth / 2;
    lensKnob.y = windowHeight / 2;
    lensKnob.r = 790 / 1280 * imageWidth / 2;

    inputButton.x = windowWidth * 9 / 10;
    inputButton.y = windowHeight * 5.5 / 10;

}
function setup(){
    createCanvas(windowWidth, windowHeight);
    frameRate(fps);
    textAlign(CENTER);
    textSize(16);

    angleMode(DEGREES);
    fill(192);

    imageHeight = windowHeight;
    imageWidth = imageHeight * (1280 / 720);

    focusKnob = new Knob(windowWidth / 10, windowHeight * 2 / 10, windowWidth / 20,
        -360, 360, 0, 12, 6);
    baseKnob = new Knob(windowWidth / 10, windowHeight * 8 / 10, windowWidth / 20,
        -2 * 360, 2 * 360, random(-1.8 * 360, 0), 12, 6)
    measuringKnob = new Knob(windowWidth * 9 / 10, windowHeight * 8 / 10, windowWidth / 20,
        baseKnob.theta0, 4 * 360 + baseKnob.theta0, random(baseKnob.theta0, 1.7 * 360), 12, 6)
    lensKnob = new Knob(windowWidth / 2, windowHeight / 2, 790 / 1280 * imageWidth / 2,
        -180, -90, -180, 0, 20, 0, -1);

    knobs.push(focusKnob);
    knobs.push(measuringKnob);
    knobs.push(baseKnob);
    knobs.push(lensKnob);

    focus = random(focusKnob.lowerTheta, focusKnob.upperTheta);
    inputButton = new Button(windowWidth * 9 / 10, windowHeight * 5.5 / 10, 40, 40, checkVerticalFilars);
    variation = random(-1.5, 1.5);
}
function draw(){
    background(0);

    blur();
    drawFilars();
    inputButton.display();

    for(let i = 0; i < knobs.length; i++)
        knobs[i].display();

    lensOuterKnob();
    staticSetup();
    logs();
    prevMouse = mouseIsPressed;

}
function staticSetup(){
    textSize(16);
    text('Focus', focusKnob.x, focusKnob.y + focusKnob.r * 1.4);
    text('Base', baseKnob.x, baseKnob.y + baseKnob.r * 1.4);
    text('Measuring', measuringKnob.x, measuringKnob.y + measuringKnob.r * 1.4);

    text('Input', inputButton.x, inputButton.y + inputButton.w * 1.2);

    if(!vertical)
        text('Vertical input recorded', windowWidth * 9 / 10, windowHeight * 5.3 / 10);

    textSize(30);
    if(done)
        text(str((206.9 + variation).toFixed(1)) + '  HV0.5', windowWidth * 8.8 / 10, windowHeight * 3 / 10);

}
function lensOuterKnob(){
    push();
    stroke(100);
    strokeWeight(2);
    translate(windowWidth / 2, windowHeight / 2);
    rotate(-lensKnob.theta + 180);

    let l = 72;

    for(let i = 0; i < l; i++)
        line((lensKnob.r - 9) * cos(360 * i / l), (lensKnob.r - 9) * sin(360 * i / l), (lensKnob.r + 8) * cos(360 * i / l), (lensKnob.r + 8) * sin(360 * i / l));

    noFill();
    circle(0, 0, lensKnob.r * 2 + 18);
    circle(0, 0, lensKnob.r * 2 - 20);
    pop();
}
function blur(){
    push();
    drawingContext.filter = 'blur(' + str(abs(focusKnob.theta - focus)) / 30 + 'px)';
    image(bg, (windowWidth - imageWidth) / 2, (windowHeight - imageHeight) / 2, imageWidth, imageHeight);
    pop();
}
function drawFilars(){

    push();
    translate(windowWidth / 2, windowHeight / 2);

    if(!vertical)
        rotate(-lensKnob.theta + 180);

    strokeWeight(0.9);
    line(baseKnob.theta * imageWidth * (795 / 1280) / (baseKnob.upperTheta - baseKnob.lowerTheta), -imageWidth * (795 / 1280) / 2,
        baseKnob.theta * imageWidth * (795 / 1280) / (baseKnob.upperTheta - baseKnob.lowerTheta), imageWidth * (795 / 1280) / 2);

    line((measuringKnob.theta + baseKnob.theta - baseKnob.theta0) * imageWidth * (795 / 1280) / (measuringKnob.upperTheta - measuringKnob.lowerTheta), -imageWidth * (795 / 1280) / 2,
        (measuringKnob.theta + baseKnob.theta - baseKnob.theta0) * imageWidth * (795 / 1280) / (measuringKnob.upperTheta - measuringKnob.lowerTheta), imageWidth * (795 / 1280) / 2);

    strokeWeight(1.4);
    line(baseKnob.theta * imageWidth * (795 / 1280) / (baseKnob.upperTheta - baseKnob.lowerTheta), 250 / 1280 * imageWidth - windowHeight / 2,
        baseKnob.theta * imageWidth * (795 / 1280) / (baseKnob.upperTheta - baseKnob.lowerTheta) - 97 / 1280 * imageWidth, 250 / 1280 * imageWidth - windowHeight / 2);

    line(baseKnob.theta * imageWidth * (795 / 1280) / (baseKnob.upperTheta - baseKnob.lowerTheta), 380 / 1280 * imageWidth -windowHeight / 2,
        baseKnob.theta * imageWidth * (795 / 1280) / (baseKnob.upperTheta - baseKnob.lowerTheta) - 160 / 1280 * imageWidth, 380 / 1280 * imageWidth -windowHeight / 2);

    line(baseKnob.theta * imageWidth * (795 / 1280) / (baseKnob.upperTheta - baseKnob.lowerTheta), 510 / 1280 * imageWidth -windowHeight / 2,
        baseKnob.theta * imageWidth * (795 / 1280) / (baseKnob.upperTheta - baseKnob.lowerTheta) - 97 / 1280 * imageWidth, 510 / 1280 * imageWidth -windowHeight / 2);

    pop();

}
function checkVerticalFilars(){
    if(baseKnob.theta > filarBounds[0][0] && baseKnob.theta < filarBounds[0][1] && measuringKnob.theta + baseKnob.theta - baseKnob.theta0 > filarBounds[0][2] && measuringKnob.theta + baseKnob.theta - baseKnob.theta0 < filarBounds[0][3]) {
        inputButton.setCallback(checkHorizontalFilars);
        vertical = false;
        lensKnob.theta = -180;
    }
    else {
        textSize(16);
        text("Please align filars", windowWidth * 9 / 10, windowHeight * 6 / 10);
    }

}
function checkHorizontalFilars(){
    if(baseKnob.theta > filarBounds[1][0] && baseKnob.theta < filarBounds[1][1] && measuringKnob.theta + baseKnob.theta - baseKnob.theta0 > filarBounds[1][2] && measuringKnob.theta + baseKnob.theta - baseKnob.theta0 < filarBounds[1][3] && lensKnob.theta > -95) {
        inputButton.setCallback(noCallback);
        done = true;
    }else {
        textSize(16);
        text("Please align filars", windowWidth * 9 / 10, windowHeight * 6 / 10);
    }

}
function noCallback(){}
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
        textSize(16);
        text(baseKnob.theta.toFixed(2), 100, 100);
        text((measuringKnob.theta + baseKnob.theta - baseKnob.theta0).toFixed(2), 100, 100);
    }
}
function keyPressed(){
    if(keyCode === LEFT_ARROW){
        videoBack = true;
    }else if(keyCode === RIGHT_ARROW){
        videoForward = true;
    }
}
function mouseWheel(event) {
    for(let i = 0; i < knobs.length; i++)
        if((dist(mouseX, mouseY, knobs[i].x, knobs[i].y) < knobs[i].r))
            knobs[i].display(event.delta / 2);
}
class Knob{
    constructor(x, y, r, lowerTheta, upperTheta, theta0, sides, strokeWeight, stroke = -1, fill = 192){
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

        this.strokeWeight = strokeWeight;
        this.stroke = stroke;
        this.fill = fill;

        this.stillPressed = false;
    }

    display(dtheta = 0){
        if(dtheta === 0) {
            if (!prevMouse  && mouseIsPressed && dist(mouseX, mouseY, this.x, this.y) < this.r)
                this.stillPressed = true;

            else if (!mouseIsPressed)
                this.stillPressed = false;

            if (this.stillPressed) {
                this.previousPosition = this.currentPosition;
                this.currentPosition = createVector(this.x - mouseX, mouseY - this.y);
                dtheta = this.currentPosition.angleBetween(this.previousPosition);

            } else {
                this.currentPosition = createVector(this.x - mouseX, mouseY - this.y);
                this.previousPosition = this.currentPosition;
            }
        }

        push();
        translate(this.x, this.y);
        this.theta -= dtheta;
        this.theta = constrain(this.theta, this.lowerTheta, this.upperTheta);
        rotate(-this.theta);

        this.stroke >= 0 ? stroke(this.stroke) : linearGradient(-this.r * cos(45 + this.theta), -this.r * sin(45 + this.theta), this.r * cos(45 + this.theta), this.r * sin(45 + this.theta), color(230), color(60));
        this.fill >= 0 ? fill(this.fill) : noFill();
        strokeWeight(this.strokeWeight);
        this.polygon();

        if(this.fill >= 0) {
            stroke(0);
            strokeWeight(3);
            fill(0);
            line(0, -this.r / 1.8, 0, (-1.5 / 2) * this.r);
        }
        pop();
    }
    polygon() {
        if(this.sides !== 0) {
            let angle = 360 / this.sides;
            beginShape();
            for (let a = 0; a < 360; a += angle) {
                let sx = cos(a) * this.r;
                let sy = sin(a) * this.r;
                vertex(sx, sy);
            }
            endShape(CLOSE);
        }else{
            circle(0, 0, this.r * 2);
        }
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
            //console.log(str(this.x) + ' ' + str(this.w) + ' ' + str(this.y) + ' ' + str(this.h));
            pop();
        }
    }
    setCallback(callback) {
        this.callback = callback;
    }
}