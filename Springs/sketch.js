let fps = 60;
let g = 981;

let r = 15;
let spring;

let us = 0.3;
let uk = 0.1;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  frameRate(60);

  spring = new Spring(3, 1, r);
}

function draw() {
    background(220);

    a = -spring.k / spring.m * spring.x;

    spring.freeVibrationWithFriction();
}

class Spring{
    constructor(k, m, r){
        this.k = k;
        this.m = m;
        this.r = r;

        this.c = 360 / (width / 2);

        this.x = 200;
        this.v = 0;
        this.a = 0;
    }

    update(){
        this.v += this.a / fps;
        this.x += this.v / fps;

        text(this.v, 400, 600);
        text(this.x, 400, 650);

        noFill();
        beginShape();
        for(let i = 0; i < this.x; i++)
            vertex(i, height / 2 + sin(((width / 2) / this.x) * this.c * 8 * i) * 50);

        endShape();

        fill(100);
        circle(this.x, height / 2, this.r * 2);
    }

    freeVibration(){
        this.a = -(this.k / this.m) * (this.x - width / 2);
        this.update(a);
    }

    freeVibrationWithFriction(){
        this.a = -(this.k / this.m) * (this.x - width / 2);

        if(round(this.v) !== 0)
            this.a += - (abs(this.v) / this.v) * uk * g;

        else
            if(abs(this.a) < us * g) {
                this.a = 0;
                this.v = 0;
            }

        this.update(a);
    }
}