let a = 0;
let w = 0.15;
let theta = 45;
const area = 10000;

const FPS = 60;
const points = [];
let framesPerRev = 360 / w;
let showPlane = true;

function setup(){
    createCanvas(windowWidth, windowHeight);
    frameRate(FPS);
    angleMode(DEGREES);

    if(navigator.userAgent.match(/iPhone|iPad|iPod|Android|webOs|BlackBerry|Windows Phone/i))
        pixelDensity(1);

    console.log("test");

}

function draw(){
    background(220);
    translate(width / 2, height / 2);

    let r = sqrt(area / abs(sin(theta) * cos(theta)));
    let sWidth = r * cos(theta);
    let sHeight = r * sin(theta);

    fill(160);
    rect(0, 0, sWidth, -sHeight);
    line(0, 0, sWidth, -sHeight);

    if(showPlane) {
        line(-height / 2.5, 0, height / 2.5, 0);
        line(0, -height / 2.5, 0, height / 2.5);
    }

    points.push([sWidth, -sHeight]);

    for(let i = 0; i < points.length; i++){
        point(points[i][0], points[i][1]);
    }

    framesPerRev = 360 / w;
    points.splice(0, points.length - 0.7 * framesPerRev);

    console.log()

    theta += w;
    w += a;
}

function mouseWheel(event) {
    if(abs(event.deltaY) > 0)
        w -= event.deltaY / 1000;

    w = constrain(w, 0, Infinity);
}

function keyPressed(){
    if(keyCode === 80)
        showPlane = !showPlane;
}