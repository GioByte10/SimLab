let ball;
let gravity = 0.1;
let vy = 0;
let vx = 10;
let cry = 1;
let crx = 1;

function setup() {
    createCanvas(windowWidth, windowHeight);
    ball = new Ball(width / 2, height / 2 - 100, 20);
    frameRate(60);

    if(navigator.userAgent.match(/iPhone|iPod|Android|BlackBerry|Windows Phone/i))
        pixelDensity(1);
}

function draw() {
    background(220);
    vy += gravity;
    ball.y += vy;

    ball.x += vx;

    if(ball.x + ball.radius >= width){
        vx = -vx * crx;
        ball.x = width - ball.radius;
        ball.x += vx;
    }

    if(ball.x - ball.radius <= 0){
        vx = -vx * crx;
        ball.x = ball.radius;
        ball.x += vx;
    }


    if (ball.y + ball.radius >= height) {
        vy = -vy * cry;
        ball.y = height - ball.radius;
        ball.y += vy;
    }
    //console.log(vy)

    // Display the ball
    ball.display();
}

class Ball {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    display() {
        ellipse(this.x, this.y, this.radius * 2);
    }
}
