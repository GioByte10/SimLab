// noinspection JSUnusedGlobalSymbols

let fps = 60;
let selection;
let select;

let colors = [];
let doneSections = [];
let wheel = 0;
let flagSection = 0;
let once = false;
let show = false;
let smallHeight;

let img;
let path;
let imageLoaded = false;

function setup() {
  createCanvas(windowWidth, windowHeight, SVG);
  frameRate(fps);

    if(navigator.userAgent.match(/iPhone|iPad|iPod|Android|webOs|BlackBerry|Windows Phone/i))
        pixelDensity(1);

  textSize(24);
  textFont("monospace");
  imageMode(CENTER);

  createSelectMenu();
  selectEvent();
}

function draw() {

    background(220);

    if(selection === 'Mexico')
        mexico();

    else if(selection === 'Taiwan')
        taiwan();

    else if(selection === 'Japan')
        japan();

    else if(selection === 'China')
        china();

    else if(selection === 'US')
        us();


}

function mexico(){

    let flagHeight;
    let flagWidth;

    flagSection %= 3;
    let flagColors = [[0, 104, 71], [255, 255, 255], [206, 17, 38]];

    [flagWidth, flagHeight] = colorFlag(4 / 7, 980, 560, flagColors);

    if(imageLoaded) {
        image(img, width / 2, height / 2, flagWidth, flagHeight);

        path = querySVG('path')[9];
        path.attribute('fill', colors[0]);

        path = querySVG('path')[8];
        path.attribute('class', 0);
        path.attribute('fill', colors[1]);

        path = querySVG('path')[7];
        path.attribute('fill', colors[2]);
    }

    hint(flagColors);

}

function taiwan(){

    let flagHeight;
    let flagWidth;

    flagSection %= 3;
    let flagColors = [[254, 0, 0], [0, 0, 149], [255, 255, 255]];

    [flagWidth, flagHeight] = colorFlag(2 / 3, 900, 600, flagColors);

    if(imageLoaded) {
        image(img, windowWidth / 2, windowHeight / 2, flagWidth, flagHeight);
        path = querySVG('path')[0];
        path.attribute('fill', colors[0]);

        path = querySVG('path')[1];
        path.attribute('fill', colors[1]);
        path = querySVG('circle')[0];
        path.attribute('stroke', colors[1]);

        path = querySVG('path')[2];
        path.attribute('fill', colors[2]);
        path = querySVG('circle')[0];
        path.attribute('fill', colors[2]);
    }

    hint(flagColors);

}

function japan(){

    let flagHeight;
    let flagWidth;

    flagSection %= 2;
    let flagColors = [[255, 255, 255], [188, 0, 45]];

    [flagWidth, flagHeight] = colorFlag(2 / 3, 900, 600, flagColors);

    if(imageLoaded) {
        image(img, windowWidth / 2, windowHeight / 2, flagWidth, flagHeight);
        path = querySVG('rect')[1];
        path.attribute('fill', colors[0]);

        path = querySVG('circle')[0];
        path.attribute('fill', colors[1]);
    }

    hint(flagColors);

}

function china(){

    let flagWidth;
    let flagHeight;

    flagSection %= 2;
    let flagColors = [[238, 28, 37], [255, 255, 0]];

    [flagWidth, flagHeight] = colorFlag(2 / 3, 900, 600, flagColors);

    if(imageLoaded) {
        image(img, windowWidth / 2, windowHeight / 2, flagWidth, flagHeight);
        path = querySVG('path')[0];
        path.attribute('fill', colors[0]);

        path = querySVG('path')[1];
        path.attribute('fill', colors[1]);
    }

    hint(flagColors);

}

function us(){

    let flagWidth;
    let flagHeight;

    flagSection %= 4;
    let flagColors = [[178, 34, 52], [255, 255, 255], [60, 59, 110], [255, 255, 255]];

    [flagWidth, flagHeight] = colorFlag(10 / 19, 1000, 526, flagColors);

    if(imageLoaded) {
        image(img, windowWidth / 2, windowHeight / 2, flagWidth, flagHeight);
        path = querySVG('rect')[1];
        path.attribute('fill', colors[0]);

        path = querySVG('path')[0];
        path.attribute('stroke', colors[1]);

        path = querySVG('rect')[2];
        path.attribute('fill', colors[2]);

        path = querySVG('path')[1];
        path.attribute('fill', colors[3]);
    }

    hint(flagColors);

}

function colorFlag(ratio, actualWidth, actualHeight, flagColors){

    let flagHeight;
    let flagWidth;

    if(smallHeight){
        flagHeight = height - 80;
        flagWidth = flagHeight / ratio;

    }else{
        flagWidth = width - 80;
        flagHeight = flagWidth * ratio;
    }

    flagWidth = constrain(flagWidth, 0, actualWidth);
    flagHeight = constrain(flagHeight, 0, actualHeight);

    let n = doneSections.filter(Boolean).length;
    let d = doneSections.length

    fill(0);
    text(n + "/" + d, 10, 80);

    if (!doneSections.every(element => element === true) && mouseX > (width - flagWidth) / 2 && mouseX < (width - flagWidth) / 2 + flagWidth && mouseY > (height - flagHeight) / 2 && mouseY < (height - flagHeight) / 2 + flagHeight) {
        let r = ((mouseX - (width - flagWidth) / 2) / flagWidth) * 255;
        let g = ((mouseY - (height - flagHeight) / 2) / flagHeight) * 255;
        let b = wheel * 3;

        fill(0);
        text("r: " + round(r), 10, 160);
        text("g: " + round(g), 10, 200);
        text("b: " + round(b), 10, 240);


        if(!doneSections[flagSection]){
            colors[flagSection] = color(r, g, b);
            if(abs(r - flagColors[flagSection][0]) <= 10 && abs(g - flagColors[flagSection][1]) <= 10 && abs(b - flagColors[flagSection][2]) <= 10) {
                doneSections[flagSection] = true;
                colors[flagSection] = color(flagColors[flagSection][0], flagColors[flagSection][1], flagColors[flagSection][2]);
            }
        }
    }

    if(doneSections.every(element => element === true)){
        fill(0);
        textSize(40);
        text("🎉🎉", 10, 280);

        textSize(24);
        textAlign(LEFT);
    }

    return [flagWidth, flagHeight];

}

function hint(flagColors){
    if(keyIsPressed && keyCode === 72) {
        fill(80);
        for(let i = 0; i < flagColors.length; i++){
            text(flagColors[i], mouseX + 40, mouseY + i * 40);
        }
    }
}

function mouseWheel(event){
    if(abs(event.deltaY) > 0)
        wheel -= abs(event.deltaY) / event.deltaY
    wheel = constrain(wheel, 0, 255 / 3);
}

function mousePressed(){
    flagSection++;
}

function createSelectMenu(){
    select = createSelect();
    select.position(10, 10);

    select.option('Mexico');
    select.option('Taiwan');
    select.option('Japan');
    select.option('China');
    select.option('US');

    select.selected('Mexico');
    select.changed(selectEvent);

}

function selectEvent() {
    selection = select.value();
    reset();
}

function imageSuccess(){
    imageLoaded = true;
}

function reset(){

    wheel = 0;
    flagSection = 0;
    smallHeight = false;
    imageLoaded = false;

    if(selection === 'Mexico') {
        img = loadSVG('images/Flag_of_Mexico.svg', imageSuccess);
        colors = [color(220), color(220), color(220)];
        doneSections = [false, false, false];
        smallHeight = 4/7 < width / height;

    }else if(selection === 'Taiwan') {
        img = loadSVG('images/Flag_of_Taiwan.svg', imageSuccess);
        colors = [color(220), color(220), color(220)];
        doneSections = [false, false, false];
        smallHeight = 2/3 < width / height;

    }else if(selection === 'Japan') {
        img = loadSVG('images/Flag_of_Japan.svg', imageSuccess);
        colors = [color(220), color(220)];
        doneSections = [false, false];
        smallHeight = 2/3 < width / height;

    }else if(selection === 'China') {
        img = loadSVG('images/Flag_of_China.svg', imageSuccess);
        colors = [color(220), color(220)];
        doneSections = [false, false];
        smallHeight = 2/3 < width / height;

    }else if(selection === 'US'){
        img = loadSVG('images/Flag_of_the_United_States.svg', imageSuccess);
        colors = [color(220), color(220), color(220), color(220)];
        doneSections = [false, false, false, false];
        smallHeight = 10/19 < width / height;
    }
}