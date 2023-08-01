let n = 30;
let r = 5;

let rockObjects = [];
let paperObjects = [];
let scissorObjects = [];

let fps = 60;

function setup(){

    createCanvas(windowWidth, windowHeight);
    background(220);
    textSize(20);
    frameRate(fps);

    if(navigator.userAgent.match(/iPhone|iPod|Android|BlackBerry|Windows Phone/i))
        pixelDensity(1);

    for(let i = 0; i < n; i++)
        if(i < n / 3)
            rockObjects.push(new RPSObject(random(width), random(height), '🪨'));

        else if(i < 2 * n / 3)
            paperObjects.push(new RPSObject(random(width), random(height), '📜'));

        else
            scissorObjects.push(new RPSObject(random(width), random(height), '✂️'));

    // rockObjects.push(new object(width / 2, height / 2, '🪨'));
    // paperObjects.push(new object(random(width), random(height), '📜'));
    // paperObjects.push(new object(random(width), random(height), '📜'));

}

function draw(){

    background(200);

    for(let i = 0; i < rockObjects.length; i++)
        rockObjects[i].update();

    for(let i = 0; i < paperObjects.length; i++)
        paperObjects[i].update();

    for(let i = 0; i < scissorObjects.length; i++)
        scissorObjects[i].update();

}

class RPSObject {
    constructor(x, y, emoji){
        this.position = createVector(x, y);
        this.emoji = emoji;
    }

    update(){

        if(this.emoji === '🪨')
            this.findTarget(rockObjects, scissorObjects);

        else if(this.emoji === '📜')
            this.findTarget(paperObjects, rockObjects);

        else if(this.emoji === '✂️')
            this.findTarget(scissorObjects, paperObjects);

        this.checkBoundaries();

        text(this.emoji, this.position.x, this.position.y);
    }

    findTarget(currentArray, targetArray){
        let closestTarget = createVector(Infinity, Infinity);
        let other;

        for (let i = 0; i < targetArray.length; i++)
            if (targetArray[i].position.dist(this.position) < closestTarget.mag()) {
                closestTarget = p5.Vector.sub(targetArray[i].position, this.position);
                other = targetArray[i];
            }

        this.position.add(createVector(random(-2, 2), random(-2, 2)))

        if(closestTarget.mag() !== Infinity) {
            if (closestTarget.mag() < 2 * r) {
                other.emoji = this.emoji;
                targetArray.splice(targetArray.indexOf(other), 1);
                currentArray.push(other);

            } else {
                this.position.add(closestTarget.normalize().mult(0.5));
            }
        }

    }

    checkBoundaries(){
        if(this.position.x < r)
            this.position.x = r;

        else if(this.position.x > width - r)
            this.position.x = width;

        if(this.position.y < r)
            this.position.y = r;

        else if(this.position.y > height - r)
            this.position.y = height - r;
    }
}