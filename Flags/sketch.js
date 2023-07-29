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

}

function mexico(){

    let flagHeight;
    let flagWidth;

    if(smallHeight){
        flagHeight = height - 80;
        flagWidth = flagHeight * 7 / 4;

    }else{
        flagWidth = width - 80;
        flagHeight = flagWidth * 4 / 7;
    }

    flagSection %= 3;
    let flagColors = [[0, 104, 71], [255, 255, 255], [206, 17, 38]];
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

        if (flagSection === 0 && !doneSections[0]) {
            colors[0] = color(r, g, b);

            if(abs(r - flagColors[0][0]) <= 10 && abs(g - flagColors[0][1]) <= 10 && abs(b - flagColors[0][2]) <= 10) {
                doneSections[0] = true;
                colors[0] = color(flagColors[0][0], flagColors[0][1], flagColors[0][2]);
            }

        }else if (flagSection === 1 && !doneSections[1]) {
            colors[1] = color(r, g, b);

            if(abs(r - flagColors[1][0]) <= 10 && abs(g - flagColors[1][1]) <= 10 && abs(b - flagColors[1][2]) <= 10) {
                doneSections[1] = true;
                colors[1] = color(flagColors[1][0], flagColors[1][1], flagColors[1][2]);
            }

        }else if(flagSection === 2 && !doneSections[2]){
            colors[2] = color(r, g, b);

            if(abs(r - flagColors[2][0]) <= 10 && abs(g - flagColors[2][1]) <= 10 && abs(b - flagColors[2][2]) <= 10) {
                doneSections[2] = true;
                colors[2] = color(flagColors[2][0], flagColors[2][1], flagColors[2][2]);
            }
        }
    }


    if(imageLoaded) {
        image(img, width / 2 + 19, height / 2, flagWidth, flagHeight);

        path = querySVG('path')[9];
        path.attribute('fill', colors[0]);

        path = querySVG('path')[8];
        path.attribute('class', 0);
        path.attribute('fill', colors[1]);

        path = querySVG('path')[7];
        path.attribute('fill', colors[2]);
    }

    if(keyIsPressed && keyCode === 72) {
        fill(80);
        for(let i = 0; i < flagColors.length; i++){
            text(flagColors[i], mouseX + 40, mouseY + i * 40);
        }
    }

}

function taiwan(){

    let flagHeight;
    let flagWidth;

    if(smallHeight){
        flagHeight = height - 80;
        flagWidth = flagHeight * 3 / 2;

    }else{
        flagWidth = width - 80;
        flagHeight = flagWidth * 2 / 3;
    }

    flagSection %= 3;
    let flagColors = [[254, 0, 0], [0, 0, 149], [255, 255, 255]];
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

        if (flagSection === 0 && !doneSections[0]) {
            colors[0] = color(r, g, b);

            if(abs(r - flagColors[0][0]) <= 10 && abs(g - flagColors[0][1]) <= 10 && abs(b - flagColors[0][2]) <= 10) {
                doneSections[0] = true;
                colors[0] = color(flagColors[0][0], flagColors[0][1], flagColors[0][2]);
            }

        }else if (flagSection === 1 && !doneSections[1]) {
            colors[1] = color(r, g, b);

            if(abs(r - flagColors[1][0]) <= 10 && abs(g - flagColors[1][1]) <= 10 && abs(b - flagColors[1][2]) <= 10) {
                doneSections[1] = true;
                colors[1] = color(flagColors[1][0], flagColors[1][1], flagColors[1][2]);
            }

        }else if(flagSection === 2 && !doneSections[2]){
            colors[2] = color(r, g, b);

            if(abs(r - flagColors[2][0]) <= 10 && abs(g - flagColors[2][1]) <= 10 && abs(b - flagColors[2][2]) <= 10) {
                doneSections[2] = true;
                colors[2] = color(flagColors[2][0], flagColors[2][1], flagColors[2][2]);
            }
        }
    }

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

    if(keyIsPressed && keyCode === 72) {
        fill(80);
        for(let i = 0; i < flagColors.length; i++){
            text(flagColors[i], mouseX + 40, mouseY + i * 40);
        }
    }


}

function japan(){
    let flagHeight;
    let flagWidth;

    if(smallHeight){
        flagHeight = height - 80;
        flagWidth = flagHeight * 3 / 2;

    }else{
        flagWidth = width - 80;
        flagHeight = flagWidth * 2 / 3;
    }

    flagSection %= 2;
    let flagColors = [[255, 255, 255], [188, 0, 45]];
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

        if (flagSection === 0 && !doneSections[0]) {
            colors[0] = color(r, g, b);

            if(abs(r - flagColors[0][0]) <= 10 && abs(g - flagColors[0][1]) <= 10 && abs(b - flagColors[0][2]) <= 10) {
                doneSections[0] = true;
                colors[0] = color(flagColors[0][0], flagColors[0][1], flagColors[0][2]);
            }

        }else if (flagSection === 1 && !doneSections[1]) {
            colors[1] = color(r, g, b);

            if(abs(r - flagColors[1][0]) <= 10 && abs(g - flagColors[1][1]) <= 10 && abs(b - flagColors[1][2]) <= 10) {
                doneSections[1] = true;
                colors[1] = color(flagColors[1][0], flagColors[1][1], flagColors[1][2]);
            }
        }
    }

    if(imageLoaded) {
        image(img, windowWidth / 2, windowHeight / 2, flagWidth, flagHeight);
        path = querySVG('rect')[1];
        path.attribute('fill', colors[0]);

        path = querySVG('circle')[0];
        path.attribute('fill', colors[1]);
    }

    if(keyIsPressed && keyCode === 72) {
        fill(80);
        for(let i = 0; i < flagColors.length; i++){
            text(flagColors[i], mouseX + 40, mouseY + i * 40);
        }
    }
}

function china(){
    let flagHeight;
    let flagWidth;

    if(smallHeight){
        flagHeight = height - 80;
        flagWidth = flagHeight * 3 / 2;

    }else{
        flagWidth = width - 80;
        flagHeight = flagWidth * 2 / 3;
    }

    flagSection %= 2;
    let flagColors = [[238, 28, 37], [255, 255, 0]];
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

        if (flagSection === 0 && !doneSections[0]) {
            colors[0] = color(r, g, b);

            if(abs(r - flagColors[0][0]) <= 10 && abs(g - flagColors[0][1]) <= 10 && abs(b - flagColors[0][2]) <= 10) {
                doneSections[0] = true;
                colors[0] = color(flagColors[0][0], flagColors[0][1], flagColors[0][2]);
            }

        }else if (flagSection === 1 && !doneSections[1]) {
            colors[1] = color(r, g, b);

            if(abs(r - flagColors[1][0]) <= 10 && abs(g - flagColors[1][1]) <= 10 && abs(b - flagColors[1][2]) <= 10) {
                doneSections[1] = true;
                colors[1] = color(flagColors[1][0], flagColors[1][1], flagColors[1][2]);
            }
        }
    }

    if(imageLoaded) {
        image(img, windowWidth / 2, windowHeight / 2, flagWidth, flagHeight);
        path = querySVG('path')[0];
        path.attribute('fill', colors[0]);

        path = querySVG('path')[1];
        path.attribute('fill', colors[1]);
    }

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

    select.selected('China');
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
    }
}