const FPS = 60;
let dropdowns = [];
let Sut;
let Sy;

let D = 300;
let d = 180;
let r = 40;

let L = 260;
let l = 300;

const dropdownTypes = {
    MATERIAL: 0,
    UNITS: 1,
    FILLET: 2
};
const {MATERIAL, UNITS, FILLET} = dropdownTypes;

const strengthType = {
    SUT: 1,
    SY: 2
};
const {SUT, SY} = strengthType;

const materialType = {
    ASTM: 0
};
const {ASTM} = materialType;

let materialsMap = {
    "ASTM 1006 HR": [ASTM, 300, 170],
    "ASTM 1006 CD": [ASTM, 330, 280],
    "ASTM 1010 HR": [ASTM, 320, 180],
    "ASTM 1010 CD": [ASTM, 370, 300],
    "ASTM 1015 HR": [ASTM, 340, 190],
    "ASTM 1015 CD": [ASTM, 390, 320],
    "ASTM 1018 HR": [ASTM, 400, 220],
    "ASTM 1018 CD": [ASTM, 440, 370],
    "ASTM 1020 HR": [ASTM, 380, 210],
    "ASTM 1020 CD": [ASTM, 470, 390],
    "ASTM 1030 HR": [ASTM, 470, 260],
    "ASTM 1030 CD": [ASTM, 520, 440],
    "ASTM 1035 HR": [ASTM, 500, 270],
    "ASTM 1035 CD": [ASTM, 550, 460],
    "ASTM 1040 HR": [ASTM, 520, 290],
    "ASTM 1040 CD": [ASTM, 590, 490],
    "ASTM 1045 HR": [ASTM, 570, 310],
    "ASTM 1045 CD": [ASTM, 630, 530],
    "ASTM 1050 HR": [ASTM, 620, 340],
    "ASTM 1050 CD": [ASTM, 690, 580],
    "ASTM 1060 HR": [ASTM, 680, 370],
    "ASTM 1080 HR": [ASTM, 770, 420],
    "ASTM 1095 HR": [ASTM, 830, 460],
}

function windowResized(){
    createCanvas(windowWidth, windowHeight);
    removeDropdowns();
    createDropdowns();
}

function staticSetup(){
    push();

    textAlign(LEFT, CENTER);
    textSize(18);
    text("Sut = " + Sut, dropdowns[MATERIAL].x + 150, dropdowns[MATERIAL].y + 12);
    text("Sy = " + Sy, dropdowns[MATERIAL].x + 150 + 100, dropdowns[MATERIAL].y + 12);

    pop()
}

function setup(){
    frameRate(FPS);
    angleMode(DEGREES);

    if(navigator.userAgent.match(/iPhone|iPad|iPod|Android|webOs|BlackBerry|Windows Phone/i))
        pixelDensity(1);

    windowResized();
}

function draw(){
    background(220);
    staticSetup();
    sketchShaft();
}

function sketchShaft(){

    push();
    noFill();
    stroke(0);
    translate(0.5 * (width - (L + l)), 0.5 * (height - D) - 100);

    fill("#c6eafa");
    beginShape();
    vertex(0, 0);
    vertex(L, 0);
    vertex(L, 0.5 * (D -d));
    vertex(L + l, 0.5 * (D - d));
    vertex(L + l, 0.5 * (D - d) + d);
    vertex(L, 0.5 * (D - d) + d)
    vertex(L, D);
    vertex(0, D);
    endShape(CLOSE);

    noStroke();
    rect(L - 1, 0.5 * (D - d) - r + 1, r, r);
    rect(L - 1, 0.5 * (d - D) + D - 1, r, r);

    strokeWeight(1);
    stroke(0);
    fill(220);
    arc(L + r, 0.5 * (D - d) - r, 2 * r, 2 * r, 89, 181);
    arc(L + r, 0.5 * (d - D) + r + D, 2 * r, 2 * r, 179, 271);

    pop();

}

function createDropdowns(){

    for(const key in dropdownTypes) {
        dropdowns.push(createSelect().style("font-size", "15px"));
    }

    for(const key in materialsMap)
        dropdowns[MATERIAL].option(key);

    Sut = materialsMap[dropdowns[MATERIAL].value()][SUT];
    Sy = materialsMap[dropdowns[MATERIAL].value()][SY];

    dropdowns[MATERIAL].changed(() => {
        Sut = materialsMap[dropdowns[MATERIAL].value()][SUT];
        Sy = materialsMap[dropdowns[MATERIAL].value()][SY];
    });

    dropdowns[UNITS].option("Metric");
    dropdowns[UNITS].option("Imperial");

    dropdowns[FILLET].option("sharp");
    dropdowns[FILLET].option("well rounded");

    dropdowns[UNITS].position(width - 120, 40);
    dropdowns[MATERIAL].position(50, 40);
    dropdowns[FILLET].position(0.5 * (width - (L + l)) + L + r, 0.5 * (height - D) - 100 + 0.5 * (d - D) + r + D - 10);
}

function removeDropdowns(){
    for(let i = 0; i < dropdowns.length; i++)
        dropdowns[i].remove();

    dropdowns = [];
}