const FPS = 60;
let slice;

function setup(){
    createCanvas(windowWidth, windowHeight);
    frameRate(FPS);
    angleMode(DEGREES);

    if(navigator.userAgent.match(/iPhone|iPad|iPod|Android|webOs|BlackBerry|Windows Phone/i))
        pixelDensity(1);

    slice = new CircleSlice(200, 20 * 10 ** -3, 300, 300);

}

function draw(){
    background(220);

    slice.display();
}

function parseUnits(input, unitStr) {
    const regex = new RegExp(`^(-?\\d*\\.?\\d*)\\s*([u|m|k|M]?${unitStr})?$`);
    const match = input.match(regex);

    if (match) {
        const value = parseFloat(match[1]);
        const unit = match[2];

        if(isNaN(value))
            return 0;

        switch (unit) {
            case 'u' + unitStr:
                return value * 1e-6;
            case 'm'  + unitStr:
                return value * 1e-3;
            case unitStr:
                return value;
            case 'k' + unitStr:
                return value * 1e3;
            case 'M' + unitStr:
                return value * 1e6;
            default:
                return value;
        }

    } else {
        return 0;
    }
}

class CircleSlice{
    constructor(virtualRadius, radius, x, y, ) {
        this.virtualRadius = virtualRadius;
        this.radius = radius;

        this.area = PI * radius ** 2;
        this.J = (PI * radius ** 4) / 2;
        this.I = this.J / 2;

        this.offset = 45;

        this.x = x;
        this.y = y;

        this.normal = 0;
        this.shearX = 0;
        this.shearY = 0;

        this.torque = 0;
        this.momentX = 0;
        this.momentY = 0;

        this.createDropdowns();
        this.createTextBoxes();

    }

    display(){
        let horizontalPos = this.virtualRadius + this.offset;

        this.staticSetup(horizontalPos);
        this.runDropdowns(horizontalPos);
        this.runTextBoxes();
        this.realTimeStress();
        this.displayVectors();

        //text(this.normal + ' ' + this.momentY, 500, 500);
    }

    displayVectors(){

        let maxForce = max(abs(this.shearX), abs(this.shearY), abs(this.momentX), abs(this.momentY));
        let m = (this.virtualRadius - 30) / maxForce;

        const axisM = {
            'x': 1,
            'z': -1
        };

        if(this.normal !== 0) {
            push();
            translate(this.x, this.y);

            noFill();
            strokeWeight(1.5);
            circle(0, 0, 16);

            fill(0);

            if(this.normal > 0)
                circle(0, 0, 6);
            else{
                rotate(45);
                line(-7.5, 0, 7.5, 0);

                rotate(-90)
                line(-7.5, 0, 7.5, 0);
            }

            pop();
        }

        this.shearX && this.displayVector(createVector(constrain(abs(this.shearX * m), 30, Infinity) * abs(this.shearX) / this.shearX * axisM[this.dropX.value()], 0), false);
        this.shearY && this.displayVector(createVector(0, -constrain(abs(this.shearY * m), 30, Infinity) * abs(this.shearY) / this.shearY), false);
        this.momentX && this.displayVector(createVector(constrain(abs(this.momentX * m), 30, Infinity) * abs(this.momentX) / this.momentX * axisM[this.dropX.value()], 0), true);
        this.momentY && this.displayVector(createVector(0, -constrain(abs(this.momentY * m), 30, Infinity) * abs(this.momentY) / this.momentY), true);



    }

    displayVector(vector, isMoment){
        push();
        strokeWeight(2);
        fill(0)
        line(this.x, this.y, this.x + vector.x, this.y + vector.y);
        translate(this.x + vector.x, this.y + vector.y);
        rotate(vector.heading());

        beginShape();
        noFill();

        vertex(-9, -5);
        vertex(0, 0);
        vertex(-9, 5);

        endShape();
        pop();

        if(isMoment){
            push();
            strokeWeight(2);
            fill(0);
            let dR = vector.copy().setMag(9);
            translate(this.x + vector.x - dR.x, this.y + vector.y - dR.y);

            rotate(vector.heading());

            beginShape();
            noFill();

            vertex(-8, -5);
            vertex(0, 0);
            vertex(-8, 5);

            endShape();
            pop();
        }
    }

    staticSetup(horizontalPos){
        noFill();
        circle(50, 50, 15);

        fill(0);
        circle(50, 50, 5);

        textSize(20);
        textAlign(CENTER, CENTER);
        text(this.dropZ.value(), 65, 65);

        push();

        fill(170);
        translate(this.x, this.y);
        circle(0, 0, this.virtualRadius * 2);

        line(0, 0, this.dropX.value() === 'x' ? horizontalPos : -horizontalPos,0)
        line(0, 0, 0, -(this.virtualRadius + this.offset));

        fill(0);
        textSize(20);

        horizontalPos += 9;
        textAlign(this.dropX.value() === 'x' ? LEFT : RIGHT, CENTER);
        text(this.dropX.value(), this.dropX.value() === 'x' ? horizontalPos : -horizontalPos, 0);

        textAlign(CENTER, BOTTOM);
        text("y", 0, -(this.virtualRadius + this.offset + 9));

        pop();
    }

    realTimeStress(){
        if(dist(mouseX, mouseY, this.x, this.y) <= this.virtualRadius) {
            let x = (mouseX - this.x) * 1.03;
            let y = (this.y - mouseY) * 1.03;

            x = constrain(x, -this.virtualRadius, this.virtualRadius);
            y = constrain(y, -this.virtualRadius, this.virtualRadius);

            x = x * this.radius / this.virtualRadius;
            y = y * this.radius / this.virtualRadius;

            const axisM = {
                'x': 1,
                'z': -1
            };

            let sigmaZ = (this.normal / this.area) + (this.momentX * y * axisM[this.dropX.value()] / this.I) - (this.momentY * x / this.I);
            fill(0);
            text("σz(" + x + ", " + y + ") = " + sigmaZ, 800, 700);
        }
    }

    runDropdowns(horizontalPos){
        this.dropZ.position(55, 55);
        this.dropX.position(this.x + (this.dropX.value() === 'x' ? horizontalPos : -(horizontalPos + 25)), this.y - 9);
    }

    runTextBoxes(){
        push();

        fill(0);
        textAlign(LEFT, CENTER);
        textSize(20);

        text("N", this.dropNormal.position().x - 35, this.dropNormal.position().y + 13);
        text("V" + this.dropX.value(), this.dropShearX.position().x - 35, this.dropShearX.position().y + 13);
        text("Vy", this.dropShearY.position().x - 35, this.dropShearY.position().y + 13);

        text("T", this.dropTorque.position().x - 35, this.dropTorque.position().y + 13);
        text("M" + this.dropX.value(), this.dropMomentX.position().x - 35, this.dropMomentX.position().y + 13);
        text("My", this.dropMomentY.position().x - 35, this.dropMomentY.position().y + 13);

        this.normal = parseUnits(this.dropNormal.value(), 'N');
        this.shearX = parseUnits(this.dropShearX.value(), 'N');
        this.shearY = parseUnits(this.dropShearY.value(), 'N');

        this.torque = parseUnits(this.dropTorque.value(), "Nm");
        this.momentX = parseUnits(this.dropMomentX.value(), "Nm");
        this.momentY = parseUnits(this.dropMomentY.value(), "Nm");

        pop();
    }

    createTextBoxes(){
        this.dropNormal = createInput();
        this.dropShearX = createInput();
        this.dropShearY = createInput();

        this.dropTorque = createInput();
        this.dropMomentX = createInput();
        this.dropMomentY = createInput();

        let boxes = [this.dropMomentY, this.dropMomentX, this.dropTorque, this.dropShearY, this.dropShearX, this.dropNormal];

        let i;
        for(i = 0; i < 3; i++){
            boxes[i].size(70, 20);
            boxes[i].position(250, windowHeight - 40 * i - 60);
        }

        for(; i < boxes.length; i++){
            boxes[i].size(70, 20);
            boxes[i].position(100, windowHeight - 40 * (i - 3) - 60);
        }
    }

    createDropdowns(){
        this.dropZ = createSelect();
        this.dropX = createSelect();

        this.dropZ.changed(() => {
            if (this.dropZ.value()) {
                this.dropX.value(this.dropZ.value() === 'x' ? 'z' : 'x');
            }
        });

        this.dropZ.option('z');
        this.dropZ.option('x');
        this.dropZ.style('opacity', 0);
        this.dropZ.mouseOver(() => {
            this.dropZ.style('opacity', 1); // Fully visible (no transparency)
        });

        this.dropZ.mouseOut(() => {
            this.dropZ.style('opacity', 0); // Fully transparent
        });

        this.dropX.changed(() => {
            if (this.dropX.value()) {
                this.dropZ.value(this.dropX.value() === 'x' ? 'z' : 'x');
            }
        });

        this.dropX.option('x');
        this.dropX.option('z');
        this.dropX.style('opacity', 0);
        this.dropX.mouseOver(() => {
            this.dropX.style('opacity', 1); // Fully visible (no transparency)
        });

        this.dropX.mouseOut(() => {
            this.dropX.style('opacity', 0); // Fully transparent
        });
    }
}