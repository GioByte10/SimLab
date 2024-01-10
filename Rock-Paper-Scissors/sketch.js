let n = 100;
let radius = 5;

let rockObjects = [];
let paperObjects = [];
let scissorObjects = [];

let fps = 60;

let rockSound;
let paperSound;
let scissorSound;
let over = false;
let wait;

function preload(){
    rockSound = loadSound('sounds/rock.mp3');
    paperSound = loadSound('sounds/paper.mp3');
    scissorSound = loadSound('sounds/scissors.mp3');

}

function setup(){

    createCanvas(windowWidth, windowHeight);
    background(220);
    textSize(20);
    textAlign(CENTER);
    frameRate(fps);

    if(navigator.userAgent.match(/iPhone|iPad|iPod|Android|webOs|BlackBerry|Windows Phone/i))
        pixelDensity(1);

    for(let i = 0; i < n; i++)
        if(i < n / 3)
            rockObjects.push(new RPSObject(random(width), random(height), '🪨'));

        else if(i < 2 * n / 3)
            paperObjects.push(new RPSObject(random(width), random(height), '📜'));

        else
            scissorObjects.push(new RPSObject(random(width), random(height), '✂️'));

}

function draw(){

    textSize(20);

    if(over){

        if(frameCount % (fps * 5) < (3 * fps)){
            if (!wait) {
                r = random(255);
                g = random(255);
                b = random(255);
                wait = true;
            }
            background(r, g, b);

        }else{
            background(200);
            wait = false;
        }

        fill(70);
        text("click to restart", width / 2, height / 2 + 50);

    }else {
        background(200);
    }


    for(let i = 0; i < rockObjects.length; i++)
        rockObjects[i].update();

    for(let i = 0; i < paperObjects.length; i++)
        paperObjects[i].update();

    for(let i = 0; i < scissorObjects.length; i++)
        scissorObjects[i].update();

    fill(0);
    textSize(50);

    if(rockObjects.length === n) {
        text('🪨 wins!', width / 2, height / 2);
        over = true;

    }else if(paperObjects.length === n) {
        text('📜 wins!', width / 2, height / 2);
        over = true;

    }else if(scissorObjects.length === n) {
        text('✂️ wins!', width / 2, height / 2);
        over = true;
    }

}

function mouseClicked(){
    if(over){
        rockObjects = [];
        paperObjects = [];
        scissorObjects = [];
        setup();
        over = false;
    }
}

function touchStarted(){
    if(over){
        rockObjects = [];
        paperObjects = [];
        scissorObjects = [];
        setup();
        over = false;
    }
}

class RPSObject {
    constructor(x, y, emoji){
        this.position = createVector(x, y);
        this.emoji = emoji;
    }

    update(){

        if(this.emoji === '🪨')
            this.findTarget(rockObjects, scissorObjects, rockSound);

        else if(this.emoji === '📜')
            this.findTarget(paperObjects, rockObjects, paperSound);

        else if(this.emoji === '✂️')
            this.findTarget(scissorObjects, paperObjects, scissorSound);

        this.checkBoundaries();

        text(this.emoji, this.position.x, this.position.y);
    }

    findTarget(currentArray, targetArray, sound){
        let closestTarget = createVector(Infinity, Infinity);
        let other;

        for (let i = 0; i < targetArray.length; i++)
            if (targetArray[i].position.dist(this.position) < closestTarget.mag()) {
                closestTarget = p5.Vector.sub(targetArray[i].position, this.position);
                other = targetArray[i];
            }

        this.position.add(createVector(random(-2, 2), random(-2, 2)))

        if(closestTarget.mag() !== Infinity) {
            if (closestTarget.mag() < 2 * radius) {
                other.emoji = this.emoji;
                sound.setVolume(0.1);
                sound.play();
                targetArray.splice(targetArray.indexOf(other), 1);
                currentArray.push(other);

            } else {
                this.position.add(closestTarget.normalize().mult(0.7));
            }
        }

    }

    checkBoundaries(){
        if(this.position.x < radius)
            this.position.x = radius;

        else if(this.position.x > width - radius)
            this.position.x = width - radius;

        if(this.position.y < radius)
            this.position.y = radius;

        else if(this.position.y > height - radius)
            this.position.y = height - radius;
    }
}