const fps = 60;

let particles = [];
let n = 1;
const d = 200;

let started = false;
let startFrame;
let ballCount = 0;

let mode = 0;
const MODE_N = 4;
let displayVector = false;
let displayVectorField = false;
let friction = false;

let VECTOR_N = 20;
let vectorField;

const pressed = new Set()

const instructions = [
    "Press the left and right arrow keys to change modes",
    "Press C to clear the screen",
    "Press S to toggle vector field",
    "Press D to toggle vector display",
    "Press F to toggle friction",
]

function staticSetup(){
    fill(80)

    textAlign(RIGHT);

    if(mode === 0)
        text("Radial", windowWidth - 25, 30);

    else if(mode === 1)
        text("Radial Centripetal", windowWidth - 25, 30);

    else if(mode === 2)
        text("Unsync Radial", windowWidth - 25, 30);

    else if(mode === 3)
        text("Sync Radial", windowWidth - 25, 30);

    text("Friction " + (friction ? "on" : "off"), windowWidth - 25, 52);

    textAlign(LEFT);
    for(let i = 0; i < instructions.length; i++)
        text(instructions[i], 15, 8 + 22 * (i + 1));

    textSize(20);
    text(particles.length + " p", 15, windowHeight - 85);

    if(displayVector) {
        fill(160);
        textAlign(RIGHT);
        textSize(14);
        text("* vectors not to scale", windowWidth - 20, windowHeight - 20);
    }

    textSize(16);

}

function setup(){
    createCanvas(windowWidth, windowHeight);
    frameRate(fps);
    angleMode(DEGREES);

    if(navigator.userAgent.match(/iPhone|iPad|iPod|Android|webOs|BlackBerry|Windows Phone/i))
        pixelDensity(1);

    vectorField = new VectorField(VECTOR_N, height / (width / VECTOR_N));

    fill(120);
}

function draw(){
    background(220);
    text(n, mouseX + 7, mouseY + 1);
    staticSetup();

    if(displayVectorField) vectorField.display();
    vectorField.set(VECTOR_N, height / (width / VECTOR_N));

    fill(120);
    for(let i = 0; i < particles.length; i++)
        particles[i].display();

    if(mode === 2)
        unsyncRadial();

    else if(mode === 3)
        syncRadial();

    systemEnergy();
}

function systemEnergy(){
    let PE = 0;
    let KE = 0;

    for(let i = 0; i < particles.length; i++) {
        const p = particles[i];
        KE += p.mass * p.velocity.magSq() / 2;
        PE += p.mass * p.acceleration.mag() * p.position.dist(createVector(mouseX, mouseY));
    }

    textAlign(LEFT);
    text("PE = " + round(PE) + " J", 15, windowHeight - 60);
    text("KE = " + round(KE) + " J", 15, windowHeight - 40);
    text("Energy = PE + KE = " + round(PE + KE) + " J", 15, windowHeight - 20)
}

function radial(){
    for (let i = 0; i < n; i++)
        particles.push(new Particle(20, 1, mouseX + cos(360 * i / n) * d, mouseY + sin(360 * i / n) * d));
}

// https://en.wikipedia.org/wiki/Centripetal_force
function radialCentripetal(){
    for (let i = 0; i < n; i++) {
        particles.push(new Particle(20, 1, mouseX + cos(360 * i / n) * d, mouseY + sin(360 * i / n) * d));

        const p = particles[particles.length - 1];
        p.forceField();
        p.velocity = p.acceleration.copy().rotate(90).mult(d);
        p.velocity.div(sqrt(p.velocity.mag()));
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

function keyPressed(event) {
    // why did you need to know how many keys pressed if it was only mouseWheel + SHIFT
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

    else if(keyCode === 83)
        displayVectorField = !displayVectorField;

    mode = constrain(mode, 0, MODE_N)

    mode %= MODE_N;
}

function mouseWheel(event) {
    if(keyIsPressed && keyCode === SHIFT) {
        if (abs(event.deltaY) > 0)
            VECTOR_N -= (abs(event.deltaY) / event.deltaY);

        VECTOR_N = constrain(VECTOR_N, 2, Infinity);
    }else{
        if (abs(event.deltaY) > 0)
            n -= (abs(event.deltaY) / event.deltaY);

        n = constrain(n, 1, 255);
    }
}

function touchStarted(){

    if(mode === 0){
        radial();

    }else if(mode === 1){
        radialCentripetal();

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
        this.frictionForce = createVector(0, 0);
    }

    display(){
        this.forceField();

        if(friction) this.applyFriction();

        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);

        circle(this.position.x, this.position.y, this.r * 2);

        if(displayVector) {
            push();
            stroke(0);
            this.displayVector(this.acceleration.copy().mult(500));

            stroke('#016315');
            this.displayVector(this.velocity.copy().mult(10));

            if(friction) {
                stroke('#4f03a1');
                this.displayVector(this.frictionForce.copy().mult(3500));
            }
            pop();
        }
    }

    displayVector(vector){
        push();

        strokeWeight(1.5);
        line(this.position.x, this.position.y, this.position.x + vector.x, this.position.y + vector.y);
        translate(this.position.x + vector.x, this.position.y + vector.y);
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
        let force = createVector(mouseX - this.position.x, mouseY - this.position.y);
        force.div(force.mag() * this.mass * 10);
        this.acceleration = force;
    }

    applyFriction(){
        this.frictionForce = this.velocity.copy();
        this.frictionForce.div(this.frictionForce.mag() * -100);
        this.acceleration.add(this.frictionForce);

    }
}

class VectorField{
    constructor(xPoints, yPoints) {
        this.xPoints = xPoints;
        this.yPoints = yPoints;
    }

    display(){
        let dx = width / (this.xPoints - 1);
        let dy = height / (this.yPoints - 1);

        for(let x = 0; x < floor(this.xPoints * dx); x += dx){
            for(let y = 0; y < floor(this.yPoints * dy); y += dy){
                let vector = createVector(mouseX - x, mouseY - y);
                vector.div(vector.mag()).mult(25);
                push();
                stroke(0);
                line(x, y, x + vector.x, y + vector.y);

                translate(x + vector.x, y + vector.y);
                rotate(vector.heading());

                beginShape();
                noFill();

                vertex(-10, -4);
                vertex(0, 0);
                vertex(-10, 4);

                endShape();
                pop();
            }
        }
    }
    set(x, y){
        this.xPoints = x;
        this.yPoints = y;
    }
}
