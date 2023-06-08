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

let bArray = [];
let baArray = [];

let t = 0;
let hm = false;
let c = false;

function setup() {

    createCanvas(window.innerWidth, window.innerHeight);
    background(240);
    frameRate(fps);

    hm = width > height;

    if(navigator.userAgent.match(/iPhone|iPod|Android|BlackBerry|Windows Phone/i)) {
        pixelDensity(1);
        c = true;
    }

    w = createVector(0, 0, 0.012);

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
    if(hm) {
        translate(edgeOffset, height - edgeOffset);
    }else {
        translate(width - edgeOffset, height - edgeOffset);
        rotate(-PI/2);
    }

    if(c){
        text("____________", 300, -200);
    }
    text(navigator.userAgent, 700, -100);

    staticSetup();

    t = frameCount / fps;
    theta -= w.z / fps;

    vA = velocity(t).add(vA0);
    rA.add(vA.x / fps, -vA.y / fps);

    moveRelativeFrame();

    push();
    stroke('#ab0505');
    line(0, 0, rA.x - 7 * cos(rA.heading()), rA.y - 7 * sin(rA.heading()));
    createArrow(rA, rA.heading());
    pop();
    displayText(rA, 'rₐ', -15);

    push();
    stroke('#052cab');
    rB = rA.copy().add(rrBA.copy().rotate(theta));
    line(0, 0, rB.x - 7 * cos(rB.heading()), rB.y - 7 * sin(rB.heading()));
    createArrow(rB, rB.heading());
    pop();
    displayText(rB, 'rᵦ', 15);

    push();
    stroke('#068f13');
    for(let i = 0; i < bArray.length; i++)
        point(bArray[i].x, bArray[i].y);

    bArray.push(rB.copy());
    pop();

}

function velocity(t) {
    return createVector(5, 0);
}

function rvelocity(t) {
    return createVector(t / 2, 5);
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

    push();
    stroke('#fa9716');
    line(0, 0, rrBA.x - 7 * cos(rrBA.heading()), rrBA.y - 7 * sin(rrBA.heading()));
    createArrow(rrBA, rrBA.heading());
    pop();
    displayText(rrBA, 'rᵦ₋ₐ', - 20);

    push();
    strokeWeight(6);
    point(rrBA.x, rrBA.y);
    pop();

    push();
    stroke('purple');
    for(let i = 0; i < baArray.length; i++)
        point(baArray[i].x, baArray[i].y);

    baArray.push(rrBA.copy());
    pop();

}

function createArrow(r, a){
    push();

    translate(r.x - 7 * cos(a), r.y - 7 *sin(a));
    rotate(a);

    beginShape();
    noFill();

    vertex(-10, -4);
    vertex(0, 0);
    vertex(-10, 4);

    endShape();
    pop();
}

function displayText(r, str, yOff){
    push();
    translate(r.x / 2, r.y / 2 - yOff);
    rotate(r.heading());
    textSize(22);
    text(str, 0, 0);
    pop();
}