let n = 3;
let m = 200;
let agents = [];
let organicMatter = []

const matterTypes = {
    FOOD: 1,
    POISON: 2
}

function setup(){
    createCanvas(windowWidth, windowHeight)
    if(navigator.userAgent.match(/iPhone|iPad|iPod|Android|webOs|BlackBerry|Windows Phone/i))
        pixelDensity(1);

    for(let i = 0; i < n;  i++)
        agents[i] = new Agent(14, createVector(random(width), random(height)))

    for(let i = 0; i < m; i++)
        organicMatter[i] = new OrganicMatter(8, createVector(random(width), random(height)), 1);

    noStroke();
}
function draw(){
    background(220);

    for(let i = 0; i < organicMatter.length; i++)
        organicMatter[i].display();
    
    for(let i = 0; i < agents.length; i++)
        agents[i].display();

}
class Agent{
    constructor(radius, position) {
        this.position = position;
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);
        this.mass = 1;
        this.radius = radius;

        this.maxSpeed = 5;
        this.maxForce = 0.4;

        this.health = 100;
    }

    display(){
        fill(120);
        circle(this.position.x, this.position.y, 2 * this.radius)
        this.seek(createVector(mouseX, mouseY));

        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.position.add(this.velocity);

        this.acceleration.mult(0);
    }

    findTarget(type){

        let minDistance = Infinity;
        let index = -1;
        let distance;

        for(let i = 0; i < organicMatter.length; i++){
            if(organicMatter[i].type === type){
                distance = this.position.dist(organicMatter[i].position);

                if(distance < minDistance) {
                    minDistance = distance;
                    index = i;
                }
            }
        }

        if(index >= 0 && minDistance <= this.radius){
            this.health += organicMatter[index].nutrition;
            organicMatter.splice(index, 1);

            return null;

        }else {
            return index >= 0 ? organicMatter[index] : null;
        }
    }

    seek(){
        let target = this.findTarget(matterTypes.FOOD);
        if(target !== null) {
            let dR = target.position.copy().sub(this.position);
            dR.setMag(this.maxSpeed);

            let steer = dR.sub(this.velocity);
            steer.limit(this.maxForce);

            this.applyForce(steer);
        }
    }

    applyForce(force){
        this.acceleration.add(force);
    }
}

class OrganicMatter{
    constructor(radius, position, type){
        this.radius = radius;
        this.position = position;
        this.type = type;
        this.nutrition = type === matterTypes.FOOD ? 100 : -50;
    }

    display(){
        this.type === matterTypes.FOOD ? fill(19, 125, 2) : fill(242, 10, 10);
        circle(this.position.x, this.position.y, this.radius);
    }
}