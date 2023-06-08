let fps = 60;
let w = 1 / 60; // rpm
let r;
let s = 30;

let hr;
let mn;

let now = new Date();
let chd = now.getHours();
let cmd = now.getMinutes() + now.getSeconds() / 60;

let angle;


function setup() {
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
    frameRate(fps);

    r = min(width, height) / 3.5;

    if(navigator.userAgent.match(/iPhone|iPod|Android|BlackBerry|Windows Phone/i))
        pixelDensity(1);


    angle = cmd * 6 + chd * 360;

    createButtons();
    textAlign(CENTER);
    textSize(20)

}

function staticSetup() {

    push();
    strokeWeight(2);
    for(let i = 1; i <= 60; i++)
        line(r*cos(6 * i), r*sin(6 * i), (r + 10) * cos(6 * i), (r + 10) * sin(6 * i));
    pop();

    push();
    strokeWeight(4);
    for(let i = 1; i <= 12; i++)
        line((r - 5)*cos(30 * i), (r - 5)*sin(30 * i), (r + 10) * cos(30 * i), (r + 10) * sin(30 * i));
    pop();

    push();
    fill(0, 0, 0, 0);
    strokeWeight(3)
    circle(0, 0, r * 2 + 21);
    pop();

}

function draw() {

    background(220);
    translate(width / 2 - 50, height / 2);

    staticSetup();

    angle += w * 6 / fps;

    let m = createVector(0, -0.78 * r);
    let h = createVector(0, -0.55 * r);

    push();
    rotate(angle);
    strokeWeight(5);
    line(0, 0, m.x, m.y);
    pop();

    push();
    rotate(angle/12);
    strokeWeight(5);
    line(0, 0, h.x, h.y)
    pop();

    hr = (floor(((angle / 12 - 30) / 30) + 360) % 12) + 1;
    mn = (floor(angle / 6) % 60 + 360) % 60;

    if(hr < 10)
        hr = '0' + hr.toString();
    if(mn < 10)
        mn = '0' + mn.toString();

    text(hr.toString() + ':' + mn.toString(), 0, 50);



}


function createButtons(){

    let cw = createButton("F");

    cw.style("background-color", "#4CAF50");
    cw.style("border-radius", "8px");
    cw.style("border-style", "none");
    cw.style("box-sizing", "border-box");
    cw.style("color", "#FFFFFF");
    cw.style("cursor", "pointer");
    cw.style("display", "inline-block");
    cw.style("font-family", "Haas Grot Text R Web, Helvetica Neue, Helvetica, Arial, sans-serif");
    cw.style("font-size", "14px");
    cw.style("font-weight", "500");
    cw.style("height", "40px");
    cw.style("line-height", "20px");
    cw.style("list-style", "none");
    cw.style("margin", "0");
    cw.style("outline", "none");
    cw.style("padding", "10px 16px");
    cw.style("position", "relative");
    cw.style("text-align", "center");
    cw.style("text-decoration", "none");
    cw.style("transition", "color 100ms");
    cw.style("vertical-align", "baseline");
    cw.style("user-select", "none");
    cw.style("-webkit-user-select", "none");
    cw.style("touch-action", "manipulation");

    cw.style("background-color", "#4CAF50", ":hover");
    cw.style("background-color", "#4CAF50", ":focus");

    cw.position(width / 2 + r + 20, height / 2 - 10);


    cw.touchStarted(forward);
    cw.touchEnded(stop);

    cw.mousePressed(forward);
    cw.mouseReleased(stop);


    let ccw = createButton("R");

    ccw.style("background-color", "#EA6157");
    ccw.style("border-radius", "8px");
    ccw.style("border-style", "none");
    ccw.style("box-sizing", "border-box");
    ccw.style("color", "#FFFFFF");
    ccw.style("cursor", "pointer");
    ccw.style("display", "inline-block");
    ccw.style("font-family", "Haas Grot Text R Web, Helvetica Neue, Helvetica, Arial, sans-serif");
    ccw.style("font-size", "14px");
    ccw.style("font-weight", "500");
    ccw.style("height", "40px");
    ccw.style("line-height", "20px");
    ccw.style("list-style", "none");
    ccw.style("margin", "0");
    ccw.style("outline", "none");
    ccw.style("padding", "10px 16px");
    ccw.style("position", "relative");
    ccw.style("text-align", "center");
    ccw.style("text-decoration", "none");
    ccw.style("transition", "color 100ms");
    ccw.style("vertical-align", "baseline");
    ccw.style("user-select", "none");
    ccw.style("-webkit-user-select", "none");
    ccw.style("touch-action", "manipulation");

    // Apply hover and focus styles
    ccw.style("background-color", "#EA6157", ":hover");
    ccw.style("background-color", "#EA6157", ":focus");

    ccw.position(width / 2 + r + 20, height / 2 + 50);

    ccw.touchStarted(rev);
    ccw.touchEnded(stop);

    ccw.mousePressed(rev);
    ccw.mouseReleased(stop);

}

function forward(){
    w = s;
}

function rev(){
    w = -s;
}

function stop(){
    w = 1 / 60;
}
