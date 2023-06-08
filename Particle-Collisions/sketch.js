const fps = 60;
let cr;
const r = 20;
const collisionFrames = 15;
let n = 1;
let MAX_N = 50;

let particles = [];
const v = 200;
const MAX_R = 50;
let c;
const m = 1;          // yoctograms

let checkRandom;
let checkRandomColor;
let checkRedWhenCollide;
let sliderCr;

let mobile = false;
let instructions;

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    frameRate(fps);

    c = 1 / (PI * 400);
    
    if(navigator.userAgent.match(/iPhone|iPad|iPod|Android|webOs|BlackBerry|Windows Phone/i)) {
        pixelDensity(1);
        mobile = true;
    }

    if(!mobile) {
        instructions = [
            'Click: add a particle',
            'Scroll: change particles / click',
            'C: clear the screen',
        ];
    }else {
        instructions = [
            'Tap: add a particle',
        ];
        createClearButton();
    }

    checkRandom = createCheckbox('Different types of particles', true);
    checkRandom.position(12, 115);
    checkRandom.style('font-family', 'Helvetica, serif');
    checkRandom.style('color', '#646464');
    checkRandom.style('-webkit-user-select', 'none');
    checkRandom.style('-ms-user-select', 'none');
    checkRandom.style('user-select', 'none');

    checkRandomColor = createCheckbox('Random color', true);
    checkRandomColor.position(12, 140);
    checkRandomColor.style('font-family', 'Helvetica, serif');
    checkRandomColor.style('color', '#646464');
    checkRandomColor.style('-webkit-user-select', 'none');
    checkRandomColor.style('-ms-user-select', 'none');
    checkRandomColor.style('user-select', 'none');

    checkRedWhenCollide = createCheckbox('Red when collide', true);
    checkRedWhenCollide.position(12, 165);
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

    if(!mobile)
        text(n, mouseX + 7, mouseY + 1);

    fill(100);
    textSize(17);

    let i;
    for(i = 0; i < instructions.length; i++)
        text(instructions[i], 15, 8 + 22 * (i + 1));

    text("e = " + cr, 15, 8 + 22 * (i + 1) + 4);

    if(particles.length === 0) {
        textAlign(CENTER);
        text("Click to add a particle", width / 2, height / 2);
    }
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
    text(navigator.userAgent.toString(), width/2, height/2 + 100);
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
    constructor(x, y, vx, vy, radius, m, color) {
        this.p = createVector(x, y);
        this.v = createVector(vx, vy);

        this.m = m;
        this.radius = radius;

        this.color = color;

        this.collided = false
        this.collisionFrame = 0;
    }

    update() {

        let c;
        if(!checkRandomColor.checked())
            c = color(255, 255, 255);
        else
            c = this.color;

        let df = frameCount - this.collisionFrame
        if(this.collided && checkRedWhenCollide.checked()){
            if(df >= collisionFrames)
                this.collided = false;

            fill(df * (c.levels[0] - 255) / collisionFrames + 255, df * (c.levels[1] - 105) / collisionFrames + 105, df * (c.levels[2] - 105) / collisionFrames + 105);

        }else
            fill(c);

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
    // https://physics.stackexchange.com/q/732180
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

function touchStarted() {
    if(mouseX >= 300 || mouseY >= 200) {
        if(mobile && mouseX >= width - 80 && mouseX <= width - 10 && mouseY >= height - 55 && mouseY <= height - 15) {
            particles = [];

        }else {
            for (let i = 0; i < n; i++) {
                if (!checkRandom.checked()) {
                    let vx = random(-v, v);
                    particles.push(new Particle(mouseX, mouseY, vx, random([-1, 1]) * sqrt(v ** 2 - vx ** 2), r, m, color(random(0, 255), random(0, 255), random(0, 255))));
                } else {
                    let lr = random(4, MAX_R);
                    particles.push(new Particle(mouseX, mouseY, random(-v, v), random(-v, v), lr, PI * lr ** 2 * c, color(random(0, 255), random(0, 255), random(0, 255))));
                }
            }
            return false;
        }
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

function createClearButton(){

    let clearButton = createButton("Clear");

    clearButton.style("background-color", "#EA6157");
    clearButton.style("border-radius", "8px");
    clearButton.style("border-style", "none");
    clearButton.style("box-sizing", "border-box");
    clearButton.style("color", "#FFFFFF");
    clearButton.style("cursor", "pointer");
    clearButton.style("display", "inline-block");
    clearButton.style("font-family", "Haas Grot Text R Web, Helvetica Neue, Helvetica, Arial, sans-serif");
    clearButton.style("font-size", "14px");
    clearButton.style("font-weight", "500");
    clearButton.style("height", "40px");
    clearButton.style("line-height", "20px");
    clearButton.style("list-style", "none");
    clearButton.style("margin", "0");
    clearButton.style("outline", "none");
    clearButton.style("padding", "10px 16px");
    clearButton.style("position", "relative");
    clearButton.style("text-align", "center");
    clearButton.style("text-decoration", "none");
    clearButton.style("transition", "color 100ms");
    clearButton.style("vertical-align", "baseline");
    clearButton.style("user-select", "none");
    clearButton.style("-webkit-user-select", "none");
    clearButton.style("touch-action", "manipulation");

    // Apply hover and focus styles
    clearButton.style("background-color", "#EA6157", ":hover");
    clearButton.style("background-color", "#EA6157", ":focus");

    clearButton.position(width - 80, height - 55);
}