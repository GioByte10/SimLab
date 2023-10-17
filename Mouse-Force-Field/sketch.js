let fps = 60;

let particles = [];
let n = 1;
let d = 200;

let started = false;
let startFrame;
let ballCount = 0;

let mode = 0;
let MODE_N = 4;
let displayVector = false;
let friction = false;

let instructions = [
    "Press the left and right arrow keys to change modes",
    "Press C to clear the screen",
    "Press D to toggle vector display",
    "Press F to toggle friction",
]

function setup(){
    createCanvas(windowWidth, windowHeight);
    frameRate(fps);
    angleMode(DEGREES);

    fill(120);
}
function staticSetup(){
    textSize(16);
    fill(100)

    textAlign(RIGHT);

    if(mode === 0)
        text("Radial", windowWidth - 25, 30);

    else if(mode === 1)
        text("Radial Centrifugal", windowWidth - 25, 30);

    else if(mode === 2)
        text("Unsync Radial", windowWidth - 25, 30);

    else if(mode === 3)
        text("Sync Radial", windowWidth - 25, 30);

    text("Friction " + (friction ? "on" : "off"), windowWidth - 25, 52);

    textSize(20);
    textAlign(LEFT);
    for(let i = 0; i < instructions.length; i++)
        text(instructions[i], 15, 8 + 22 * (i + 1));

    text(particles.length + " p", 15, windowHeight - 20);

}
function draw(){
    background(220);
    text(n, mouseX + 7, mouseY + 1);
    staticSetup();

    fill(120);
    for(let i = 0; i < particles.length; i++)
        particles[i].display();

    if(mode === 1)
        unsyncRadial();

    else if(mode === 2)
        syncRadial();

}
function radial(){

    for (let i = 0; i < n; i++)
        particles.push(new Particle(20, 1, mouseX + cos(360 * i / n) * d, mouseY + sin(360 * i / n) * d));

}
function radialCentrifugal(){

    for (let i = 0; i < n; i++) {
        particles.push(new Particle(20, 1, mouseX + cos(360 * i / n) * d, mouseY + sin(360 * i / n) * d));
        let p = particles[particles.length - 1];
        p.forceField();
        p.velocity = p.acceleration.copy().rotate(90).mult(d);
        p.velocity.mult(1 / sqrt(p.velocity.mag()));
    }
}
function syncRadial(){
    if(started && frameCount - startFrame - 1 === floor(63 * 2 * ballCount / n) && ballCount < n){
        particles.push(new Particle(20, 1, mouseX + cos(180 * ballCount / n) * d, mouseY + sin(180 *  ballCount / n) * d))
        ballCount += 1;
    }else if(ballCount === n) {
        started = false;
        ballCount = 0;
    }
}
function unsyncRadial(){
    if(started && frameCount - startFrame - 1 === floor(64 * ballCount / n) && ballCount < n){
        particles.push(new Particle(20, 1, mouseX + cos(360 * 2 * ballCount / n) * d, mouseY + sin(360 * 2 *  ballCount / n) * d))
        ballCount += 1;
    }else if(ballCount === n) {
        started = false;
        ballCount = 0;
    }
}
function clearScreen(){
    particles = [];
}
function keyPressed() {
    if (keyCode === RIGHT_ARROW)
        mode++;

    else if(keyCode === LEFT_ARROW)
        mode--;

    else if(keyCode === 67)
        clearScreen();

    else if(keyCode === 68)
        displayVector = !displayVector;

    else if(keyCode === 70)
        friction = !friction;

    mode = constrain(mode, 0, MODE_N)

    mode %= MODE_N;
}
function mouseWheel(event) {
    if(abs(event.deltaY) > 0)
        n -= abs(event.deltaY) / event.deltaY;
    n = constrain(n, 1, 100);
}
function mouseClicked(){

    if(mode === 0){
        radial();

    }else if(mode === 1){
        radialCentrifugal();

    }else if(mode === 2 && !started) {
        startFrame = frameCount;
        started = true;

    }else if(mode === 3 && !started){
        startFrame = frameCount;
        started = true;
    }

}
class Particle{
    constructor(r, mass, x, y, vx = 0, vy = 0){
        this.r = r;
        this.mass = mass;

        this.position = createVector(x, y);
        this.velocity = createVector(vx, vy);
        this.acceleration = createVector(0, 0);
    }

    display(){
        this.forceField();

        if(friction)
            this.friction();

        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);

        circle(this.position.x, this.position.y, this.r * 2);

        if(displayVector) {
            push();
            stroke('#bd0b0b');
            this.displayVector(this.acceleration.copy().mult(500));

            stroke(0);
            this.displayVector(this.velocity.copy().mult(10));
            pop();
        }
    }

    displayVector(vector){
        push();

        strokeWeight(1.5);
        line(this.position.x, this.position.y, this.position.x + vector.mag() * cos(vector.heading()), this.position.y + vector.mag() * sin(vector.heading()));
        translate(this.position.x + vector.mag() * cos(vector.heading()), this.position.y + vector.mag() * sin(vector.heading()));
        rotate(vector.heading());

        beginShape();
        noFill();

        vertex(-10, -4);
        vertex(0, 0);
        vertex(-10, 4);

        endShape();
        pop();
    }

    forceField(){
        let force = createVector(mouseX - this.position.x, mouseY - this.position.y).normalize();
        this.acceleration = force.mult(1 / (this.mass * 10));
    }

    friction(){
        let force = createVector(this.velocity.x, this.velocity.y).normalize();
        this.acceleration.add(force.mult(-1 / (this.mass * 100)));
    }
}