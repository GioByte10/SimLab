//This code is part of the Design Project for MAE 190

const FPS = 60;
let dropdowns = [];
let textBoxes = [];
let iterationHistory = [];
let it = 0;

let Sut;
let Sy;

let rd;
let Dd = 1.2;
let D;
let d;
let prevd;
let nf = 1.5;
let ny;

let at;
let bt;
let ats;
let bts;

let sD = 300;
let sd = 180;
let sr = 40;
let L = 260;
let l = 300;

let changedTemp = false;
let stressC = 6.894759;
let momentC = 8.8507;
let lengthC = 25.4;
let stressUnit = "MPa";
let momentUnit = "N-m";
let lengthUnit = "mm";
let temperatureUnit = "°C"

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
    TEMP: 4,
    RE: 5,
    FOS: 6,
    DD: 7,
};
const {MM, MA, TM, TA, TEMP, RE, FOS, DD} = textBoxesTypes;

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
    "ASTM 1006 HR": [ASTM, 43, 24],
    "ASTM 1006 CD": [ASTM, 48, 41],
    "ASTM 1010 HR": [ASTM, 47, 26],
    "ASTM 1010 CD": [ASTM, 53, 44],
    "ASTM 1015 HR": [ASTM, 50, 27.5],
    "ASTM 1015 CD": [ASTM, 56, 47],
    "ASTM 1018 HR": [ASTM, 58, 32],
    "ASTM 1018 CD": [ASTM, 64, 54],
    "ASTM 1020 HR": [ASTM, 55, 30],
    "ASTM 1020 CD": [ASTM, 68, 57],
    "ASTM 1030 HR": [ASTM, 68, 37.5],
    "ASTM 1030 CD": [ASTM, 76, 64],
    "ASTM 1035 HR": [ASTM, 72, 39.5],
    "ASTM 1035 CD": [ASTM, 80, 67],
    "ASTM 1040 HR": [ASTM, 76, 42],
    "ASTM 1040 CD": [ASTM, 85, 71],
    "ASTM 1045 HR": [ASTM, 82, 45],
    "ASTM 1045 CD": [ASTM, 91, 77],
    "ASTM 1050 HR": [ASTM, 90, 49.5],
    "ASTM 1050 CD": [ASTM, 100, 84],
    "ASTM 1060 HR": [ASTM, 98, 54],
    "ASTM 1080 HR": [ASTM, 112, 61.5],
    "ASTM 1095 HR": [ASTM, 120, 66],
    "Custom CD" : [ASTM, 75, 50]
};

function windowResized(){
    createCanvas(windowWidth, windowHeight);

    removeDropdowns();
    createDropdowns();

    removeTextBoxes();
    createTextBoxes();
}

// display all the text we see on the screen and update as needed
function staticSetup(){
    push();

    textAlign(LEFT, CENTER);
    textSize(20);
    text("Sut = " + round(Sut * stressC) + ' ' + stressUnit, dropdowns[MATERIAL].x + 170, dropdowns[MATERIAL].y + 13);
    text("Sy = " + round(Sy * stressC) + ' ' + stressUnit, dropdowns[MATERIAL].x + 170 + 150, dropdowns[MATERIAL].y + 13);

    text("Mₘ = ", textBoxes[MM].position().x - 50, textBoxes[MM].position().y + 12);
    text(momentUnit, textBoxes[MM].position().x + 70, textBoxes[MM].position().y + 12);

    text("Mₐ = ", textBoxes[MA].position().x - 50, textBoxes[MA].position().y + 12);
    text(momentUnit, textBoxes[MA].position().x + 70, textBoxes[MA].position().y + 12);

    text("Tₐ = ", textBoxes[TA].position().x - 50, textBoxes[TA].position().y + 12);
    text(momentUnit, textBoxes[TA].position().x + 70, textBoxes[TA].position().y + 12);

    text("Tₘ = ", textBoxes[TM].position().x - 50, textBoxes[TM].position().y + 12);
    text(momentUnit, textBoxes[TM].position().x + 70, textBoxes[TM].position().y + 12);

    text(temperatureUnit, textBoxes[TEMP].position().x + 70, textBoxes[TEMP].position().y + 12);

    text("%", textBoxes[RE].position().x + 70, textBoxes[RE].position().y + 12);

    text("nf = ", textBoxes[FOS].position().x - 40, textBoxes[FOS].position().y + 12);

    if (!isNaN(ny))
        text("ny = " + ny.toFixed(2), textBoxes[FOS].position().x - 40, textBoxes[FOS].position().y + 50);

    text("D/d = " , textBoxes[DD].position().x - 60, textBoxes[DD].position().y + 12)

    pop();
}

function setup(){
    frameRate(FPS);
    angleMode(DEGREES);

    if(navigator.userAgent.match(/iPhone|iPad|iPod|Android|webOs|BlackBerry|Windows Phone/i))
        pixelDensity(1);

    windowResized();
}

// continuous running loop
function draw(){
    background(220);
    staticSetup();

    if(d === undefined || prevd === undefined || abs((d - prevd) / prevd) > 0.001)
        calculate();

    sketchShaft();
}

function calculate(){

    if(d === undefined)
        iterationHistory = [];

    it = d === undefined ? 0 : it + 1;
    prevd = d === undefined ? undefined : d;

    let Kt = d === undefined ? (rd === 0.02 ?  2.7 : 1.7) : (at * rd ** bt);
    let Kts = d === undefined ? (rd === 0.02 ? 2.2 : 1.5) : (ats * rd ** bts);

    let T = dropdowns[UNITS].value() === "Metric" ? textBoxes[TEMP].value() * 9 / 5 + 32 : textBoxes[TEMP].value();

    let ka = (dropdowns[MATERIAL].value().includes("CD") ? 2.7 : 14.4) * Sut ** (dropdowns[MATERIAL].value().includes("CD") ? -0.265 : -0.718);
    let kb = (d === undefined ? 0.85 :
        d < 0.11 ? 1.11316580719 :
        d >= 0.11 && d <= 2 ? 0.879 * d ** -0.107 :
        d > 2 && d <= 10 ? 0.91 * d ** -0.157 :
        0.633930127841);
    let kc = 1;
    let kd = 0.975 + (0.432 * T * 10 ** -3) - (0.115 * T ** 2 * 10 ** -5) + (0.104 * T ** 3 * 10 ** -8) - (0.595 * T ** 4 * 10 ** -12);
    let ke = 1 - 0.08 * jStat.normal.inv(textBoxes[RE].value() / 100, 0, 1);
    let kf = 1;

    let Sep = Sut <= 200 ? 0.5 * Sut : 100;
    let Se = ka * kb * kc * kd * ke * kf * Sep;

    let a_sqrt = 0.246 - (3.08 * 10 ** -3 * Sut) + (1.51 * 10 ** -5 * Sut ** 2) - (2.67 * 10 ** -8 * Sut ** 3);
    let as_sqrt = 0.190 - (2.51 * 10 ** -3 * Sut) + (1.35 * 10 ** -5 * Sut ** 2) - (2.67 * 10 ** -8 * Sut ** 3);

    let r = d === undefined ? 0 : rd * d;
    let Kf = d === undefined ? Kt : 1 + (Kt - 1) / (1 + a_sqrt / sqrt(r));
    let Kfs = d === undefined ? Kts : 1 + (Kt - 1) / (1 + as_sqrt / sqrt(r));

    let Mm = textBoxes[MM].value() * momentC;
    let Ma = textBoxes[MA].value() * momentC;
    let Tm = textBoxes[TM].value() * momentC;
    let Ta = textBoxes[TA].value() * momentC;

    nf = textBoxes[FOS].value();
    d = de_goodman(Se, Mm, Ma, Tm, Ta, Kf, Kfs);
    if(d !== 0)
        iterationHistory[it] = (it + 1) + ". d = " + (d * lengthC).toFixed(3) + ' ' + lengthUnit +
        "  D = " + (Dd * d * lengthC).toFixed(3) + ' ' + lengthUnit +
        "  r = " + (rd * d * lengthC).toFixed(3) + ' ' + lengthUnit;

    let von_a = sqrt(sq((32 * Kf * Ma) / (PI * d ** 3)) + 3 * sq((16 * Kfs * Ta) / (PI * d ** 3)));
    let von_m = sqrt(sq((32 * Kf * Mm) / (PI * d ** 3)) + 3 * sq((16 * Kfs * Tm) / (PI * d ** 3)));
    ny = (Sy * 1000) / (von_a + von_m);

}

function de_goodman(Se, Mm, Ma, Tm, Ta, Kf, Kfs){
    return Math.pow((16 * nf / PI) *
        ((1 / (Se * 1000)) * sqrt(4 * (Kf * Ma) ** 2 + 3 * (Kfs * Ta) ** 2) +
        (1 / (Sut * 1000)) * sqrt(4 * (Kf * Mm) ** 2 + 3 * (Kfs * Tm) ** 2)), 1 / 3);
}


// draw the shaft
function sketchShaft(){

    push();

    noFill();
    stroke(0);
    translate(0.4 * (width - (L + l)), 0.42 * (height - sD));

    fill("#c6eafa");
    beginShape();
    vertex(0, 0);
    vertex(L, 0);
    vertex(L, 0.5 * (sD -sd));
    vertex(L + l, 0.5 * (sD - sd));
    vertex(L + l, 0.5 * (sD - sd) + sd);
    vertex(L, 0.5 * (sD - sd) + sd)
    vertex(L, sD);
    vertex(0, sD);
    endShape(CLOSE);

    noStroke();
    rect(L - 1, 0.5 * (sD - sd) - sr + 1, sr, sr);
    rect(L - 1, 0.5 * (sd - sD) + sD - 1, sr, sr);

    strokeWeight(1);
    stroke(0);
    fill(220);
    arc(L + sr, 0.5 * (sD - sd) - sr, 2 * sr, 2 * sr, 89, 181);
    arc(L + sr, 0.5 * (sd - sD) + sr + sD, 2 * sr, 2 * sr, 179, 271);

    if(iterationHistory.length > 0) {
        stroke(0);
        strokeWeight(1);
        line(L / 2, sD / 2 - 35, L / 2, 0);
        drawArrowHead(L / 2, 0, -90);

        line(L / 2, sD / 2 + 35, L / 2, sD);
        drawArrowHead(L / 2, sD, 90);

        line(L + l / 2, sD / 2 - 35, L + l / 2, (sD - sd) / 2);
        drawArrowHead(L + l / 2, (sD - sd) / 2, -90);

        line(L + l / 2, sD / 2 + 35, L + l / 2, sD - (sD - sd) / 2);
        drawArrowHead(L + l / 2, sD - (sD - sd) / 2, 90);

        line(L + sr, 0.5 * (sD - sd) - sr, L + sr + cos(135) * sr, 0.5 * (sD - sd) - sr + sin(135) * sr);
        drawArrowHead(L + sr + cos(135) * sr, 0.5 * (sD - sd) - sr + sin(135) * sr, 135)

        noStroke();
        fill(0);
        textSize(18);
        textAlign(CENTER, CENTER);
        text((d * lengthC).toFixed(2) + ' ' + lengthUnit, L + l / 2, sD / 2);
        text((d * Dd * lengthC).toFixed(2) + ' ' + lengthUnit, L / 2, sD / 2);
        text((d * rd * lengthC).toFixed(2) + ' ' + lengthUnit, L + sr + 30, 0);

        textAlign(LEFT);

        text("Iterations: ", L + l + 80, 100);

        for (let i = 0; i < iterationHistory.length; i++)
            text(iterationHistory[i], L + l + 80, 125 + i * 25);
    }

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
        d = undefined;
        prevd = undefined;
    });

    dropdowns[UNITS].option("Metric");
    dropdowns[UNITS].option("Imperial");

    dropdowns[UNITS].changed(() => {
       stressC = dropdowns[UNITS].value() === "Metric" ? 6.8947590 : 1;
       momentC = dropdowns[UNITS].value() === "Metric" ? 8.8507 : 1;
       lengthC = dropdowns[UNITS].value() === "Metric" ? 25.4 : 1;
       stressUnit = dropdowns[UNITS].value() === "Metric" ? "MPa" : "ksi";
       momentUnit = dropdowns[UNITS].value() === "Metric" ? "N-m" : "lb-in";
       temperatureUnit = dropdowns[UNITS].value() === "Metric" ? "°C" : "°F";
       lengthUnit = dropdowns[UNITS].value() === "Metric" ? "mm" : "in";
       textBoxes[TEMP].value((changedTemp ? textBoxes[TEMP].value : (dropdowns[UNITS].value() === "Metric" ? (textBoxes[TEMP].value() - 32) * 5 / 9: textBoxes[TEMP].value() * 9 / 5 + 32)).toFixed(1));
       d = undefined;
       prevd = undefined;
    });

    dropdowns[FILLET].option("well rounded");
    dropdowns[FILLET].option("sharp");
    rd = 0.1;

    dropdowns[FILLET].changed(() => {
        rd = dropdowns[FILLET].value() === "sharp" ? 0.02 : 0.1;
        d = undefined;
        prevd = undefined;
    });

    dropdowns[UNITS].position(width - 120, 40);
    dropdowns[MATERIAL].position(50, 40);
    dropdowns[FILLET].position(0.4 * (width - (L + l)) + L + sr, 0.42 * (height - sD) + 0.5 * (sd - sD) + sr + sD - 10);
}

function createTextBoxes(){
    for(const keys in textBoxesTypes)
        textBoxes.push(createInput().size(50, 16));

    textBoxes[MM].input(() => {
        d = undefined;
        prevd = undefined;
    });

    textBoxes[MA].input(() => {
        d = undefined;
        prevd = undefined;
    });

    textBoxes[TM].input(() => {
        d = undefined;
        prevd = undefined;
    });

    textBoxes[TA].input(() => {
        d = undefined;
        prevd = undefined;
    });

    textBoxes[TEMP].value(21.1);
    textBoxes[TEMP].input(() => {
       changedTemp = true;
       d = undefined;
       prevd = undefined;
    });

    textBoxes[RE].value(99.99);
    textBoxes[RE].input(() => {
       d = undefined;
       prevd = undefined;
    });

    textBoxes[FOS].value(1.5);
    textBoxes[FOS].input(() => {
        d = undefined;
        prevd = undefined;
    });

    let DdValues_t = [1.01, 1.02, 1.03, 1.05, 1.07, 1.10, 1.20, 1.50, 2, 3, 6];
    let aValues_t = [0.91938, 0.96048, 0.98061, 0.98137, 0.97527, 0.95120, 0.97098, 0.93836, 0.90879, 0.89334, 0.87868];
    let bValues_t = [-0.17032, -0.17711, -0.18381, -0.19653, -0.20958, -0.23757, -0.21796, -0.25759, -0.28598, -0.30860, -0.33243];

    let DdValues_ts = [1.09, 1.2, 1.33, 2];
    let aValues_ts = [0.90337, 0.83425, 0.84897, 0.86331];
    let bValues_ts = [-0.12692, -0.21649, -0.23161, -0.23865];

    at = spline(DdValues_t, aValues_t, Dd);
    bt = spline(DdValues_t, bValues_t, Dd);

    ats = spline(DdValues_ts, aValues_ts, Dd);
    bts = spline(DdValues_ts, bValues_ts, Dd);

    textBoxes[DD].value(1.2);
    textBoxes[DD].input(() => {
        Dd = textBoxes[DD].value();
        d = undefined;
        prevd = undefined;

        let DdValues_t = [1.01, 1.02, 1.03, 1.05, 1.07, 1.10, 1.20, 1.50, 2, 3, 6];
        let aValues_t = [0.91938, 0.96048, 0.98061, 0.98137, 0.97527, 0.95120, 0.97098, 0.93836, 0.90879, 0.89334, 0.87868];
        let bValues_t = [-0.17032, -0.17711, -0.18381, -0.19653, -0.20958, -0.23757, -0.21796, -0.25759, -0.28598, -0.30860, -0.33243];

        let DdValues_ts = [1.09, 1.2, 1.33, 2];
        let aValues_ts = [0.90337, 0.83425, 0.84897, 0.86331];
        let bValues_ts = [-0.12692, -0.21649, -0.23161, -0.23865];

        at = spline(DdValues_t, aValues_t, Dd);
        bt = spline(DdValues_t, bValues_t, Dd);

        ats = spline(DdValues_ts, aValues_ts, Dd);
        bts = spline(DdValues_ts, bValues_ts, Dd);
    });

    textBoxes[MM].position(0.32 * width, 0.75 * height);
    textBoxes[MA].position(0.32 * width + 230, 0.75 * height);
    textBoxes[TM].position(0.32 * width, 0.75 * height + 60);
    textBoxes[TA].position(0.32 * width + 230, 0.75 * height + 60);
    textBoxes[TEMP].position(width - 120, 85);
    textBoxes[RE].position(width - 120, 130);
    textBoxes[FOS].position(90, 80);
    textBoxes[DD].position(0.4 * (width - (L + l)) - 100, 0.42 * (height - sD) + sD / 2)
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

function drawArrowHead(x, y, theta){
    push();
    translate(x, y);
    rotate(theta);

    beginShape();
    noFill();

    vertex(-8, -5);
    vertex(0, 0);
    vertex(-8, 5);

    endShape();
    pop();
}

// cubic spline interpolation
function spline(xValues, yValues, x) {
    let n = xValues.length;
    if (n !== yValues.length) {
        throw new Error('xValues and yValues must have the same length');
    }

    let h = [];
    let alpha = [];
    for (let i = 0; i < n - 1; i++) {
        h.push(xValues[i + 1] - xValues[i]);
        alpha.push((3 / h[i]) * (yValues[i + 1] - yValues[i]) - (3 / h[i - 1]) * (yValues[i] - yValues[i - 1])); // Adjust indices
    }

    let l = [1];
    let mu = [0];
    let z = [0];

    for (let i = 1; i < n - 1; i++) {
        l.push(2 * (xValues[i + 1] - xValues[i - 1]) - h[i - 1] * mu[i - 1]);
        mu.push(h[i] / l[i]);
        z.push((alpha[i] - h[i - 1] * z[i - 1]) / l[i]);
    }

    l.push(1);
    z.push(0);
    let c = [];
    let b = [];
    let d = [];
    c[n - 1] = 0;
    for (let j = n - 2; j >= 0; j--) {
        c[j] = z[j] - mu[j] * c[j + 1];
        b[j] = (yValues[j + 1] - yValues[j]) / h[j] - h[j] * (c[j + 1] + 2 * c[j]) / 3;
        d[j] = (c[j + 1] - c[j]) / (3 * h[j]);
    }

    let i = 0;
    while (x > xValues[i + 1] && i < n - 1) {
        i++;
    }

    let dx = x - xValues[i];
    return yValues[i] + b[i] * dx + c[i] * dx ** 2 + d[i] * dx ** 3;
}