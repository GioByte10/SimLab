const FPS = 60;
let variation;

let knobs = [];
let focus;
let focusKnob;
let measuringKnob;
let baseKnob;
let lensKnob;

let inputButton;
let done = false;

let filarBounds = [-395, -214, 231, 430];

let bgHeight;
let bgWidth;

let videoBack = false;
let videoForward = false;
let prevMouse = false;

let matchHeight;

let lensRadius = 135;
let focusRadius = 70;
let measuringRadius = 50;
let baseRadius = 35;
let bg;
let sample;

let k = 0;
let data = {};
data["time"] = new Date()
data["time"].setHours(data["time"].getHours() - 8);
//data["time"].setSeconds(data["time"].getSeconds() + vickersTimestamps["test_steel"]);


function preload(){
    bg = loadImage('images/background_.jpg');
    sample = loadImage('images/sample_r_.png');
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);

    if(windowHeight / windowWidth > 2 / 3){
        matchHeight = true;
        bgHeight = windowHeight;
        bgWidth = bgHeight * (3 / 2);
    }else{
        matchHeight = false;
        bgWidth = windowWidth;
        bgHeight = bgWidth * (2 / 3);
    }

    focusKnob.x = windowWidth * 9 / 10;
    focusKnob.y = matchHeight ? 0.71 * bgHeight : 0.71 * bgHeight - (bgHeight - windowHeight) / 2;
    focusKnob.r = focusRadius;

    baseKnob.x = windowWidth * 1.5 / 10;
    baseKnob.y = matchHeight ? 0.185 * bgHeight : 0.185 * bgHeight - (bgHeight - windowHeight) / 2;
    baseKnob.r = baseRadius;

    measuringKnob.x = windowWidth * 9 / 10;
    measuringKnob.y = matchHeight ? 0.184 * bgHeight : 0.184 * bgHeight - (bgHeight - windowHeight) / 2;
    measuringKnob.r = measuringRadius;

    lensKnob.x = windowWidth / 2.1;
    lensKnob.y = matchHeight ? 0.65 * bgHeight : 0.65 * bgHeight - (bgHeight - windowHeight) / 2;
    lensKnob.r = lensRadius;

    inputButton.x = windowWidth * 7 / 10;
    inputButton.y = matchHeight ? 0.184 * bgHeight : 0.184 * bgHeight - (bgHeight - windowHeight) / 2;

}
function setup(){
    createCanvas(windowWidth, windowHeight);
    frameRate(FPS);
    textAlign(CENTER);
    textSize(16);

    if(navigator.userAgent.match(/iPhone|iPad|iPod|Android|webOs|BlackBerry|Windows Phone/i))
        pixelDensity(1);

    angleMode(DEGREES);
    fill(192);

    if(windowHeight / windowWidth > (2 / 3)){
        matchHeight = true;
        bgHeight = windowHeight;
        bgWidth = bgHeight * (3 / 2);
    }else{
        matchHeight = false;
        bgWidth = windowWidth;
        bgHeight = bgWidth * (2 / 3);
    }

    focusKnob = new Knob(windowWidth * 9 / 10, matchHeight ? 0.71 * bgHeight : 0.71 * bgHeight - (bgHeight - windowHeight) / 2, focusRadius,
        -360, 360, 0, 0, focusKnobShape);
    baseKnob = new Knob(windowWidth * 1.5 / 10, matchHeight ? 0.185 * bgHeight : 0.185 * bgHeight - (bgHeight - windowHeight) / 2, baseRadius,
        -2 * 360, 2 * 360, random(-1.8 * 360, 0), 12, baseKnobShape)
    measuringKnob = new Knob(windowWidth * 9 / 10, matchHeight ? 0.184 * bgHeight : 0.184 * bgHeight - (bgHeight - windowHeight) / 2, measuringRadius,
        baseKnob.theta0, 4 * 360 + baseKnob.theta0, random(baseKnob.theta0, 1.7 * 360), 12, measuringKnobShape);
    lensKnob = new Knob(windowWidth / 2.1, matchHeight ? 0.65 * bgHeight : 0.65 * bgHeight - (bgHeight - windowHeight) / 2, lensRadius,
    -180, -90, -180, 0, lensKnobShape, 7, 0);

    knobs.push(focusKnob);
    knobs.push(measuringKnob);
    knobs.push(baseKnob);
    knobs.push(lensKnob);

    focus = random(focusKnob.lowerTheta, focusKnob.upperTheta);
    inputButton = new Button(windowWidth * 7 / 10, matchHeight ? 0.184 * bgHeight : 0.184 * bgHeight - (bgHeight - windowHeight) / 2, 25, 25, checkVerticalFilars);
    variation = random(-1.5, 1.5);

}
function draw(){
    background(0);
    image(bg, (windowWidth - bgWidth) / 2, (windowHeight - bgHeight) / 2, bgWidth, bgHeight);

    blur();

    inputButton.display();

    for(let i = 0; i < knobs.length; i++)
        knobs[i].display();

    drawFilars();
    staticSetup();
    logs();
    prevMouse = mouseIsPressed;
    displayArrows();
}
function displayArrows(){
    displayArrow(baseKnob, createVector(matchHeight ? 0.4 * bgWidth - (bgWidth - windowWidth) / 2 : 0.4 * bgWidth, baseKnob.y), color(0));
    displayArrow(focusKnob, createVector(matchHeight ? 0.61 * bgWidth - (bgWidth - windowWidth) / 2 : 0.61 * bgWidth, focusKnob.y), color(200));
    displayArrow(inputButton, createVector(matchHeight ? 0.61 * bgWidth - (bgWidth - windowWidth) / 2 : 0.61 * bgWidth, inputButton.y), color(0));
}
function displayArrow(element, end, color){

    push();
    strokeWeight(2);
    stroke(color.levels[0]);

    let dR = end.copy();
    dR.x -= element.x;
    dR.y -= element.y;

    line(element.x + (dR.x > 0 ? element.r + 20 : -element.r -20), element.y, end.x + (dR.x > 0 ? -12 : 12), end.y);
    translate(end.x + (dR.x > 0 ? -12 : 12), end.y);

    rotate(dR.heading());

    beginShape();
    noFill();

    vertex(-6, -5);
    vertex(0, 0);
    vertex(-6, 5);

    endShape();
    pop();
}
function staticSetup(){
    push();
    textSize(16);
    fill(255);
    text('Focus', focusKnob.x, focusKnob.y + focusKnob.r + 25);
    text('Base', baseKnob.x, baseKnob.y + baseKnob.r + 25);
    text('Measuring', measuringKnob.x, measuringKnob.y + measuringKnob.r  + 25);

    text('Input', inputButton.x, inputButton.y + inputButton.w / 2 + 25);

    textSize(30);
    if(done)
        text(str((206.9 + variation).toFixed(1)) + '  HK0.5', windowWidth * 9 / 10, windowHeight * 3 / 10);
    pop();

}
function blur(){
    push();
    drawingContext.filter = 'blur(' + str(abs(focusKnob.theta - focus)) / 50 + 'px)';
    translate(lensKnob.x, lensKnob.y);
    image(sample, -lensRadius, -lensRadius, 2 * lensRadius, 2 * lensRadius);
    pop();
}
function drawFilars(){

    push();
    translate(lensKnob.x, lensKnob.y);

    strokeWeight(0.9);
    line(baseKnob.theta * 2 * lensRadius / (baseKnob.upperTheta - baseKnob.lowerTheta), -sqrt(lensRadius * lensRadius  -(baseKnob.theta * 2 * lensRadius / (baseKnob.upperTheta - baseKnob.lowerTheta)) ** 2),
        baseKnob.theta * 2 * lensRadius / (baseKnob.upperTheta - baseKnob.lowerTheta), sqrt(lensRadius * lensRadius  -(baseKnob.theta * 2 * lensRadius / (baseKnob.upperTheta - baseKnob.lowerTheta)) ** 2));

    line((measuringKnob.theta + baseKnob.theta - baseKnob.theta0) * 2 * lensRadius / (measuringKnob.upperTheta - measuringKnob.lowerTheta), -sqrt(lensRadius * lensRadius  -((measuringKnob.theta + baseKnob.theta - baseKnob.theta0) * 2 * lensRadius / (measuringKnob.upperTheta - measuringKnob.lowerTheta)) ** 2),
        (measuringKnob.theta + baseKnob.theta - baseKnob.theta0) * 2 * lensRadius / (measuringKnob.upperTheta - measuringKnob.lowerTheta), sqrt(lensRadius * lensRadius  -((measuringKnob.theta + baseKnob.theta - baseKnob.theta0) * 2 * lensRadius / (measuringKnob.upperTheta - measuringKnob.lowerTheta)) ** 2));

    strokeWeight(1.4);
    line(baseKnob.theta * 2 * lensRadius / (baseKnob.upperTheta - baseKnob.lowerTheta), -lensRadius / 3.5,
        baseKnob.theta * 2 * lensRadius / (baseKnob.upperTheta - baseKnob.lowerTheta) - min(lensRadius / 5, baseKnob.theta * 2 * lensRadius / (baseKnob.upperTheta - baseKnob.lowerTheta) + lensRadius - 5), -lensRadius / 3.5);

    line(baseKnob.theta * 2 * lensRadius / (baseKnob.upperTheta - baseKnob.lowerTheta), 0,
        baseKnob.theta * 2 * lensRadius / (baseKnob.upperTheta - baseKnob.lowerTheta) - min(lensRadius / 2.5, baseKnob.theta * 2 * lensRadius / (baseKnob.upperTheta - baseKnob.lowerTheta) + lensRadius - 5), 0);

    line(baseKnob.theta * 2 * lensRadius / (baseKnob.upperTheta - baseKnob.lowerTheta), lensRadius / 3.5,
            baseKnob.theta * 2 * lensRadius / (baseKnob.upperTheta - baseKnob.lowerTheta) -min(lensRadius / 5, baseKnob.theta * 2 * lensRadius / (baseKnob.upperTheta - baseKnob.lowerTheta) + lensRadius - 5), lensRadius / 3.5);

    pop();

}

function checkVerticalFilars(){
    if(baseKnob.theta > filarBounds[0] && baseKnob.theta < filarBounds[1] && measuringKnob.theta + baseKnob.theta - baseKnob.theta0 > filarBounds[2] && measuringKnob.theta + baseKnob.theta - baseKnob.theta0 < filarBounds[3]) {
        lensKnob.theta = -180;
        done = true;
    }
    else {
        textSize(16);
        text("Please align filars", windowWidth * 9 / 10, windowHeight * 6 / 10);
    }

}

function noCallback(){}

function logs(){
    if(keyIsDown(76)){
        textSize(16);
        text(baseKnob.theta.toFixed(2), 50, 100);
        text((measuringKnob.theta + baseKnob.theta - baseKnob.theta0).toFixed(2), 50, 120);
    }
}
function keyPressed(){
    if(keyCode === LEFT_ARROW){
        videoBack = true;
    }else if(keyCode === RIGHT_ARROW){
        videoForward = true;
    }else if(keyCode === 68){
        downloadObjectAsJson(data, "vickers_data");
    }else if(keyCode === 76){
        textSize(16);
        text(baseKnob.theta.toFixed(2), 100, 100);
        text((measuringKnob.theta + baseKnob.theta - baseKnob.theta0).toFixed(2), 100, 100);
    }
}
class Knob{
    constructor(x, y, r, lowerTheta, upperTheta, theta0, sides, callbackShape = noCallback, strokeWeight = -1, stroke = -1, fill = -1){
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
        this.callbackShape = callbackShape;
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

        this.fill >= 0 ? fill(this.fill) : noFill();
        this.strokeWeight > 0 ? strokeWeight(this.strokeWeight) : noStroke();
        this.polygon();

        if(this.fill >= 0) {
            stroke(0);
            strokeWeight(3);
            fill(0);
            line(0, -this.r / 1.8, 0, (-1.5 / 2) * this.r);
        }
        pop();

        this.callbackShape();

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
        this.r = w / 2;
        this.callback = callback;
    }

    display() {
        if (mouseIsPressed && mouseX > this.x - this.w / 2 && mouseX < this.x + this.w / 2 && mouseY > this.y - this.h / 2 && mouseY < this.y + this.h / 2) {
            push();
            noStroke();
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
function lensKnobShape(){
    push();
    stroke(100);
    strokeWeight(2);
    translate(lensKnob.x, lensKnob.y);
    rotate(-lensKnob.theta + 180);

    let l = 72;

    for(let i = 0; i < l; i++)
        line((lensKnob.r - 4) * cos(360 * i / l), (lensKnob.r - 4) * sin(360 * i / l), (lensKnob.r + 4) * cos(360 * i / l), (lensKnob.r + 4) * sin(360 * i / l));

    noFill();
    circle(0, 0, lensKnob.r * 2 + 9);
    circle(0, 0, lensKnob.r * 2 - 9);
    pop();
}
function focusKnobShape(){
    push();
    translate(focusKnob.x, focusKnob.y);
    rotate(-focusKnob.theta);

    stroke(120);
    strokeWeight(2);
    fill(20);
    circle(0, 0, focusKnob.r * 2);
    circle(0, 0, focusKnob.r * 2 * 0.85);
    circle(0, -focusKnob.r * 0.5, focusKnob.r * 0.3);

    pop();
}
function measuringKnobShape(){
    push();
    translate(measuringKnob.x, measuringKnob.y);
    rotate(-measuringKnob.theta);

    noStroke();
    fill(20);
    let numTeeth = 70;
    let teethHeight = 2;


    for (let i = 0; i < numTeeth; i++) {
        let x1 = measuringKnob.r * cos(i * 360/numTeeth);
        let y1 = measuringKnob.r * sin(i * 360/numTeeth);
        let x2 = measuringKnob.r * cos((i + 1) * 360/numTeeth);
        let y2 = measuringKnob.r * sin((i + 1) * 360/numTeeth);
        let x3 = (measuringKnob.r + teethHeight) * cos((i + 0.5) * 360/numTeeth);
        let y3 = (measuringKnob.r + teethHeight) * sin((i + 0.5) * 360/numTeeth);

        triangle(x1, y1, x2, y2, x3, y3);
    }

    fill(20);
    stroke(100);
    circle(0, 0, measuringKnob.r * 2);
    circle(0, 0, measuringKnob.r * 2 * 0.85);

    pop();
}
function baseKnobShape(){
    push();
    translate(baseKnob.x, baseKnob.y);
    rotate(-baseKnob.theta);

    noStroke();
    fill(20);
    let numTeeth = 50;
    let teethHeight = 2;


    for (let i = 0; i < numTeeth; i++) {
        let x1 = baseKnob.r * cos(i * 360/numTeeth);
        let y1 = baseKnob.r * sin(i * 360/numTeeth);
        let x2 = baseKnob.r * cos((i + 1) * 360/numTeeth);
        let y2 = baseKnob.r * sin((i + 1) * 360/numTeeth);
        let x3 = (baseKnob.r + teethHeight) * cos((i + 0.5) * 360/numTeeth);
        let y3 = (baseKnob.r + teethHeight) * sin((i + 0.5) * 360/numTeeth);

        triangle(x1, y1, x2, y2, x3, y3);
    }

    fill(20);
    stroke(100);
    circle(0, 0, baseKnob.r * 2);
    circle(0, 0, baseKnob.r * 2 * 0.85);

    pop();
}
function downloadObjectAsJson(exportObj, exportName){
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    let downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}
function mouseWheel(event) {
    for(let i = 0; i < knobs.length; i++)
        if((dist(mouseX, mouseY, knobs[i].x, knobs[i].y) < knobs[i].r)) {
            knobs[i].display(event.delta / 2);
            data[k] = [performance.now(), "mouseWheel", event.delta];
            k++;
        }
}
function mousePressed(){
    data[k] = [performance.now(), "mousePressed"];
    k++;
}
function mouseMoved(){
    data[k] = [performance.now(), "mouseMoved"];
    k++;
}
function resetInteractive(){

    done = false;

    videoBack = false;
    videoForward = false;
    prevMouse = false;

    inputButton.setCallback(checkVerticalFilars);

    focusKnob.theta = 0;
    baseKnob.theta = random(-1.8 * 360, 0);
    measuringKnob.theta = random(baseKnob.theta0, 1.7 * 360);
    lensKnob.theta = -180;

    focus = random(focusKnob.lowerTheta, focusKnob.upperTheta);
    variation = random(-1.5, 1.5);

}