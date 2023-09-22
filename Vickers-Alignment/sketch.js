let fps = 30;
let knobs = [];

let thetaCap = 4 * 360;
let bg;

function preload(){
    bg = loadImage('images/sample.png');
}

function setup(){
    createCanvas(windowWidth, windowHeight);
    frameRate(fps);

    angleMode(DEGREES);

    createMeasureButton();

    fill(192);
    knobs.push(new Knob(windowWidth * 9 / 10, windowHeight * 8 / 10, windowWidth / 25));
    knobs.push(new Knob(windowWidth * 9 / 10, windowHeight * 6 / 10, windowWidth / 25));
    knobs.push(new Knob(windowWidth * 9 / 10, windowHeight * 4 / 10, windowWidth / 25));
}

function draw(){
    background(0);
    image(bg, (windowWidth - bg.width) / 2, (windowHeight - bg.height) / 2, bg.width, bg.height);

    for(let i = 0; i < knobs.length; i++)
        knobs[i].display();
}

function createMeasureButton(){
    let button;

    button = createButton('input');
    button.position(150, 100);
    //button.mousePressed(changeColor);

    button.style('width', '5%');
    button.style('height', '5%');
    button.style('font-size', '1rem');
    button.style('background', 'silver');
    button.style('box-shadow', 'inset -2px -2px #0a0a0a, inset 2px 2px #fff, inset -4px -4px grey, inset 4px 4px #dfdfdf');

}

class Knob{
    constructor(x, y, r){
        this.x = x;
        this.y = y;
        this.r = r;
        this.previousPosition = createVector(0, -this.r);
        this.currentPosition = createVector(0, -this.r);
        this.theta = 0;
    }

    display(){
        let dtheta = 0;

        if(mouseIsPressed && dist(mouseX, mouseY, this.x, this.y) < this.r) {
            this.previousPosition = this.currentPosition;
            this.currentPosition = createVector(this.x - mouseX, mouseY - this.y);
            dtheta = this.currentPosition.angleBetween(this.previousPosition);

        }else{
            this.currentPosition = createVector(this.x - mouseX, mouseY - this.y);
            this.previousPosition = this.currentPosition;
        }

        push();
        translate(this.x, this.y);
        this.theta -= dtheta;
        this.theta = constrain(this.theta, 0, thetaCap);
        rotate(-this.theta);

        linearGradient(-this.r * cos(45 + this.theta), -this.r * sin(45 + this.theta), this.r * cos(45 + this.theta), this.r * sin(45 + this.theta), color(230), color(60));
        strokeWeight(6);
        polygon(0, 0, this.r, 12);
        //circle(0, 0, this.r * 2);

        strokeWeight(3);
        stroke(0);
        line(0, -this.r / 1.8, 0, (-1.5 / 2) * this.r);
        pop();
    }
}
function polygon(x, y, radius, sides) {
    let angle = 360 / sides;
    beginShape();
    for (let a = 0; a < 360; a += angle) {
        let sx = x + cos(a) * radius;
        let sy = y + sin(a) * radius;
        vertex(sx, sy);
    }
    endShape(CLOSE);
}
function linearGradient(x0, y0, x1, y1, color0, colorE){
    let gradient = drawingContext.createLinearGradient(
        x0, y0, x1, y1,
    );
    gradient.addColorStop(0, color0);
    gradient.addColorStop(1, colorE);

    drawingContext.strokeStyle = gradient;
}