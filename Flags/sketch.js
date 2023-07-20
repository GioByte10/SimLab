let fps = 60;
let selection;
let select;

let colors = [];
let mouseWheels = [];
let mouseIndex = 0;
let smallHeight;
let once = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(fps);

  createSelectMenu();
  selectEvent();
}

function draw() {

    background(220);

    if(selection === 'Mexico') {
        if(!once) {
            smallHeight = 4/7 < width / height;
            colors = [color(255), color(255), color(255)];
            mouseWheels = [0, 0, 0];

            once = true;

        }
        mexico();
    }

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


    if(mouseX > (width - flagWidth) / 2 && mouseX < (width - flagWidth) / 2 + flagWidth / 3 && mouseY > (height - flagHeight) / 2 && mouseY < (height - flagHeight) / 2 + flagHeight) {
        mouseIndex = 0;
        colors[0] = color(((mouseX - (width - flagWidth) / 2) / (flagWidth / 3)) * 255, ((mouseY - (height - flagHeight) / 2) / flagHeight) * 255, mouseWheels[0] * 3);
    }

    else if(mouseX > (width - flagWidth) / 2 + flagWidth / 3 && mouseX < (width - flagWidth) / 2 + flagWidth * 2 / 3) {
        mouseIndex = 1;
        colors[1] = color(((mouseX - ((width - flagWidth) / 2 + flagWidth / 3)) / (flagWidth / 3)) * 255, ((mouseY - (height - flagHeight) / 2) / flagHeight) * 255, mouseWheels[1] * 3);
    }

    else if(mouseX > (width - flagWidth) / 2 + flagWidth * 2 / 3 && mouseX < (width - flagWidth) / 2 + flagWidth)
        colors[2] = color(255, 0, 0);

    fill(colors[0]);
    rect((width - flagWidth) / 2, (height - flagHeight) / 2, flagWidth / 3, flagHeight);

    fill(colors[1]);
    rect((width - flagWidth) / 2 + flagWidth / 3, (height - flagHeight) / 2, flagWidth / 3, flagHeight);

    fill(colors[2]);
    rect((width - flagWidth) / 2 + flagWidth * 2 / 3, (height - flagHeight) / 2, flagWidth / 3, flagHeight);

}

function mouseWheel(event){
    if(abs(event.deltaY) > 0)
        mouseWheels[mouseIndex] -= abs(event.deltaY) / event.deltaY
    mouseWheels[mouseIndex] = constrain(mouseWheels[mouseIndex], 0, 255 / 3);
}

function createSelectMenu(){
    select = createSelect();
    select.position(10, 10);

    select.option('Mexico');
    select.option('Taiwan');
    select.option('Japan');
    select.option('China');

    select.selected('Mexico');
    select.changed(selectEvent);
}

function selectEvent() {
    selection = select.value();
    reset();
}

function reset(){
    colors = [];
    once = false;
}