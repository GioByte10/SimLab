const FPS = 60;

const gridSpacing = 50;
const marginSpacing = 100;

let horizontalOffset;
let verticalOffset;

const uraniumRadius = 13;
const neutronRadius = 5;
const neutronSpeed = 5 / (FPS / 30);

const enclosed = false;

let rows;
let columns;

const n = 1;

let neutrons = [];
let uraniums = [];

let geigerSound;

let debug = false;

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

    neutrons.push(new Neutron(0, 0, 0, 0, neutronRadius));
    let center = createVector(width / 2, height / 2);
    neutrons[0].v =(center.sub(neutrons[0].p)).setMag(1);
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

    staticSetup();

    if(debug)
        showGrid();
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
            this.active = random(0, 1) < (1-pow(1 - 0.0001, 30 / FPS));
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

        let col = round((this.p.x - horizontalOffset - marginSpacing) / gridSpacing);
        let row = round((this.p.y - verticalOffset - marginSpacing) / gridSpacing);

        col = constrain(col, 0, columns - 1);
        row = constrain(row, 0, rows - 1);

        let index = row * columns + col;

        if(debug) {
            push();
            stroke(6, 140, 24);
            line(this.p.x, this.p.y, uraniums[index].p.x, uraniums[index].p.y);
            pop()
        }

        if(uraniums[index].active){
            let distance = sqrt(sq(this.p.x - uraniums[index].p.x) + sq(this.p.y - uraniums[index].p.y));

            if(distance < neutronRadius + uraniumRadius){
                geigerSound.play()
                uraniums[index].split()

                this.collided = true
                this.collisionFrame = frameCount;

                this.v.x = 0;
                this.v.y = 0;
            }
        }
    }
}

// function touchStarted(){
//     neutrons.push(new Neutron(mouseX, mouseY, random(-neutronSpeed, neutronSpeed), random(-neutronSpeed, neutronSpeed), neutronRadius));
// }

function keyPressed(){
    if(keyCode === 68){     //D Key
        debug = !debug;
    }
}

function showGrid(){
    push();
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
    pop();
}
