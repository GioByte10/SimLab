let maze;

function setup(){
    createCanvas(windowWidth, windowHeight);
    frameRate(60);
    angleMode(DEGREES);

    maze = new Maze(20, 20);

}

function draw(){
    background(220);

    maze.display();
}

class Maze{
    constructor(cols, rows){
        this.cols = cols;
        this.rows = rows;

        this.containerParameters = {x: 0, y: 0, contWidth: 600, contHeight: 600}

        this.squareSize = this.containerParameters.contWidth / this.cols;

        this.circleD = 10;
        this.circlePos = createVector(1.5 * this.squareSize, 1.5 * this.squareSize);
        this.circleVel = createVector(3, 3);
        this.circleAccel = createVector(0, 0);

        this.mazeMap = [];
        this.generateMapArray();
        this.done = false;
    }

    generateMapArray() {
        for (let i = 0; i < this.rows + 1; i++) {
            this.mazeMap.push([]);
            for (let j = 0; j < this.cols + 1; j++) {
                // randomize wall or not
                if (Math.random() > 0.25) {
                    this.mazeMap[i].push(0) // not wall
                } else {
                    if (i < 3 && j < 3) {
                        this.mazeMap[i].push(0) // not wall
                    } else if (this.rows - 4 < i  && this.cols - 4 < j) {
                        this.mazeMap[i].push(0) // not wall
                    } else {
                        this.mazeMap[i].push(1) // wall
                    }
                }
            }
        }
        // set perimeter to be walls
        for (let i = 0; i < this.cols; i++) {
            this.mazeMap[0][i] = 1;
            this.mazeMap[this.rows - 1][i] = 1;
        }

        for (let j = 0; j < this.cols; j++) {
            this.mazeMap[j][0] = 1;
            this.mazeMap[j][this.rows - 1] = 1;
        }
    }

    display() {
        push();
        fill('#808080');
        stroke('#222222');
        translate(width / 2 - 300, height / 2 - 300);
        rect(this.containerParameters.x, this.containerParameters.y, this.containerParameters.contWidth, this.containerParameters.contHeight);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.mazeMap[i][j] === 1) {
                    fill(0, 0, 0);
                } else {
                    fill(150, 150, 150);
                }
                square(i * this.squareSize, j * this.squareSize, this.squareSize);
            }
        }
        this.displayCircle();
        pop();
    }

    collisionDetection() {
        // find immediate s
        let neighs = this.generateNeighborCoords();
        neighs = Array.from(neighs);

        neighs.forEach((neigh)=>{
            let a = JSON.parse(neigh);
            if (this.mazeMap[a[0]][a[1]] === 1) {  // if neighbor is wall
                if (a[2] === "left") {
                    this.circlePos.x = a[0] * this.squareSize + this.circleD / 2;
                    this.circleVel.x = 0;
                    this.circleAccel.x = 0;

                } else if (a[2] === "top") {
                    this.circlePos.y = a[1] * this.squareSize + this.circleD / 2;
                    this.circleVel.y = 0;
                    this.circleAccel.y = 0;

                } else if (a[2] === "right") {
                    this.circlePos.x = a[0] * this.squareSize - this.circleD / 2;
                    this.circleVel.x = 0;
                    this.circleAccel.x = 0;

                } else {
                    this.circlePos.y = a[1] * this.squareSize - this.circleD / 2;
                    this.circleVel.y = 0;
                    this.circleAccel.y = 0;
                }

                fill('red');
                square(a[0] * this.squareSize, a[1] * this.squareSize, this.squareSize);
            }

        })

        console.log(neighs);
    }

    generateNeighborCoords() {
        let squares = new Set();
        let coords = []

        // the four "vertexes"
        let circleTop = this.circlePos.y - this.circleD / 2;
        let circleBottom = this.circlePos.y + this.circleD / 2;

        let circleLeft = this.circlePos.x - this.circleD / 2;
        let circleRight = this.circlePos.x + this.circleD / 2;

        squares.add(JSON.stringify([Math.floor(this.circlePos.x / this.squareSize), Math.floor(this.circlePos.y / this.squareSize), "middle"]));

        let leftNei = JSON.stringify([Math.floor(circleLeft / this.squareSize), Math.floor(this.circlePos.y / this.squareSize), "left"]);
        let topNei = JSON.stringify([Math.floor(this.circlePos.x / this.squareSize), Math.floor(circleTop / this.squareSize), "top"]);
        let rightNei = JSON.stringify([Math.floor(circleRight / this.squareSize), Math.floor(this.circlePos.y / this.squareSize), "right"]);
        let bottomNei = JSON.stringify([Math.floor(this.circlePos.x / this.squareSize), Math.floor(circleBottom / this.squareSize), "bottom"]);

        // let potentialNeis = [leftNei, topNei, rightNei, bottomNei];

        squares.add(leftNei);
        squares.add(topNei);
        squares.add(rightNei);
        squares.add(bottomNei);

        return squares;
    }

    displayCircle() {
        this.circleVel.add(this.circleAccel);
        this.circlePos.add(this.circleVel);
        if ((this.circlePos.x - this.squareSize / 2 >= (this.cols - 1) * this.squareSize)  && (this.circlePos.y - this.squareSize / 2 >= (this.rows - 1) * this.squareSize)) {
            this.stopCircle();
            this.done = true
            fill('green');
            square((this.rows - 1) * this.squareSize, (this.cols - 1) * this.squareSize, this.squareSize);
        }
        this.collisionDetection();
        fill(50, 50, 50);
        circle(this.circlePos.x, this.circlePos.y, this.circleD);
    }

    stopCircle() {
        maze.circleVel.x = 0;
        maze.circleVel.y = 0;

        maze.circleAccel.x = 0;
        maze.circleAccel.y = 0;
    }
}