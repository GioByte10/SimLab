const FPS = 60;
const duration = 10;
let points = [];
let timeStamp = -(duration * 1000 + 1);
let t;

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(FPS);

    if(navigator.userAgent.match(/iPhone|iPad|iPod|Android|webOs|BlackBerry|Windows Phone/i))
        pixelDensity(1);
}

function staticSetup(){

    textSize(14);
    textAlign(LEFT);
    for(let i = 0; i < points.length; i++)
        text("[" + points[i] + "]", 15,20 * (i + 1));

    textSize(16);
    textAlign(RIGHT);

    if(t < duration)
        text(t.toPrecision(3), windowWidth - 15, 20);

}

function draw(){
    background(220);
    staticSetup();

    t = (millis() - timeStamp) / 1000;

    displayCurve(points);
}

function displayCurve(nestedPoints){
    if(nestedPoints.length < 2)
        return;

    let points = [];
    for(let i = 0; i < nestedPoints.length - 1; i++){
        line(nestedPoints[i][0], nestedPoints[i][1], nestedPoints[i + 1][0], nestedPoints[i + 1][1]);

        points.push([nestedPoints[i][0] + t * (nestedPoints[i + 1][0] - nestedPoints[i][0]) / duration, nestedPoints[i][1] + t * (nestedPoints[i + 1][1] - nestedPoints[i][1]) / duration]);
        console.log(points);
    }
    if(t < duration)
        displayCurve(points);
}

//
// class bline{
//     constructor() {
//         this.
//     }
// }

function keyPressed(){
    if(keyCode === 32)          //SPACE_KEY
        timeStamp = millis();

    else if(keyCode === 67)      // C key
        clearScreen()
}

function clearScreen(){
    points = []
    timeStamp = -(duration * 1000 + 1);
}

function touchStarted(){
    points.push([mouseX, mouseY]);
}