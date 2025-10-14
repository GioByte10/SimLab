const FPS = 60;

let i = 500;
let scale;

let wheelRadius = 150;
let spokeCount = 20;
let bikeFrameLength = 200;
let scaleFrameCount = 300;

let once = false;

let orbitOffset = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
    frameRate(FPS);

    if(navigator.userAgent.match(/iPhone|iPad|iPod|Android|webOs|BlackBerry|Windows Phone/i))
        pixelDensity(1);

    background(220);

}

function draw(){

    scale = constrain(i, 0, scaleFrameCount);
    scale /= scaleFrameCount;

    let dx = (bikeFrameLength + 2 * wheelRadius) * scale / 2

    translate(width / 2 - sqrt(1 - scale) * 500, height / 2);
    drawWheel(-dx);
    drawWheel(dx);


    i--;

    if(i <= 60) {
        i = 500;
        once = true;
    }

}

function drawWheel(dx, y){
    push();

    translate(0,-100);
    rotate((1 - scale) * (once ? 1000 : 90));

    translate(dx, 100);

    fill(250, 168, 60);
    //fill(239, 117, 31);
    circle(0, 0, 2 * wheelRadius * scale);

    noFill();
    strokeWeight(5 * sqrt(scale));
    circle(0, 0, 2 * wheelRadius * scale);

    fill(0);
    circle(0, 0, 15 * scale);

    rotate(1.5 * i);

    for(let j = 0; j < spokeCount; j++) {
        let theta = j * 360 / spokeCount;

        let x = wheelRadius * cos(theta) * scale;
        let y = wheelRadius * sin(theta) * scale;

        strokeWeight(2 * sqrt(scale));
        line(0, 0, x, y);
    }
    pop();
}