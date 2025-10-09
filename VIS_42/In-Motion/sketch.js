const FPS = 60;

let feel = "I feel like I should get some sleep , 8:00 AM classes are not for me";
let words = feel.split(' ');
words.push("Although after making this \nI no 🚫 longer feel tired")
let c;
let i = 0;
let size = 26;

let zzz_positions = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(FPS);

    if(navigator.userAgent.match(/iPhone|iPad|iPod|Android|webOs|BlackBerry|Windows Phone/i))
        pixelDensity(1);

    c = color(random(255), random(255), random(255));

    textAlign(CENTER, CENTER);

}

function draw() {
    background(c);

    if (frameCount % (FPS * 0.7) === 0) {
        c = color(random(255), random(255), random(255));
        i++;
        size += 4;

        i = i > words.length ? 0 : i;

        size = size > 26 + 4 * words.length ? 26 : size;

        zzz_positions = [];

        for(let i = 0; i < 10; i++){
            zzz_positions.push([random(width), random(height)]);
        }

    }


    textSize(size)

    let percent = (i + 1) / (words.length + 1);

    if(i === words.length-1){
        push();
        noFill();
        stroke(200, 10, 10)
        strokeWeight(5)
        circle(width / 2, height / 2, 500);

        pop();


        textSize(36)
        text(words[i], width / 2, height / 2);
    }
    else {
        text(words[i], percent * width, percent * height);
    }

    if(words[i]  === "sleep"){
        for(let i = 0; i < 10; i++){
            text('💤', zzz_positions[i][0], zzz_positions[i][1])
        }
    }

}