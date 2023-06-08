let fps = 60;

let edgeOffset = 50;
let axisLength = 500;
let relativeAxisLength = 300;

let w;
let theta = 0;

let rA;
let rA0;
let rAx0 = 300;
let rAy0 = 60;

let vA;
let vA0;
let vAx0 = 0;
let vAy0 = 0;

let rrBA;
let rrBA0;
let rrBAx0 = 0;
let rrBAy0 = 0;

let rvBA;
let rvBA0;
let rvBAx0 = 0;
let rvBAy0 = 0;

let rB;

let t = 0;

function setup() {

    createCanvas(window.innerWidth, window.innerHeight);
    background(240);
    frameRate(fps);

    w = createVector(0, 0, 0.01);

    vA0 = createVector(vAx0, vAy0);
    rA0 = createVector(rAx0, -rAy0);

    rA = rA0;
    vA = vA0;

    rrBA0 = createVector(rrBAx0, rrBAy0);
    rvBA0 = createVector(rvBAx0, rvBAy0);

    rrBA = rrBA0;
    rvBA = rvBA0;

    rB = createVector(0, 0);

    textAlign(CENTER, CENTER);
    textSize(22);
}

function staticSetup(){

    text('Y', 0, - axisLength - 25);
    text('X', axisLength + 25, 0);

    strokeWeight(2);
    line(0, 0, axisLength, 0);
    line(0, 0, 0, -axisLength);

}

function draw() {

    background(240);
    translate(edgeOffset, height - edgeOffset);
    staticSetup();

    t = frameCount / fps;
    theta -= w.z / fps;

    vA = velocity(t).add(vA0);
    rA.add(vA.x / fps, -vA.y / fps);

    moveRelativeFrame();

    line(0, 0, rA.x, rA.y);
    createArrow(rA, rA.heading());

    rB = rA.copy().add(rrBA.copy().rotate(theta));
    line(0, 0, rB.x, rB.y);
    createArrow(rB, rB.heading());

    //text(vectorTheta, 50, -50);
}

function velocity(t) {
    let v = createVector(5, 0);
    return v;
}

function rvelocity(t) {
    return createVector(5, t);
}

function moveRelativeFrame(){
    push();
    translate(rA.x, rA.y);
    rotate(theta);

    text('y', 0, - relativeAxisLength - 25);
    text('x', relativeAxisLength + 25, 0);

    line(0, 0, relativeAxisLength, 0);
    line(0, 0, 0, -relativeAxisLength);

    moveOnRelativeFrame();

    pop();
}

function moveOnRelativeFrame(){

    rvBA = rvelocity(frameCount / fps).add(rvBA0);
    rrBA.add(rvBA.x / fps, -rvBA.y / fps);

    line(0, 0, rrBA.x, rrBA.y);
    createArrow(rrBA, rrBA.heading())

    strokeWeight(8);
    point(rrBA.x, rrBA.y);

}

function createArrow(r, a){
    push();

    translate(r.x, r.y);
    rotate(a);

    beginShape();
    noFill();

    vertex(-10, -4);
    vertex(0, 0);
    vertex(-10, 4);

    endShape();
    pop();
}