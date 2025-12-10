const FPS = 60;

let prisms = [];
let grid_size = 30;
let side = 30;
let spacing = 10;
let prism_count = grid_size ** 2;

let t = 0;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    frameRate(FPS);
    angleMode(DEGREES);
    colorMode(RGB);

    if(navigator.userAgent.match(/iPhone|iPad|iPod|Android|webOs|BlackBerry|Windows Phone/i))
        pixelDensity(1);

    for(let i = 0; i < grid_size; i++){
        for(let j = 0; j < grid_size; j++){
            let grid_length = grid_size * (side + spacing);
            let x = (side + spacing) * i - grid_length / 2;
            let y = (side + spacing) * j - grid_length / 2;

            prisms.push(new Prism(x, y, side));
        }
    }

}

function draw() {
    background(40);
    ortho();
    orbitControl();
    rotateX(45);
    rotate(45);

    for(let i = 0; i < prism_count; ++i){
        prisms[i].display();
    }

    t += 2;
}

class Prism{
    constructor(x, y, side){
        this.x = x;
        this.y = y;
        this.side = side;
    }

    display(){
        push();
        translate(this.x, this.y, 0);

        let r = sqrt(sq(this.x) + sq(this.y));

        fill(abs(cos(t + r/2)) * 255, abs(sin(1.5 * (t + r/2))) * 255, abs(cos(2 * (t + r/2))) * 200);
        box(this.side, this.side, 150 * cos(t + r * cos(0.9 * t)) + 100 * sin(t));
        pop();
    }
}
