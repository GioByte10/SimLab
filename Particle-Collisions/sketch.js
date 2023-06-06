const fps = 60;
let cr;
const r = 20;
const collisionFrames = 15;
let n = 1;
let MAX_N = 50;

let particles = [];
const v = 200;
const m = 1;          // yoctograms

let checkRedWhenCollide;
let sliderCr;

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    frameRate(fps);
    //pixelDensity(1);

    checkRedWhenCollide = createCheckbox('Red when collide', true);
    checkRedWhenCollide.position(15, 120);
    checkRedWhenCollide.style('color', '#646464');
    checkRedWhenCollide.style('font-family', 'Helvetica, serif');
    checkRedWhenCollide.style('-webkit-user-select', 'none');
    checkRedWhenCollide.style('-ms-user-select', 'none');
    checkRedWhenCollide.style('user-select', 'none');

    sliderCr = createSlider(0, 1, 1, 0.01);
    sliderCr.position(82, 88);
    sliderCr.style('-webkit-appearance', 'none');
    sliderCr.style('opacity', '0.4');

}

function staticSetup(){
    fill(150);
    textSize(20);
    textAlign(LEFT);
    text(n, mouseX + 7, mouseY + 1);

    fill(100);
    textSize(17);
    const instructions = [
        'Click: add a particle',
        'Scroll: change particles / click',
        'C: clear the screen',
    ]
    for(let i = 0; i < instructions.length; i++)
        text(instructions[i], 15, 8 + 22 * (i + 1));

    text("e = " + cr, 15, 100);
}

function draw() {
    background(220);
    cr = sliderCr.value();

    for (let i = 0; i < particles.length; i++){
        for(let j = i + 1; j < particles.length; j++)
            if(particles[i].checkCollision(particles[j]))
                particles[i].collide(particles[j]);

        particles[i].update();
    }
    systemEnergy();
    staticSetup();
}

function systemEnergy(){
    let systemEnergy = 0;
    for (let i = 0; i < particles.length; i++)
        systemEnergy += (particles[i].m * particles[i].v.magSq()) / 2;
    systemEnergy /= 1000;

    fill(0);
    textAlign(RIGHT);
    textSize(32);
    text(round(systemEnergy).toString()+ " zJ", width - 20, 40);
    text(particles.length.toString() + " p", width - 20, 80);
}

class Particle {
    constructor(x, y, vx, vy, radius, m) {
        this.p = createVector(x, y);
        this.v = createVector(vx, vy);

        this.m = m;
        this.radius = radius;

        this.collided = false
        this.collisionFrame = 0;
    }

    update() {
        if(this.collided && checkRedWhenCollide.checked()){
            if(frameCount - this.collisionFrame >= collisionFrames)
                this.collided = false;

            fill(255, 150 * (frameCount - this.collisionFrame) / collisionFrames + 105, 150 * (frameCount - this.collisionFrame) / collisionFrames + 105);

        }else
            fill(255, 255, 255);

        circle(this.p.x, this.p.y, this.radius * 2);
        this.p.add(this.v.copy().mult(1 / fps));

        if (this.p.x + this.radius > width || this.p.x - this.radius < 0) {
            this.v.x *= -1 * cr;
            this.p.x = constrain(this.p.x, this.radius, width - this.radius);
            this.collided = true;
            this.collisionFrame = frameCount;
        }

        if (this.p.y + this.radius > height || this.p.y - this.radius < 0) {
            this.v.y *= -1 * cr;
            this.p.y = constrain(this.p.y, this.radius, height - this.radius);
            this.collided = true;
            this.collisionFrame = frameCount;
        }
    }

    // https://math.stackexchange.com/q/1438040
    checkCollision(particle) {
        if(this.p.dist(particle.p) >  this.radius + particle.radius)
            return false;

        let dp = this.p.copy().sub(particle.p);
        let dv = this.v.copy().sub(particle.v);
        let db = dv.dot(dp);
        return db < 0;

    }

    // https://www.vobarian.com/collisions/2dcollisions2.pdf
    // https://en.wikipedia.org/wiki/Elastic_collision#Two-dimensional
    collide(particle) {
        let scalar;
        let dv = this.v.copy().sub(particle.v);
        let dp = this.p.copy().sub(particle.p);

        scalar = (((1 + cr) * particle.m) / (this.m + particle.m)) * (dv.dot(dp) / dp.magSq());
        this.v.sub(dp.copy().mult(scalar));

        scalar = (((1 + cr) * this.m) / (this.m + particle.m)) * (dv.dot(dp) / dp.magSq());
        dp.mult(-1);
        particle.v.sub(dp.copy().mult(scalar));

        this.collided = true;
        particle.collided = true;

        this.collisionFrame = frameCount;
        particle.collisionFrame = frameCount;
    }
}

function mouseClicked() {
    if(mouseX >= 300 || mouseY >= 150)
        for(let i = 0; i < n; i++) {
            let vx = random(-v, v);
            particles.push(new Particle(mouseX, mouseY, vx, random([-1, 1]) * sqrt(v ** 2 - vx ** 2), r, m));
        }
}

function mouseWheel(event) {
    if(abs(event.deltaY) > 0)
        n -= abs(event.deltaY) / event.deltaY;
    n = constrain(n, 1, MAX_N)
}

function keyPressed() {
    if (keyCode === 67)
        particles = [];
}