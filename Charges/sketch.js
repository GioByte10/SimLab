let FPS = 60;

let n = 10;
let m = 1;

let agents = [];
let organicMatter = []

let displayVectors = false;

const matterTypes = {
    FOOD: 1,
    POISON: 2,
    AGENT: 3
};
const {FOOD, POISON, AGENT} = matterTypes;

function setup(){
    createCanvas(windowWidth, windowHeight);
    frameRate(FPS);
    if(navigator.userAgent.match(/iPhone|iPad|iPod|Android|webOs|BlackBerry|Windows Phone/i))
        pixelDensity(1);

    for(let i = 0; i < n;  i++)
        agents.push(new Agent(8, createVector(random(width), random(height))));

    for(let i = 0; i < m; i++)
        organicMatter.push(new OrganicMatter(5, createVector(random(width), random(height)), 1));

    noStroke();
}
function draw(){
    background(220);

    for(let i = 0; i < organicMatter.length; i++)
        organicMatter[i].display();
    
    for(let i = 0; i < agents.length; i++)
        agents[i].display();

    for(let i = agents.length - 1; i >= 0; i--){
        if(agents[i].health === 0)
            agents.splice(i, 1);
    }

    let rand = random();
    if(rand < 3 / FPS)
        organicMatter.push(new OrganicMatter(5, createVector(random(width), random(height)), 1));

}
class Agent{
    constructor(radius, position) {
        this.position = position;
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);
        this.mass = 1;
        this.radius = radius;

        this.maxSpeed = 5;
        this.maxForce = 0.3;

        this.health = 100;
        this.matterType = AGENT;
    }

    display(){
        this.seek();

        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.position.add(this.velocity);

        fill(120);
        stroke(0);
        circle(this.position.x, this.position.y, 2 * this.radius)

        if(displayVectors) {
            stroke(0);
            this.displayVector(this.velocity.copy().mult(10));

            stroke('#bd0b0b');
            this.acceleration.mag() > 0.01 ? this.displayVector(this.acceleration.copy().mult(100)) : null;
        }

        this.acceleration.mult(0);
        this.health -= 0.1;
        this.health = constrain(this.health, 0, 100);
    }

    seek(){
        let food = this.findTarget(FOOD);
        if(food !== null) {
            let dR = food.position.copy().sub(this.position);
            dR.setMag(this.maxSpeed);

            let steer = dR.sub(this.velocity);
            steer.limit(this.maxForce);

            this.applyForce(steer);
        }

        let otherAgent = this.findTarget(AGENT);
        if(otherAgent !== null){
            let dR = this.position.copy().sub(otherAgent.position);
            let r = dR.mag();
            this.applyForce(dR.setMag(100).div(constrain(sq(r), 0.001, Infinity)));
        }

        this.applyForce(createVector(0, 100).div(sq(this.position.y)));
        this.applyForce(createVector(0, -100).div(sq(height - this.position.y)));

        this.applyForce(createVector(100, 0).div(sq(this.position.x)));
        this.applyForce(createVector(-100, 0).div(sq(width - this.position.x)));

    }

    eat(workingArray, index){
        this.health += workingArray[index].nutrition;
        workingArray.splice(index, 1);
    }

    findTarget(matterType){

        let workingArray;

        if(matterType === AGENT)
            workingArray = agents;

        else
            workingArray = organicMatter;

        let minDistance = Infinity;
        let index = -1;

        for(let i = 0; i < workingArray.length; i++){
            if(workingArray[i].matterType === matterType && this !== workingArray[i]){
                let distance = this.position.dist(workingArray[i].position);

                if(distance < minDistance) {
                    minDistance = distance;
                    index = i;
                }
            }
        }

        if(index >= 0 && minDistance <= this.radius && matterType !== AGENT){
            this.eat(workingArray, index);
            return null;

        }else {
            return index >= 0 ? workingArray[index] : null;
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

    applyForce(force){
        this.acceleration.add(force);
    }
}

class OrganicMatter{
    constructor(radius, position, matterType){
        this.radius = radius;
        this.position = position;
        this.matterType = matterType;
        this.nutrition = matterType === FOOD ? 10 : -5;
    }

    display(){
        this.matterType === FOOD ? fill(19, 125, 2) : fill(242, 10, 10);
        noStroke();
        circle(this.position.x, this.position.y, this.radius);
    }
}

function keyPressed(){
    if(keyCode == 68)
        displayVectors = !displayVectors;
}