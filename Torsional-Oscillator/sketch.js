const FPS = 60;
let theta = 0;
let w = 0.1;

let kSlider;
let cSlider;
let iSlider;

let oscillator;

let origin = [];

let latexDiv;

function staticSetup(){
    push();
    textAlign(LEFT, TOP);

    textSize(18);
    text("Torsional Harmonic Oscillator", 20, 20);

    fill(100);
    textSize(16);
    let instructions = [
        'Slide k to change the torsion spring constant (N m / rad)',
        'Slide C to change the angular damping constant (kg m² / rad s)',
        'Slide I to change the moment of inertia (kg m²)'
    ];

    for(let i = 0; i < instructions.length; i++) {
        text(instructions[i], 20, 50 + 25 * i + 1);
    }

    textSize(15);
    text("k = " + kSlider.value(), kSlider.position().x - 55, kSlider.position().y);
    text("C = " + cSlider.value(), cSlider.position().x - 55, cSlider.position().y);
    text("I = " + iSlider.value(), iSlider.position().x - 55, iSlider.position().y);

    translate(origin[0], origin[1]);
    strokeWeight(1.4)
    line(0, 0, 0, -250);
    line(0, 0, 250, 0);

    textAlign(CENTER, CENTER);
    textSize(18);

    text("y", 0, -270);
    text("x", 265, 0);
    pop();
}

function setup(){
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
    frameRate(FPS);

    if(navigator.userAgent.match(/iPhone|iPad|iPod|Android|webOs|BlackBerry|Windows Phone/i))
        pixelDensity(1);

    origin = [250, height - 250]

    createUI();
    oscillator = new Oscillator(origin, 0);

    let x = origin[0] + 550;
    let y = 100;

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

    latexDiv = createDiv('1.- Solve for \\(\\alpha\\) using the previous eq.,');
    latexDiv.position(x + 200, y + 25);
    latexDiv.style('text-align', 'right');
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, latexDiv.elt]);

    latexDiv = createDiv('2.- Numerically integrate \\(\\alpha\\) to obtain \\(\\omega\\)');
    latexDiv.position(x + 200, y + 60);
    latexDiv.style('text-align', 'right');
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, latexDiv.elt]);

    latexDiv = createDiv('3.- Numerically integrate \\(\\omega\\) to obtain \\(\\theta\\)');
    latexDiv.position(x + 200, y + 95);
    latexDiv.style('text-align', 'right');
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, latexDiv.elt]);

}

function draw(){
    background(220);
    staticSetup();
    
    oscillator.display();

}

function createUI(){

    let x = 75;
    let y = 130;
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

}

class Oscillator{
    constructor(origin, theta0) {
        this.l = 200;
        this.theta = 100;
        this.w = 0;
        this.a = 0;

        this.k = kSlider.value();
        this.C = cSlider.value();
        this.I = iSlider.value();

        this.origin = origin;
        this.theta0 = theta0;
        this.values = [];
    }
    display(){

        this.updateValues();
        this.applyForce();

        push();

        translate(this.origin[0], this.origin[1]);
        rotate(this.theta0);
        strokeWeight(2);
        rotate(-this.theta);

        let t = 15

        line(0, -t, this.l, -t);
        line(0, t, this.l, t);

        noFill();
        arc(0, 0, 2 * t, 2 * t, 90, 270, OPEN);
        arc(this.l, 0, 2 * t, 2 * t, 270, 90, OPEN);
        circle(0, 0, 12);
        circle(this.l, 0, 12);

        pop();

        this.graph();

    }

    graph(){
        push();
        translate(this.origin[0], this.origin[1]);
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

    applyForce(){
        push();
        translate(this.origin[0], this.origin[1]);
        let desiredTheta = atan2(-mouseY + this.origin[1], mouseX - this.origin[0]);
        desiredTheta = desiredTheta < 0 ? desiredTheta + 360 : desiredTheta;

        let deltaPhase = desiredTheta - ((this.theta % 360) < 0 ? this.theta % 360 + 360 : this.theta % 360);

        if(abs(deltaPhase) > 180)
            deltaPhase += 360 * (deltaPhase > 0 ? -1 : 1);

        setLineDash([7, 7]);
        line(0, 0, 400 * cos(-desiredTheta), 400 * sin(-desiredTheta));

        textSize(15)
        textAlign(CENTER, CENTER);
        text(desiredTheta.toFixed(1) + '°', 60 * cos(-desiredTheta / 2), 60 * sin(-desiredTheta / 2));

        noFill();
        arc(0, 0, 65, 65, -desiredTheta, 0, OPEN);

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