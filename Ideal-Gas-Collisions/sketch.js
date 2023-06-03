let fps = 60;
let cr = 1;
let r = 20

let particles = [];
let n = 10;
let v = 200;
let m = 10 ** -6;

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    frameRate(fps);
}

function draw() {
    background(220);

    for (let i = 0; i < particles.length; i++)
        particles[i].update();

    let systemEnergy = 0;
    for (let i = 0; i < particles.length; i++)
        systemEnergy += (particles[i].m * 1000 * particles[i].vr ** 2) / 2;
    systemEnergy /= 1000;

    textAlign(CENTER);
    textSize(32);
    text(systemEnergy.toString() + " J", width - 100, 50);
}

class Particle {
    constructor(x, y, vx, vy, radius, m) {
        this.x = x;
        this.y = y;

        this.vx = vx / fps;
        this.vy = vy / fps;
        this.v = sqrt(this.vx ** 2 + this.vy ** 2);
        this.vr = sqrt((this.vx * fps) ** 2 + (this.vy * fps) ** 2);

        this.m = m;
        this.radius = radius;
    }

    update() {
        circle(this.x, this.y, this.radius * 2);
        this.x += this.vx;
        this.y += this.vy;

        if (this.x + this.radius > width || this.x - this.radius < 0)
            this.vx *= -1 * cr;

        if (this.y + this.radius > height || this.y - this.radius < 0)
            this.vy *= -1 * cr;

    }
}

function mouseClicked() {
    let vx = random(-v, v);
    particles.push(new Particle(mouseX, mouseY, vx, random([-1, 1]) * sqrt(v ** 2 - vx ** 2), r, m));
}

function keyPressed() {
    if (keyCode === 67)
        particles = [];
}