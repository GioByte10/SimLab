const FPS = 60;

const n = 800;
const maxR = 4;
let stars = [];

let hypotenuse;
let speed = 16;
let circles = false;

function setup(){
    createCanvas(windowWidth, windowHeight);
    frameRate(FPS);

    if(navigator.userAgent.match(/iPhone|iPad|iPod|Android|webOs|BlackBerry|Windows Phone/i))
        pixelDensity(1);

    console.log(width + ' ' + height);
    for(let i = 0; i < n; i++)
        stars.push(new Star(random(-width / 2, width / 2), random(-height / 2, height / 2)));

    hypotenuse = sqrt(sq(width) + sq(height));
}

function draw(){
    background(0);
    translate(width / 2, height / 2);

    for(let i = 0; i < stars.length; i++)
        stars[i].display();
}

function mouseWheel(event) {
    if(abs(event.deltaY) > 0)
        speed -= event.deltaY / 10;

    speed = constrain(speed, 0, pow(160, 1 / 0.65));
}

function touchStarted(){
    circles = !circles;
}

class Star{
    constructor(ix, iy) {
        this.ix = ix;
        this.iy = iy;

        this.radius = 0;
        this.c = random();
        this.pc = this.c;

        this.color = color(random(255), random(255), random(255));
    }

    display(){
        let x = this.ix / this.c;
        let y = this.iy / this.c;

        let px = this.ix / (1.01 * this.pc);
        let py = this.iy / (1.01 * this.pc);

        this.radius = maxR * pow(this.c, -0.65) -maxR;

        fill(255, this.radius * 50);
        noStroke();
        circles ? circle(x, y, this.radius * 2) : null;

        noFill();
        noStroke();
        stroke(255, (10 * pow(this.c, -0.65) -10) * 50);
        strokeWeight(1.3);
        line(px, py, x, y);

        this.pc = this.c;
        this.c -= pow(speed, 0.65) / 1000;

        if(this.c <= 0){
            this.c = 1;
            this.ix = random(-width / 2, width / 2);
            this.iy = random(-height / 2, height / 2);

            this.pc = this.c;
        }
    }
}