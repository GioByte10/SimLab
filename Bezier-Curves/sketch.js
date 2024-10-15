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

let curvePoints = [];

let rr;
let rg;
let rb;

const x = 0;
const y = 1;

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
    text("Bézier Curve Simulation", 15, 30);
    text("Click on the screen to place points", 15, 52)
    text("Press SPACE to start simulation", 15, 74);
    text("Press P to pause simulation", 15, 96);

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

    if (t < duration && points.length > 2) {
        displayLines();
    }

    displayCurve();
}

function displayCurve(){
    for(let i = 0; i < (curvePoints.length) / 2 - 1; i++){
        strokeWeight(4);
        stroke(0, 100, 80);
        line(curvePoints[2 * i + x], curvePoints[2 * i + y], curvePoints[2 * i + 2 + x], curvePoints[2 * i + 2 + y]);
    }
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
    curvePoints.push(localPoints[x]);
    curvePoints.push(localPoints[y]);
    pop();

    pop();
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
    checkRandomColor.position(12, 104);
    checkRandomColor.style('font-family', 'Helvetica, serif');
    checkRandomColor.style('color', dark ? '#FFFFFF': '#505050');
    checkRandomColor.style('-webkit-user-select', 'none');
    checkRandomColor.style('-ms-user-select', 'none');
    checkRandomColor.style('user-select', 'none');

    checkBackgroundColor = createCheckbox('Dark background', dark);
    checkBackgroundColor.position(12, 126);
    checkBackgroundColor.style('font-family', 'Helvetica, serif');
    checkBackgroundColor.style('color', dark ? '#FFFFFF': '#505050');
    checkBackgroundColor.style('-webkit-user-select', 'none');
    checkBackgroundColor.style('-ms-user-select', 'none');
    checkBackgroundColor.style('user-select', 'none');
    checkBackgroundColor.changed(() => {
        dark = !dark;
        checkBackgroundColor.style('color', dark ? '#FFFFFF': '#505050');
        checkRandomColor.style('color', dark ? '#FFFFFF': '#505050');
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
    timeStamp = -(duration * 1000 + 1);
}

function touchStarted(){
    if(!(mouseX < 250 && mouseY < 200)) {
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