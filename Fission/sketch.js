const FPS = 30;

const gridSpacing = 50;
const marginSpacing = 100;

let horizontalOffset;
let verticalOffset;

const uraniumRadius = 13;
const neutronRadius = 5;
const neutronSpeed = 5;

const enclosed = false;

let rows;
let columns;

const n = 1;

let neutrons = [];
let uraniums = [];

let geigerSound;

function preload(){
    geigerSound = loadSound("sound/Geiger_1.wav");
}

function staticSetup(){
    push();
    textSize(20);
    textAlign(RIGHT);
    text(neutrons.length + " neutrons", width - 25, 35);
    text(uraniums.filter(uranium => uranium.active).length + " uraniums", width - 25, 60);

    let legendStart = width / 2 - 200;

    textAlign(LEFT, CENTER)
    fill(34, 140, 255)
    circle(legendStart, height - 40, uraniumRadius * 2);

    fill(0);
    text("Uranium-235", legendStart + uraniumRadius + 7, height - 39);

    fill(220);
    circle(legendStart + uraniumRadius + 7 + 160, height - 40, uraniumRadius * 2);

    fill(0);
    text("non-fissile", legendStart + 2 * uraniumRadius + 7 + 160 + 7, height - 39);

    fill(100);
    circle(legendStart + 2 * uraniumRadius + 7 + 160 + 7 + 130, height - 40, neutronRadius * 2);

    fill(0);
    text("Neutron", legendStart + 2 * uraniumRadius + 7 + 160 + 7 + 130 + neutronRadius + 7, height - 40)

    pop();
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(FPS);

    pixelDensity(1);

    if(navigator.userAgent.match(/iPhone|iPad|iPod|Android|webOs|BlackBerry|Windows Phone/i))
        pixelDensity(1);

    rows = floor((height -2 * marginSpacing) / gridSpacing) + 1;
    columns = floor((width - 2 * marginSpacing) / gridSpacing) + 1;

    horizontalOffset = (width - marginSpacing - ((columns - 1) * gridSpacing + marginSpacing)) / 2;
    verticalOffset = (height - marginSpacing - ((rows - 1) * gridSpacing + marginSpacing)) / 2 + 10;

    for(let i = 0; i < rows; i++)
        for(let j = 0; j < columns; j++)
            uraniums.push(new Uranium(marginSpacing + horizontalOffset + j * gridSpacing,
                marginSpacing + verticalOffset + i * gridSpacing, uraniumRadius));

    neutrons.push(new Neutron(random(0, width), random(0, height), 0, 0, neutronRadius));
    let center = createVector(width / 2, height / 2);
    neutrons[0].v =(center.sub(neutrons[0].p)).setMag(random(0, 3))
}

function draw() {
    background(255);

    for(let i = uraniums.length - 1; i >= 0; i--)
        uraniums[i].display()

    for(let i = neutrons.length - 1; i >= 0; i--) {
        if (neutrons[i].despawn)
            neutrons.splice(i, 1);

        else {
            neutrons[i].display()
            neutrons[i].checkCollision()
        }
    }

    debug()
    staticSetup();
}

class Uranium {
    constructor(x, y, radius) {
        this.p = createVector(x, y);
        this.radius = radius;
        this.active = true;

        this.neutronReleaseCount = 3;
    }

    display() {
        push();
        this.active ? fill(34, 140, 255) : fill(220);
        circle(this.p.x, this.p.y, this.radius * 2);

        if(!this.active){
            this.active = random(0, 1) < 0.0001;
        }
        pop();
    }

    split(){
        this.active = false;

        for(let i = 0; i < this.neutronReleaseCount; i++) {
            neutrons.push(new Neutron(this.p.x, this.p.y, random(-neutronSpeed, neutronSpeed), random(-neutronSpeed, neutronSpeed), neutronRadius));
        }
    }
}

class Neutron {
    constructor(x, y, vx, vy, radius) {
        this.p = createVector(x, y)
        this.v = createVector(vx, vy);
        this.radius = radius;
        this.originalRadius = radius;

        this.despawn = false;
        this.collided = false;
        this.collisionFrame = 0;
        this.collisionFrameCount = 5;

        this.color = color(100);
    }

    display(){
        push();
        fill(this.color);
        this.p.add(this.v)
        circle(this.p.x, this.p.y, this.radius * 2);

        if(enclosed){
            if(this.p.x < this.radius || this.p.x > width - this.radius)
                this.v.x = -this.v.x;

            if(this.p.y < this.radius || this.p.y > height - this.radius)
                this.v.y = -this.v.y;
        }

        this.despawn ||= (this.p.x < -this.radius || this.p.x > width + this.radius ||
            this.p.y < -this.radius || this.p.y > height + this.radius)

        pop();
    }

    despawnAnimation(){
        let completeness = (frameCount - this.collisionFrame) / this.collisionFrameCount;

        this.color = color(100, (1 - completeness) * 255)
        this.radius = this.originalRadius * (1 - completeness);
        this.despawn = completeness >= 1;
    }

    checkCollision(){
        if(this.collided) {
            this.despawnAnimation()
            return;
        }

        for(let i = 0; i < uraniums.length; i++){
            if(!uraniums[i].active)
                continue;

            let distance = sqrt(sq(this.p.x - uraniums[i].p.x) + sq(this.p.y - uraniums[i].p.y));

            if(distance < this.radius + uraniums[i].radius){
                geigerSound.play()
                uraniums[i].split()

                this.collided = true
                this.collisionFrame = frameCount;

                this.v.x = 0;
                this.v.y = 0;

                return;
            }
        }
    }
}

// function touchStarted(){
//     neutrons.push(new Neutron(mouseX, mouseY, random(-neutronSpeed, neutronSpeed), random(-neutronSpeed, neutronSpeed), neutronRadius));
// }

function debug(){
    push();
    if(keyIsPressed && keyCode === 68) {    // D Key
        fill(0)
        text(mouseX + ", " + mouseY, mouseX + 10, mouseY - 10)

        stroke(255, 0, 0);
        line(0, mouseY, width, mouseY);
        line(mouseX, 0, mouseX, height);

        stroke(0)
        for(let i = 0; i < columns; i++)
            line(uraniums[i].p.x, 0, uraniums[i].p.x, height);

        for(let i = 0; i < rows; i++)
            line(0, uraniums[i * columns].p.y, width, uraniums[i * columns].p.y);
    }
    pop();
}
