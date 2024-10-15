const FPS = 60;
const duration = 10;
let points = new Float32Array(0);
let timeStamp = -(duration * 1000 + 1);
let t;
let pausedT;
let dark = true;
let paused = false;

let checkRandomColor;
let checkBackgroundColor;
let checkShowBezierCurve;
let checkShowConstantSpeed;

let curvePoints = [];
let curvePointsSpeed = [];
let currentCurve = -1;

let rr;
let rg;
let rb;

const x = 0;
const y = 1;

const instructions = [
    "Bézier Curve Simulation",
    "Click on the screen to place points",
    "Press SPACE to start simulation",
    "Press C to clear the screen",
    "Press P to pause simulation",
]

p5.disableFriendlyErrors = true;

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(FPS);
    colorMode(HSB, 360, 100, 100);

    if(navigator.userAgent.match(/iPhone|iPad|iPod|Android|webOs|BlackBerry|Windows Phone/i))
        pixelDensity(1);

    createChecks();

}

function staticSetup(){
    push();


    dark ? (noStroke(), fill(255)) : (noStroke(), fill(0))

    textSize(16);
    textAlign(LEFT);

    for(let i = 0; i < instructions.length; i++)
        text(instructions[i], 15, 8 + 22 * (i + 1));

    textSize(16);
    textAlign(RIGHT);

    if(t < duration)
        text(t.toPrecision(3), windowWidth - 20, windowHeight - 20);

    text(points.length / 2, windowWidth - 20, 30)
    pop();

}

function draw(){
    if(paused)
        return;

    background(0, 0,dark ? 0 : 86);
    staticSetup();

    t = (millis() - timeStamp) / 1000;

    strokeWeight(3);
    if(points.length > 1)
        displayPoints()

    if (points.length > 2) {
        if(t < duration && currentCurve === 0)
            displayLines();

        else if(t > duration && currentCurve === 0 && checkShowConstantSpeed.checked()) {
            currentCurve++;
            timeStamp = millis();
        }

        else if(t < duration && currentCurve === 1)
            displayLinesSpeed()
    }

    displayCurves();
}

function displayLinesSpeed(){

    let localPoints = new Float32Array(points);

    for(let j = 0; j < (points.length) / 2 - 1; j++) {
        let rx = localPoints[2 * j + 2 + x] - localPoints[2 * j + x];
        let ry = localPoints[2 * j + 2 + y] - localPoints[2 * j + y];

        let mag = sqrt(sq(rx) + sq(ry));

        localPoints[2 * j + x] += constrain(400 * t * (rx / mag) / duration, -abs(rx), abs(rx));
        localPoints[2 * j + y] += constrain(400 * t * (ry / mag) / duration, -abs(ry), abs(ry));
    }

    push();
    for(let i = 0; i < (points.length) / 2 - 2; i++){
        checkRandomColor.checked() ? stroke(((i + 1) * rr) % 360, ((i + 1) * rg) % 50 + 50, ((i + 1) * rb) % 30 + 70) : stroke(dark ? 255 : 0);
        for(let j = 0; j < (points.length) / 2 - i - 2; j++) {

            line(localPoints[2 * j + x], localPoints[2 * j + y], localPoints[2 * j + 2 + x], localPoints[2 * j + 2 + y]);

            push();
            stroke(dark ? 255 : 0);
            strokeWeight(10);
            point(localPoints[2 * j + x], localPoints[2 * j + y]);
            pop();

            let rx = localPoints[2 * j + 2 + x] - localPoints[2 * j + x];
            let ry = localPoints[2 * j + 2 + y] - localPoints[2 * j + y];

            let mag = sqrt(sq(rx) + sq(ry));

            localPoints[2 * j + x] += constrain(500 * t * (rx / mag) / duration, -abs(rx), abs(rx));
            localPoints[2 * j + y] += constrain(500 * t * (ry / mag) / duration, -abs(ry), abs(ry));
        }
        push();
        stroke(dark ? 255 : 0);
        strokeWeight(10);
        point(localPoints[points.length - 2 * i - 4 + x], localPoints[points.length - 2 * i - 4 + y]);
        pop();
    }

    push();
    stroke(205, 90, 90);
    strokeWeight(10);
    point(localPoints[x], localPoints[y]);
    curvePointsSpeed.push(localPoints[x]);
    curvePointsSpeed.push(localPoints[y]);
    pop();

    pop();
}

function displayLines(){

    let localPoints = new Float32Array(points);

    for(let j = 0; j < (points.length) / 2 - 1; j++) {
        localPoints[2 * j + x] += t * (localPoints[2 * j + 2 + x] - localPoints[2 * j + x]) / duration;
        localPoints[2 * j + y] += t * (localPoints[2 * j + 2 + y] - localPoints[2 * j + y]) / duration;
    }

    push();
    for(let i = 0; i < (points.length) / 2 - 2; i++){
        checkRandomColor.checked() ? stroke(((i + 1) * rr) % 360, ((i + 1) * rg) % 50 + 50, ((i + 1) * rb) % 30 + 70) : stroke(dark ? 255 : 0);
        for(let j = 0; j < (points.length) / 2 - i - 2; j++) {

            line(localPoints[2 * j + x], localPoints[2 * j + y], localPoints[2 * j + 2 + x], localPoints[2 * j + 2 + y]);

            push();
            stroke(dark ? 255 : 0);
            strokeWeight(10);
            point(localPoints[2 * j + x], localPoints[2 * j + y]);
            pop();

            localPoints[2 * j + x] += t * (localPoints[2 * j + 2 + x] - localPoints[2 * j + x]) / duration;
            localPoints[2 * j + y] += t * (localPoints[2 * j + 2 + y] - localPoints[2 * j + y]) / duration;
        }
        push();
        stroke(dark ? 255 : 0);
        strokeWeight(10);
        point(localPoints[points.length - 2 * i - 4 + x], localPoints[points.length - 2 * i - 4 + y]);
        pop();
    }

    push();
    stroke(0, 100, 80);
    strokeWeight(10);
    point(localPoints[x], localPoints[y]);
    if(checkShowBezierCurve.checked()) {
        curvePoints.push(localPoints[x]);
        curvePoints.push(localPoints[y]);
    }
    pop();

    pop();
}

function displayCurves(){
    for(let i = 0; i < (curvePoints.length) / 2 - 1; i++){
        strokeWeight(4);
        stroke(0, 100, 80);
        line(curvePoints[2 * i + x], curvePoints[2 * i + y], curvePoints[2 * i + 2 + x], curvePoints[2 * i + 2 + y]);
    }

    for(let i = 0; i < (curvePointsSpeed.length) / 2 - 1; i++){
        strokeWeight(4);
        stroke(205, 90, 90);
        line(curvePointsSpeed[2 * i + x], curvePointsSpeed[2 * i + y], curvePointsSpeed[2 * i + 2 + x], curvePointsSpeed[2 * i + 2 + y]);
    }
}

function displayPoints(){
    push();
    stroke(dark ? 255 : 0)
    for(let i = 0; i < (points.length) / 2 - 1; i++)
        line(points[2 * i + x], points[2 * i + y], points[2 * i + 2 + x], points[2 * i + 2 + y]);
    pop();
}

function createChecks(){
    checkRandomColor = createCheckbox('Random colors', true);
    checkRandomColor.position(12, 126);
    checkRandomColor.style('font-family', 'Helvetica, serif');
    checkRandomColor.style('color', dark ? '#FFFFFF': '#505050');
    checkRandomColor.style('-webkit-user-select', 'none');
    checkRandomColor.style('-ms-user-select', 'none');
    checkRandomColor.style('user-select', 'none');

    checkShowBezierCurve = createCheckbox('Show bezier curve', true);
    checkShowBezierCurve.position(12, 170);
    checkShowBezierCurve.style('font-family', 'Helvetica, serif');
    checkShowBezierCurve.style('color', dark ? '#FFFFFF': '#505050');
    checkShowBezierCurve.style('-webkit-user-select', 'none');
    checkShowBezierCurve.style('-ms-user-select', 'none');
    checkShowBezierCurve.style('user-select', 'none');

    checkShowConstantSpeed = createCheckbox('Show constant speed curve', true);
    checkShowConstantSpeed.position(12, 192);
    checkShowConstantSpeed.style('font-family', 'Helvetica, serif');
    checkShowConstantSpeed.style('color', dark ? '#FFFFFF': '#505050');
    checkShowConstantSpeed.style('-webkit-user-select', 'none');
    checkShowConstantSpeed.style('-ms-user-select', 'none');
    checkShowConstantSpeed.style('user-select', 'none');

    checkBackgroundColor = createCheckbox('Dark background', dark);
    checkBackgroundColor.position(12, 148);
    checkBackgroundColor.style('font-family', 'Helvetica, serif');
    checkBackgroundColor.style('color', dark ? '#FFFFFF': '#505050');
    checkBackgroundColor.style('-webkit-user-select', 'none');
    checkBackgroundColor.style('-ms-user-select', 'none');
    checkBackgroundColor.style('user-select', 'none');
    checkBackgroundColor.changed(() => {
        dark = !dark;
        checkBackgroundColor.style('color', dark ? '#FFFFFF': '#505050');
        checkRandomColor.style('color', dark ? '#FFFFFF': '#505050');
        checkShowConstantSpeed.style('color', dark ? '#FFFFFF' : '#505050');
    });

}

function keyPressed(){
    if(keyCode === 32) {            //SPACE_KEY
        if(!paused) {
            timeStamp = millis();
            rr = random(360);
            rg = random(50);
            rb = random(30);
            curvePoints = []
            curvePointsSpeed = [];
            currentCurve = 0;
        }else {
            paused = false;
            timeStamp = millis() - pausedT * 1000
        }
    }

    else if(keyCode === 67)         // C key
        clearScreen()

    else if(keyCode === 80) {        // P Key
        paused = !paused;

        if(paused)
            pausedT = t;

        else
            timeStamp = millis() - pausedT * 1000
    }
}

function clearScreen(){
    points = new Float32Array(0);
    curvePoints = [];
    curvePointsSpeed = [];
    timeStamp = -(duration * 1000 + 1);
    currentCurve = -1;
}

function touchStarted(){
    if(!(mouseX < 250 && mouseY < 300)) {
        let newPoints = new Float32Array(points.length + 2);
        newPoints.set(points);
        newPoints.set([mouseX, mouseY], points.length);

        points = newPoints;
    }
}

function textArray(arr, column){
    textSize(14);
    textAlign(LEFT);

    for(let i = 0; i < arr.length; i++)
        text("[" + arr[i] + "]", column * 300 + 15,20 * (i + 1));
}