let fps = 60;

let particles = [];
let n = 1;
let d = 200;

let started = false;
let startFrame;
let ballCount = 0;

let mode = 0;
let MODE_N = 3;

function setup(){
    createCanvas(windowWidth, windowHeight);
    frameRate(fps);
    angleMode(DEGREES);

    fill(120);
}

function staticSetup(){
    textSize(16);
    fill(100)

    if(mode === 0)
        text("Radial", 20, 30);

    else if(mode === 1)
        text("Unsync Radial", 20, 30);

    else if(mode === 2)
        text("Sync Radial", 20, 30);

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

    }else if(mode === 1 && !started) {
        startFrame = frameCount;
        started = true;

    }else if(mode === 2 && !started){
        startFrame = frameCount;
        started = true;
    }

}
class Particle{
    constructor(r, mass, x, y){
        this.r = r;
        this.mass = mass;

        this.position = createVector(x, y);
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);
    }

    display(){
        this.forceField();

        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);

        circle(this.position.x, this.position.y, this.r * 2);
        if(abs(this.position.x - mouseX) < 2)
            console.log(frameCount);
    }

    forceField(){
        let force = createVector(mouseX - this.position.x, mouseY - this.position.y).normalize();
        this.acceleration = force.mult(1 / (this.mass * 10));
    }
}