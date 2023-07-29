let img;
let path;
let i = 0;

function preload(){

    img = loadSVG('assets/Flag_of_the_United_States.svg');
    frameRate(20);

}

function setup(){
    createCanvas(windowWidth, windowHeight, SVG);

    image(img, 0, 0, 1000, 100);
    //path = querySVG('path')[0];

}

function draw(){

    clear();
    background(220);
    image(img, 0, 0, 500, 500);

    path = querySVG('path')[0];
    //path.attribute('class', 0);
    path.attribute('fill', color(mouseX / width * 255, mouseY / height * 255, frameCount % 255));

    fill(255);
    text(i, 10, 10);

}


function mousePressed(){
    i++;
}