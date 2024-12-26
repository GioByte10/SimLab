const FPS = 60;
let theta = 0;
let w = 0.1;

let kSlider;
let cSlider;
let iSlider;

let experimentalCheckbox;

let linkedRobot;

let origin = [];
let origin2 = [];

let latexDiv;

function staticSetup(){
    push();
    textAlign(LEFT, TOP);

    textSize(18);
    text("2-Link Robot", 20, 20);

    textSize(17);
    text("This robot follows a torsional harmonic oscillator motion profile", 20, 50);

    fill(100);
    textSize(16);
    let instructions = [
        'Slide k to change the torsion spring constant (N m / rad)',
        'Slide C to change the angular damping constant (kg m² / rad s)',
        'Slide I to change the moment of inertia (kg m²)'
    ];

    for(let i = 0; i < instructions.length; i++) {
        text(instructions[i], 20, 75 + 25 * i + 1);
    }

    textSize(15);
    text("k = " + kSlider.value(), kSlider.position().x - 55, kSlider.position().y);
    text("C = " + cSlider.value(), cSlider.position().x - 55, cSlider.position().y);
    text("I = " + iSlider.value(), iSlider.position().x - 55, iSlider.position().y);

    pop();

    push();
    translate(origin[0], origin[1]);
    strokeWeight(1.4)
    line(0, 0, 0, -250);
    line(0, 0, 250, 0);

    textAlign(CENTER, CENTER);
    textSize(18);

    text("y", 0, -270);
    text("x", 265, 0);
    pop();

    push();
    translate(origin2[0], origin2[1]);
    strokeWeight(1.4)
    line(0, 0, 0, -250);
    line(0, 0, 250, 0);

    textAlign(CENTER, CENTER);
    textSize(18);

    pop();
}

function setup(){
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
    frameRate(FPS);

    if(navigator.userAgent.match(/iPhone|iPad|iPod|Android|webOs|BlackBerry|Windows Phone/i))
        pixelDensity(1);

    origin = [250, height - 250];
    origin2 = [origin[0] + 600, height - 250];

    createUI();
    linkedRobot = new LinkedRobot(origin, 0);

    let x = origin[0] + 350;
    let y = 20;

    latexDiv = createDiv('$$I\\frac{d^{2}\\theta}{dt^{2}}+C\\frac{d\\theta}{dt}+k\\theta=0$$');
    latexDiv.position(x, y);
    latexDiv.style('text-align', 'right');
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, latexDiv.elt]);

    latexDiv = createDiv('$$\\frac{d^{2}\\theta}{dt^{2}}=-\\frac{C}{I}\\frac{d\\theta}{dt}-\\frac{k}{I}\\theta$$');
    latexDiv.position(x, y + 60);
    latexDiv.style('text-align', 'right');
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, latexDiv.elt]);

    latexDiv = createDiv('$$\\alpha=-\\frac{C}{I}\\omega-\\frac{k}{I}\\theta$$');
    latexDiv.position(x, y + 120);
    latexDiv.style('text-align', 'right');
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, latexDiv.elt]);

    // latexDiv = createDiv('1.- Solve for \\(\\alpha\\) using the previous eq.,');
    // latexDiv.position(x + 200, y + 25);
    // latexDiv.style('text-align', 'right');
    // MathJax.Hub.Queue(["Typeset", MathJax.Hub, latexDiv.elt]);
    //
    // latexDiv = createDiv('2.- Numerically integrate \\(\\alpha\\) to obtain \\(\\omega\\)');
    // latexDiv.position(x + 200, y + 60);
    // latexDiv.style('text-align', 'right');
    // MathJax.Hub.Queue(["Typeset", MathJax.Hub, latexDiv.elt]);
    //
    // latexDiv = createDiv('3.- Numerically integrate \\(\\omega\\) to obtain \\(\\theta\\)');
    // latexDiv.position(x + 200, y + 95);
    // latexDiv.style('text-align', 'right');
    // MathJax.Hub.Queue(["Typeset", MathJax.Hub, latexDiv.elt]);

    x = width - 550;

    latexDiv = createDiv('Using law of Cosines:');
    latexDiv.position(x, y + 10);
    latexDiv.style('text-align', 'right');
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, latexDiv.elt]);

    latexDiv = createDiv('$$r^{2}=x^{2}+y^{2}$$');
    latexDiv.position(x, y + 35);
    latexDiv.style('text-align', 'right');
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, latexDiv.elt]);

    latexDiv = createDiv('$$r^{2}=l_{1}^{2}+l_{2}^{2}-2l_{1}l_{2}\\cos\\left(\\phi\\right)$$');
    latexDiv.position(x, y + 70);
    latexDiv.style('text-align', 'right');
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, latexDiv.elt]);

    latexDiv = createDiv('$$\\cos\\left(\\phi\\right)=\\frac{l_{1}^{2}+l_{2}^{2}-\\left(x^{2}+y^{2}\\right)}{2l_{1}l_{2}}$$');
    latexDiv.position(x, y + 105);
    latexDiv.style('text-align', 'right');
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, latexDiv.elt]);

    latexDiv = createDiv('$$\\cos\\left(\\theta_{2}\\right)=-\\cos\\left(\\phi\\right)$$');
    latexDiv.position(x, y + 165);
    latexDiv.style('text-align', 'right');
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, latexDiv.elt]);

    latexDiv = createDiv('$$\\theta_{1}=\\gamma-\\beta$$');
    latexDiv.position(x + 260, y + 35);
    latexDiv.style('text-align', 'right');
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, latexDiv.elt]);

    latexDiv = createDiv('$$\\gamma=\\tan^{-1}\\left(\\frac{y}{x}\\right)$$');
    latexDiv.position(x + 260, y + 70);
    latexDiv.style('text-align', 'right');
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, latexDiv.elt]);

    latexDiv = createDiv('$$\\beta=\\tan^{-1}\\left(\\frac{l_{2}\\sin\\left(\\theta_{2}\\right)}{l_{1}+l_{2}\\cos\\left(\\theta_{2}\\right)}\\right)$$');
    latexDiv.position(x + 260, y + 120);
    latexDiv.style('text-align', 'right');
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, latexDiv.elt]);

}

function draw(){
    background(220);
    staticSetup();

    linkedRobot.display();

}

function createUI(){

    let x = 75;
    let y = 155;
    kSlider = createSlider(0, 100, 10);
    kSlider.position(x, y);
    kSlider.size(100);

    kSlider.style('-webkit-appearance', 'none');
    kSlider.style('opacity', '0.4');

    cSlider = createSlider(0, 100, 4);
    cSlider.position(x, y + 20);
    cSlider.size(100);

    cSlider.style('-webkit-appearance', 'none');
    cSlider.style('opacity', '0.4');

    iSlider = createSlider(1, 100, 4);
    iSlider.position(x, y + 40);
    iSlider.size(100);

    iSlider.style('-webkit-appearance', 'none');
    iSlider.style('opacity', '0.4');

    experimentalCheckbox = createCheckbox("Experimental motion", false);
    experimentalCheckbox.position(x - 60, y + 60);

    experimentalCheckbox.style('-webkit-appearance', 'none');
    experimentalCheckbox.style('opacity', '0.4');

}

class LinkedRobot{
    constructor() {
        this.link1 = new Oscillator(250);
        this.link2 = new Oscillator(200);
    }

    // https://robotacademy.net.au/lesson/inverse-kinematics-for-a-2-joint-robot-arm-using-geometry/
    display(){

        let l1 = this.link1.l;
        let l2 = this.link2.l;
        let [r, theta, theta1, theta2] = this.calculateAngles(l1, l2);

        push();

        translate(origin[0], origin[1]);

        push();
        this.link1.display(-theta1);
        this.link2.display(-theta2);
        pop();

        textAlign(CENTER, CENTER);
        textSize(20);
        text("l₁", l1 / 2 * cos(this.link1.theta) - 45 * sin(-this.link1.theta), l1 / 2 * sin(-this.link1.theta) + 45 * cos(this.link1.theta));
        text("l₂", l1 * cos(this.link1.theta) + l2 / 2 * cos(this.link1.theta + this.link2.theta) - 45 * sin(-this.link1.theta -this.link2.theta),
            l1 * sin(-this.link1.theta) + l2 / 2 * sin(- this.link1.theta -this.link2.theta) + 45 * cos(this.link1.theta +this.link2.theta));

        this.drawAngles(r, l1, l2, theta, theta1, theta2);

        pop();

        this.drawSketch(l1, l2);

    }

    calculateAngles(l1, l2){
        let r = constrain(sqrt(sq(mouseX - origin[0]) + sq(mouseY - origin[1])), l1 - l2, l1 + l2);
        let theta = atan2(mouseY - origin[1], mouseX - origin[0]);
        let theta2 = acos((sq(r) - sq(l1) - sq(l2)) / (2 * l1 * l2));

        // console.log("theta: " + theta2);
        // console.log("theta2: " + this.link2.theta);
        // console.log("1st: " + abs(theta2 - this.link2.theta % 360));
        // console.log("2nd: " + abs(-theta2 - this.link2.theta % 360))

        // let posAng = this.link2.theta % 360;
        // posAng += (posAng < 0 ? 360 : 0);
        //
        // //console.log(posAng + " " + theta2);

        //console.log(theta2 - posAng);

        console.log(this.link2.theta);

        if(experimentalCheckbox.checked()) {
            let p = this.link2.theta % 360;

            if (p < -180)
                p += 360;

            else if (p > 180)
                p -= 360;

            if (abs(theta2 - p) < abs(-theta2 - p))
                theta2 *= -1;
        }

        else{
            if(abs(theta2 - this.link2.theta) < abs(-theta2 - this.link2.theta))
                theta2 *= -1;
        }

        theta2 = theta2 > 0 ? theta2 - 360 : theta2;

        let theta1 = theta - atan((l2 * sin(theta2)) / (l1 + l2 * cos(theta2)));
        theta1 = theta1 > 0 ? theta1 - 360 : theta1;

        return [r, theta, theta1, theta2];
    }

    drawAngles(r, l1, l2, theta, theta1, theta2){
        push();
        strokeWeight(2);
        setLineDash([7, 7]);
        line(0, 0, 1.3 * l1 * cos(theta1), 1.3 * l1 * sin(theta1));
        line(l1 * cos(theta1), l1 * sin(theta1), r * cos(theta), r * sin(theta));

        textAlign(CENTER, CENTER);
        textSize(15)
        text(-theta1.toFixed(1) + '°', 60 * cos(theta1 / 2), 60 * sin(theta1 / 2));
        text(-theta2.toFixed(1) + '°', l1 * cos(theta1) + 60 * cos(theta1 + theta2 / 2), l1 * sin(theta1) + 60 * sin(theta1 + theta2 / 2));

        noFill();
        arc(0, 0, 65, 65, theta1, 0, OPEN);
        arc(l1 * cos(theta1), l1 * sin(theta1), 65, 65, theta2 + theta1, theta1, OPEN);
        pop();
    }

    drawSketch(l1, l2){

        let theta1 = -this.link1.theta;
        let theta2 = -this.link2.theta;
        let theta = atan2(l1 * sin(theta1) + l2 * sin(theta1 + theta2), l1 * cos(theta1) + l2 * cos(theta1 + theta2));
        theta = theta > 0 ? theta - 360 : theta;

        let r = sqrt(sq(l1 * cos(theta1) + l2 * cos(theta1 + theta2)) + sq(l1 * sin(theta1) + l2 * sin(theta1 + theta2)))

        push();
        translate(origin2[0], origin2[1]);

        strokeWeight(2);
        textAlign(CENTER, CENTER);
        textSize(20);

        line(0, 0, r * cos(theta), r * sin(theta));
        line(0, 0, r * cos(theta), 0);
        line(r * cos(theta), 0, r * cos(theta), r * sin(theta));

        text("x", (r * cos(theta)) / 2, -20 * Math.sign(sin(theta)));
        text("y", r * cos(theta) + 20 * Math.sign(cos(theta)), (r * sin(theta)) / 2);
        text("r", (r / 2) * cos(theta) - 20 * Math.sign(cos(theta)), (r / 2) * sin(theta) + 20 * Math.sign(sin(theta)));

        fill('#427ef5');
        text("l₁", l1 / 2 * cos(theta1) - 15 * sin(theta1) * -Math.sign(theta2), l1 / 2 * sin(theta1) + 15 * cos(theta1) * -Math.sign(theta2));

        fill('#2ba100');
        text("l₂", l1 * cos(theta1) + l2 / 2 * cos(theta1 + theta2) - 15 * sin(theta1 + theta2) * -Math.sign(theta2),
            l1 * sin(theta1) + l2 / 2 * sin(theta1 + theta2) + 15 * cos(theta1 + theta2) * - Math.sign(theta2));

        let deltaPhase = theta - ((theta1 % 360) < 0 ? theta1 % 360 + 360 : theta1 % 360);

        if(abs(deltaPhase) > 180)
            deltaPhase -= 360 * (deltaPhase > 0 ? -1 : 1);

        let b = 40
        textSize(17);
        fill(0);
        text("ɣ", 100 * cos(theta / 2), 100 * sin(theta / 2));

        fill('#8f6593');
        text("θ₁", b * cos(theta1 % 360 / 2) , b * sin(theta1 % 360 / 2));

        fill('#A77E58')
        text("β", b * cos(theta1 + (deltaPhase) / 2) * -Math.sign(theta2) , b * sin(theta1 + (deltaPhase) / 2) * -Math.sign(theta2));

        fill('#44001A');
        text("θ₂",l1 * cos(theta1) + b * cos(theta1 + theta2 / 2) * -Math.sign(theta2), l1 * sin(theta1) + b * sin(theta1 + theta2 / 2) * -Math.sign(theta2));

        fill('#F93943');
        text("Φ", l1 * cos(theta1) + b * cos(theta1 + theta2 + (-180 - theta2) / 2), l1 * sin(theta1) + b * sin(theta1 + theta2 + (-180 - theta2) / 2));

        noFill();
        stroke('#427ef5');
        line(0, 0, l1 * cos(theta1), l1 * sin(theta1));

        stroke('#2ba100');
        line(l1 * cos(theta1), l1 * sin(theta1), l1 * cos(theta1) + l2 * cos(theta1 + theta2), l1 * sin(theta1) + l2 * sin(theta1 + theta2));

        let a = 120;
        stroke(0);
        arc(0, 0, a + 35, a + 35, theta, 0, OPEN);

        stroke('#8f6593');
        arc(0, 0, a + 15, a + 15, theta1, 0, OPEN);

        stroke('#A77E58');
        arc(0, 0, a, a, theta, theta1, OPEN);

        stroke('#44001A');
        arc(l1 * cos(theta1), l1 * sin(theta1), a + 15, a + 15, theta1 + theta2, theta1, OPEN);

        stroke('#F93943');
        arc(l1 * cos(theta1), l1 * sin(theta1), a, a, 180 + theta1, theta1 + theta2, OPEN);

        stroke(0);
        setLineDash([7, 7]);
        line(l1 * cos(theta1), l1 * sin(theta1), max((l1 + l2 * cos(theta2)), l1 + a / 2) * cos(theta1), max((l1 + l2 * cos(theta2)), l1 + a / 2) * sin(theta1));
        line((l1 + l2 * cos(theta2)) * cos(theta1), (l1 + l2 * cos(theta2)) * sin(theta1), r * cos(theta), r * sin(theta))

        pop();
    }

}

class Oscillator{
    constructor(l) {
        this.l = l;
        this.theta = 45;
        this.w = 0;
        this.a = 0;

        this.k = kSlider.value();
        this.C = cSlider.value();
        this.I = iSlider.value();

        this.values = [];
    }

    display(desiredTheta){

        fill(0);
        strokeWeight(2);

        this.updateValues();
        this.applyForce(desiredTheta);

        rotate(-this.theta);

        let t = 20;
        line(0, -t, this.l, -t);
        line(0, t, this.l, t);

        noFill();
        arc(0, 0, 2 * t, 2 * t, 90, 270, OPEN);
        arc(this.l, 0, 2 * t, 2 * t, 270, 90, OPEN);
        circle(0, 0, 12);
        circle(this.l, 0, 12);

        translate(this.l, 0);
    }

    graph(){
        push();
        this.values.push(this.theta / 2)

        if(this.values.length > 700)
            this.values.shift();

        let desiredTheta = atan2(-mouseY + this.origin[1], mouseX - this.origin[0]);
        desiredTheta = desiredTheta < 0 ? desiredTheta + 360 : desiredTheta;

        push();
        setLineDash([7, 7]);
        line(500,  -desiredTheta / 2, 500 + this.values.length, -desiredTheta / 2);
        pop();

        noFill();
        beginShape()
        for(let i = 0; i < this.values.length; i++){
            vertex(500 + i, -this.values[i]);
        }

        endShape();
        pop();
    }

    applyForce(desiredTheta){
        push();

        let deltaPhase = desiredTheta - ((this.theta % 360) < 0 ? this.theta % 360 + 360 : this.theta % 360);

        if(abs(deltaPhase) > 180)
            deltaPhase += 360 * (deltaPhase > 0 ? -1 : 1);

        fill(0);
        textSize(15)
        textAlign(CENTER, CENTER);

        this.a = -(this.C / this.I) * this.w - (this.k / this.I) * (-deltaPhase);
        this.w += this.a * 0.05;
        this.theta += this.w * 0.05;

        pop();
    }

    updateValues(){
        this.k = kSlider.value();
        this.C = cSlider.value();
        this.I = iSlider.value();
    }
}

function setLineDash(list) {
    drawingContext.setLineDash(list);
}