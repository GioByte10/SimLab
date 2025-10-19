const FPS = 60;

let tiles = [];
let l = 50;
let animationFrameCount = 2 * FPS;

let trip = false;

function setup() {
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
    frameRate(FPS);
    rectMode(CENTER);

    if(navigator.userAgent.match(/iPhone|iPad|iPod|Android|webOs|BlackBerry|Windows Phone/i))
        pixelDensity(1);

    let v = l * (1 + cos(30));
    let h = l * (1 + cos(30));

    let rows = ceil(height / v);
    let columns = ceil(width / h);

    for(let row = 0; row < rows; row++){
        for(let column = 0; column < columns + (rows % 2); column++){
            tiles.push(new Tile((column) * (l + 2 * l * cos(30)) - (row % 2) * 0.5 * (l + 2 * l * cos(30)), row * (2 * l * cos(30) + l) * cos(30), l));
        }
    }

    // for(let i = 0; i < 10; i++)
    //     tiles.push(new Tile(200 + i * (l + 2 * l * cos(30)), 200, l));
    //
    // for(let i = 0; i < 10; i++)
    //     tiles.push(new Tile(200 + i * (l + 2 * l * cos(30)) + (2 * l * cos(30) + l) * sin(30), 200 + (2 * l * cos(30) + l) * cos(30), l));

}

function draw() {
    background(220);

    for(let i = 0; i < tiles.length; i++)
        tiles[i].display();

}

function hexagon(x, y, ci){
    push();
    beginShape();

    for(let i = 0; i < 6; i++){
        let theta = i * 60 + 30;

        let px = ci * cos(theta);
        let py = ci * sin(theta);

        vertex(px, py);
    }

    endShape(CLOSE);
    pop();
}

class Tile {
    constructor(x, y, l) {
        this.x = x;
        this.y = y;
        this.l = l;

        this.animationStart = 0;
        this.colors = [color(random(255), random(255), random(255)), color(random(255), random(255), random(255)), color(random(255), random(255), random(255))];
        this.newColors = [color(random(255), random(255), random(255)), color(random(255), random(255), random(255)), color(random(255), random(255), random(255))];
        this.startColors = this.colors;
    }

    squares(){
        for(let i = 0; i < 3; i++){
            push();
            rotate(i * 60);
            let cx = this.l * (-0.5 + cos(30 + 180));
            let cy = 0;

            square(cx, cy, this.l);
            pop();
        }
    }

    triangles(){
        for(let i = 0; i < 2; i++){
            rotate(120 - i * 60);
            beginShape();
            for(let j = 0; j < 3; j++){
                push();
                let ci = (this.l / cos(30)) / 2;

                let px = ci * cos(j * 120 + 30);
                let py = ci * sin(j * 120 + 30);

                py += l + ci;

                vertex(px, py);
                pop();
            }
            endShape(CLOSE)
        }
    }

    display(){
        push();
        translate(this.x, this.y);

        fill(trip ? color(random(255), random(255), random(255)) : this.colors[0]);
        hexagon(0, 0, this.l);

        fill(trip ? color(random(255), random(255), random(255)) : this.colors[1]);
        this.squares();

        fill(trip ? color(random(255), random(255), random(255)) : this.colors[2]);
        this.triangles();

        if(!(frameCount % (animationFrameCount))) {
            this.newColors = [color(random(255), random(255), random(255)), color(random(255), random(255), random(255)), color(random(255), random(255), random(255))];
            this.startColors = this.colors;
            this.animationStart = frameCount;
        }

        for(let i = 0; i < 3; i++){
            let r = red(this.startColors[i]);
            let g = green(this.startColors[i]);
            let b = blue(this.startColors[i]);

            //console.log((frameCount - this.animationStart) / animationFrameCount);

            r = r + (red(this.newColors[i]) - r) * (frameCount - this.animationStart) / animationFrameCount;
            g = g + (green(this.newColors[i]) - g) * (frameCount - this.animationStart) / animationFrameCount;
            b = b + (blue(this.newColors[i]) - b) * (frameCount - this.animationStart) / animationFrameCount;

            this.colors[i] = color(r, g, b);
        }



        // for(let i = 0; i < 3; i++){
        //     let r = red(this.colors[i]);
        //     let g = green(this.colors[i]);
        //     let b = blue(this.colors[i]);
        //
        //     r += int(random(2)) * 2 - 1;
        //     g += int(random(2)) * 2 - 1;
        //     b += int(random(2)) * 2 - 1;
        //
        //     this.colors[i] = color(r, g, b)
        // }

        pop();
    }
}

function keyPressed(){
    if(keyCode === 84){     // t key
        trip = !trip;
    }
}