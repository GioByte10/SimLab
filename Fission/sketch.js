const FPS = 30;
const gridSpacing = 50;
const marginSpacing = 100;

const uraniumRadius = 13;
const neutronRadius = 5;

const n = 1;

let neutrons = [];
let uraniums = [];

let geigerSound;

function preload(){
    geigerSound = loadSound("sound/Geiger_1.wav");
}

function staticSetup(){
    text()
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(FPS);

    if(navigator.userAgent.match(/iPhone|iPad|iPod|Android|webOs|BlackBerry|Windows Phone/i))
        pixelDensity(1);

    let rows = floor((height - (4 / 3) * marginSpacing) / gridSpacing) + 1;
    let columns = floor((width - 2 * marginSpacing) / gridSpacing) + 1;

    let horizontalOffset = (width - marginSpacing - ((columns - 1) * gridSpacing + marginSpacing)) / 2;
    let verticalOffset = (height - marginSpacing - ((rows - 1) * gridSpacing + marginSpacing)) / 2;

    for(let i = 0; i < rows; i++)
        for(let j = 0; j < columns; j++)
            uraniums.push(new Uranium(marginSpacing + horizontalOffset + j * gridSpacing,
                marginSpacing + verticalOffset + i * gridSpacing, uraniumRadius));

    for(let i = 0; i < n; i++)
        neutrons.push(new Neutron(random(0, width), random(0, height), random(-3, 3), random(-3, 3), neutronRadius))
}

function draw() {
    background(255);

    for(let i = 0; i < uraniums.length; i++)
        uraniums[i].display()

    for(let i = neutrons.length - 1; i >= 0; i--)
        if(neutrons[i].despawn)
            neutrons.splice(i, 1);

        else {
            neutrons[i].display()
            neutrons[i].checkCollision()
        }

    debug()
}

class Uranium {
    constructor(x, y, radius) {
        this.p = createVector(x, y);
        this.radius = radius;
        this.active = true;
    }

    display() {
        push();
        this.active ? fill(34, 140, 255) : fill(220);
        circle(this.p.x, this.p.y, this.radius * 2);
        pop();
    }

    split(){
        this.active = false;
        neutrons.push(new Neutron(this.p.x, this.p.y, random(-3, 3), random(-3, 3), neutronRadius));
        neutrons.push(new Neutron(this.p.x, this.p.y, random(-3, 3), random(-3, 3), neutronRadius));
        neutrons.push(new Neutron(this.p.x, this.p.y, random(-3, 3), random(-3, 3), neutronRadius));
    }
}

class Neutron {
    constructor(x, y, vx, vy, radius) {
        this.p = createVector(x, y)
        this.v = createVector(vx, vy);
        this.radius = radius;

        this.despawn = false;
        this.collided = false;
        this.collisionFrame = 0;
        this.collisionFrameCount = 10;
        this.radiusDecrease = this.radius / this.collisionFrameCount;
    }

    display(){
        push();
        fill(100);
        this.p.add(this.v)
        circle(this.p.x, this.p.y, this.radius * 2);

        let df = frameCount - this.collisionFrame;
        this.despawn = (this.p.x < -this.radius || this.p.x > width + this.radius ||
            this.p.y < -this.radius || this.p.y > height + this.radius ||
            (this.collided && df >= this.collisionFrameCount))

        pop();
    }

    despawnAnimation(){
        this.v.x = 0;
        this.v.y = 0;

        this.radius -= this.radiusDecrease;
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
                uraniums[i].split()
                this.collided = true
                geigerSound.play()
                this.collisionFrame = frameCount;
                return;

            }
        }
    }
}

function debug(){
    if(keyIsPressed && keyCode === 68) {    // D Key
        fill(0);
        text(mouseX + ", " + mouseY, mouseX + 10, mouseY - 10)
        line(0, mouseY, width, mouseY);
        line(mouseX, 0, mouseX, height);
    }
}
