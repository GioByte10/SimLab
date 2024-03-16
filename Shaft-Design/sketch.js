const FPS = 60;
let dropdowns = [];
let textBoxes = [];

let Sut = 0;
let Sy = 0;
let Se;
let von;
let Mm = 0;
let Ma = 0;
let Tm = 0
let Ta = 0;
let kb;
let T;

let D = 300;
let d = 180;
let r = 40;

let L = 260;
let l = 300;

let done = false

let mpaToKsi = 1;
let unitStr = "MPa";

// Creating enums below

const dropdownTypes = {
    MATERIAL: 0,
    UNITS: 1,
    FILLET: 2
};
const {MATERIAL, UNITS, FILLET} = dropdownTypes;

const textBoxesTypes ={
    MM: 0,
    MA: 1,
    TM: 2,
    TA: 3,
    TEMP: 4
};
const {MM, MA, TM, TA, TEMP} = textBoxesTypes;

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
    "ASTM 1095 HR": [ASTM, 830, 460]
};

function windowResized(){
    createCanvas(windowWidth, windowHeight);
    removeDropdowns();
    createDropdowns();

    removeTextBoxes();
    createTextBoxes();
}

function staticSetup(){
    push();

    textAlign(LEFT, CENTER);
    textSize(20);
    text("Sut = " + round(Sut * mpaToKsi) + ' ' + unitStr, dropdowns[MATERIAL].x + 170, dropdowns[MATERIAL].y + 13);
    text("Sy = " + round(Sy * mpaToKsi) + ' ' + unitStr, dropdowns[MATERIAL].x + 170 + 150, dropdowns[MATERIAL].y + 13);

    text("Mₘ = ", textBoxes[MM].position().x - 53, textBoxes[MM].position().y + 12);
    text(unitStr, textBoxes[MM].position().x + 70, textBoxes[MM].position().y + 12);

    text("Mₐ = ", textBoxes[MA].position().x - 53, textBoxes[MA].position().y + 12);
    text(unitStr, textBoxes[MA].position().x + 70, textBoxes[MA].position().y + 12);

    text("Tₐ = ", textBoxes[TA].position().x - 53, textBoxes[TA].position().y + 12);
    text(unitStr, textBoxes[TA].position().x + 70, textBoxes[TA].position().y + 12);

    text("Tₘ = ", textBoxes[TM].position().x - 53, textBoxes[TM].position().y + 12);
    text(unitStr, textBoxes[TM].position().x + 70, textBoxes[TM].position().y + 12);

    text(Mm, 200, 200);

    pop();
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
    runTextBoxes();
    calculateStresses();
}

function calculateStresses(){
    let ka = (textBoxes[MATERIAL].value().includes("CD") ? 4.51 : 57.7) * Sut ** (textBoxes[MATERIAL].value().includes("CD") ? -0.265 : -0.718);
    kb = (kb === undefined ? 0.85 :
        d < 2.79 ? 1.11107157093 :
        d >= 2.79 && d <= 51 ? 1.24 * d ** -0.107 :
        d > 51 && d <= 254 ? 1.51 * d ** -0.157 :
        0.633020906906);
    let kc = 1;
    let kd = 0.975 + (0.432 * T * 10 ** -3) - (0.115 * T ** 2 * 10 ** -5) + (0.104 * T ** 3 * 10 ** -8) - (0.595 * T ** 4 * 10 ** -12);

    text(kd, 500, 600);
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
        dropdowns.push(createSelect().style("font-size", "18px"));
    }

    for(const key in materialsMap)
        dropdowns[MATERIAL].option(key);

    Sut = materialsMap[dropdowns[MATERIAL].value()][SUT];
    Sy = materialsMap[dropdowns[MATERIAL].value()][SY];

    dropdowns[MATERIAL].changed(() => {
        Sut = materialsMap[dropdowns[MATERIAL].value()][SUT];
        Sy = materialsMap[dropdowns[MATERIAL].value()][SY];
        done = false;
    });

    dropdowns[UNITS].option("Metric");
    dropdowns[UNITS].option("Imperial");

    dropdowns[UNITS].changed(() => {
       mpaToKsi = dropdowns[UNITS].value() === "Metric" ? 1 : 0.1450377377;
       unitStr = dropdowns[UNITS].value() === "Metric" ? "MPa" : "ksi";
    });

    dropdowns[FILLET].option("sharp");
    dropdowns[FILLET].option("well rounded");

    dropdowns[FILLET].changed(() => {
       done = false;
    });

    dropdowns[UNITS].position(width - 120, 40);
    dropdowns[MATERIAL].position(50, 40);
    dropdowns[FILLET].position(0.5 * (width - (L + l)) + L + r, 0.5 * (height - D) - 100 + 0.5 * (d - D) + r + D - 10);
}

function createTextBoxes(){
    for(const keys in textBoxesTypes)
        textBoxes.push(createInput().size(50, 16));

    textBoxes[MM].position(105, 0.4 * height);
    textBoxes[MA].position(320, 0.4 * height);
    textBoxes[TM].position(105, 0.4 * height + 40);
    textBoxes[TA].position(320, 0.4 * height + 40);
    textBoxes[TEMP].position(500, 500);
}

function runTextBoxes(){
    Mm = textBoxes[MM].value() * mpaToKsi;
    Ma = textBoxes[MA].value() * mpaToKsi;
    T = textBoxes[TEMP].value();

    T = dropdowns[UNITS].value() === "Metric" ? T * 9 / 5 + 32 : T;
}

function removeDropdowns(){
    for(let i = 0; i < dropdowns.length; i++)
        dropdowns[i].remove();

    dropdowns = [];
}

function removeTextBoxes(){
    for(let i = 0; i < textBoxes.length; i++)
        textBoxes[i].remove();

    textBoxes = [];
}