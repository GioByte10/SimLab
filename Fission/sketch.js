const FPS = 60;
const enclosed = false;

const gridSpacing = 51;
const marginSpacing = 100;

let horizontalOffset;
let verticalOffset;

const nucleusRadius = 13;
const neutronRadius = 5;
const neutronSpeed = 6 / (FPS / 30);

let neutrons = [];
let nuclei = [];

let rows;
let columns;
let debug = false;

let geigerSound;

const nucleusTypes = {
    NON_FISSILE: 0,
    URANIUM: 1,
    XENON: 2
}
const {NON_FISSILE, URANIUM, XENON} = nucleusTypes;


function preload(){
    geigerSound = loadSound("sound/Geiger_1.wav");
}

function staticSetup(){
    push();
    textSize(20);
    textAlign(RIGHT, CENTER);
    text(neutrons.length + " neutrons", width - 25, 35);
    text(nuclei.filter(nucleus => nucleus.type === URANIUM).length + " uraniums", width - 25, 60);

    text(((nuclei.filter(nucleus => nucleus.type === URANIUM).length / nuclei.length) * 100).toFixed(1) + "% enrichment", width - 30, height - 39);

    let legendStart = width / 2 - 280;

    textAlign(LEFT, CENTER);
    fill(34, 140, 255)
    circle(legendStart, height - 40, nucleusRadius * 2);

    fill(0);
    text("Uranium-235", legendStart + nucleusRadius + 7, height - 39);

    fill(100);
    circle(legendStart + nucleusRadius + 7 + 160, height - 40, nucleusRadius * 2);

    fill(0);
    text("Xenon-135", legendStart + 2 * nucleusRadius + 7 + 160 + 7, height - 39);

    fill(220);
    circle(legendStart + nucleusRadius + 7 + 160 + 160, height - 40, nucleusRadius * 2);

    fill(0);
    text("non-fissile", legendStart + 2 * nucleusRadius + 7 + 160 + 160 + 7, height - 39);

    fill(100);
    circle(legendStart + 2 * nucleusRadius + 7 + 160 + 160 + 7 + 127, height - 40, neutronRadius * 2);

    fill(0);
    text("Neutron", legendStart + 2 * nucleusRadius + 7 + 160 + 160 + 7 + 127 + neutronRadius + 7, height - 40)

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
            nuclei.push(new Nucleus(marginSpacing + horizontalOffset + j * gridSpacing,
                marginSpacing + verticalOffset + i * gridSpacing, nucleusRadius, URANIUM));

    neutrons.push(new Neutron(random(0, width), random(0, height), 0, 0, neutronRadius));
    let center = createVector(width / 2, height / 2);
    neutrons[0].v =(center.sub(neutrons[0].p)).setMag(2);
}

function draw() {
    background(255);

    for(let i = nuclei.length - 1; i >= 0; i--)
        nuclei[i].display()

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

class Nucleus {
    constructor(x, y, radius, type) {
        this.p = createVector(x, y);
        this.radius = radius;
        this.type = type;
        console.log(this.type)

        this.neutronReleaseCount = 3;
    }

    display() {
        push();
        this.type === URANIUM ? fill(34, 140, 255) : (this.type === XENON ? fill(100) : fill(220));
        circle(this.p.x, this.p.y, this.radius * 2);

        if(this.type === NON_FISSILE){
            let probUranium = (1 - pow(1 - 0.00011, 30 / FPS));
            let probXenon = (1 - pow(1 - 0.00004, 30 / FPS));

            console.log(probUranium, probXenon);

            let r = random(0, 1);

            this.type = r < probUranium ? URANIUM : (r < probUranium + probXenon ? XENON : NON_FISSILE);
        }
        pop();
    }

    capture(){
        if(this.type === URANIUM)
            for (let i = 0; i < this.neutronReleaseCount; i++)
                neutrons.push(new Neutron(this.p.x, this.p.y, random(0, 2 * PI), random(0.5, neutronSpeed), neutronRadius));

        this.type = NON_FISSILE;
    }
}

class Neutron {
    constructor(x, y, theta, v, radius) {
        this.p = createVector(x, y)
        this.v = createVector(v * cos(theta), v * sin(theta));
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
            line(this.p.x, this.p.y, nuclei[index].p.x, nuclei[index].p.y);
            pop()
        }

        if(nuclei[index].type !== NON_FISSILE){
            let distance = sqrt(sq(this.p.x - nuclei[index].p.x) + sq(this.p.y - nuclei[index].p.y));

            if(distance < neutronRadius + nucleusRadius){
                geigerSound.play()
                nuclei[index].capture()

                this.collided = true
                this.collisionFrame = frameCount;

                this.v.x = 0;
                this.v.y = 0;
            }
        }
    }
}

// function touchStarted(){
//     neutrons.push(new Neutron(mouseX, mouseY, random(0, 2 * PI), random(0.5, neutronSpeed), neutronRadius));
// }

function keyPressed(){
    if(keyCode === 68){             // D Key
        debug = !debug;
    }else if(keyCode === 83) {      // S Key
        neutrons.push(new Neutron(random(0, width), random(0, height), random(0.5, 2 * PI), random(0, neutronSpeed), neutronRadius));
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
        line(nuclei[i].p.x, 0, nuclei[i].p.x, height);

    for(let i = 0; i < rows; i++)
        line(0, nuclei[i * columns].p.y, width, nuclei[i * columns].p.y);
    pop();
}
