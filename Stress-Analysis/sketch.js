const FPS = 60;
let slice;

let dropNormal;
let dropShearX;
let dropShearY;

let dropTorque;
let dropMomentX;
let dropMomentY;

function setup(){
    createCanvas(windowWidth, windowHeight);
    frameRate(FPS);
    angleMode(DEGREES);

    if(navigator.userAgent.match(/iPhone|iPad|iPod|Android|webOs|BlackBerry|Windows Phone/i))
        pixelDensity(1);

    slice = new CircleSlice(200,0.01, 260, 260);
    createTextBoxes();

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
    }
    return 0;
}

function addPrefix(value, unitStr, fix){
    if(value !== 0) {
        const prefixes = ['n', 'u', 'm', '', 'k', 'M', 'G'];
        let magnitude = 3;

        while (abs(value) >= 1000 && magnitude < prefixes.length - 1) {
            value /= 1000;
            magnitude++;
        }
        while (abs(value) < 1 && magnitude > 0) {
            value *= 1000;
            magnitude--;
        }

        if (abs(value) > 1)
            value = value.toFixed(fix);

        return value.toString() + ' ' + prefixes[magnitude] + unitStr;
    }

    return "0";
}

function createTextBoxes(){
    dropNormal = createInput();
    dropShearX = createInput();
    dropShearY = createInput();

    dropTorque = createInput();
    dropMomentX = createInput();
    dropMomentY = createInput();

    // dropNormal.input(() => {
    //     slice.normalGradient();
    // })

    let boxes = [dropMomentY, dropMomentX, dropTorque, dropShearY, dropShearX, dropNormal];

    for(let i = 0; i < 3; i++){
        boxes[i].size(70, 20);
        boxes[i].position(260, windowHeight - 40 * i - 60);
    }

    for(let i = 3; i < boxes.length; i++){
        boxes[i].size(70, 20);
        boxes[i].position(110, windowHeight - 40 * (i - 3) - 60);
    }
}

class CircleSlice{
    constructor(virtualRadius, radius, x, y, ) {
        this.virtualRadius = virtualRadius;
        this.calculateArea(radius.toString());

        this.offset = 20;

        this.x = x;
        this.y = y;

        this.maxNormal = 0;

        this.normal = 0;
        this.shearX = 0;
        this.shearY = 0;

        this.torque = 0;
        this.momentX = 0;
        this.momentY = 0;

        this.createDropdowns();
        this.createTextBox();

    }

    display(){
        let horizontalPos = this.virtualRadius + this.offset;

        this.staticSetup(horizontalPos);
        this.runDropdowns(horizontalPos);
        this.runTextBoxes();
        this.realTimeStress();
        this.displayVectors();
        this.graphMoment(this.momentX, this.dropX.value() === 'x' ? "Mx" : "Mz", this.momentX > 0, 0);
        this.graphMoment(this.momentY, "My", this.momentY < 0, 90);
        //this.normalGradient();

    }

    normalGradient(){
        push();
        translate(this.x, this.y);

        for(let vx = -this.virtualRadius; vx <= this.virtualRadius; vx++){
            for(let vy = -this.virtualRadius; vy <= this.virtualRadius; vy++){
                if(dist(0, 0, vx, vy) <= this.virtualRadius) {
                    //console.time("math");
                    let x = vx * this.radius / this.virtualRadius;
                    let y = vy * this.radius / this.virtualRadius;

                    let stress = this.calculateStress(x, y);

                    if(abs(stress) > abs(this.maxNormal))
                        this.maxNormal = stress;

                    //console.timeEnd("math");

                    //console.time("colors");
                    let colorValue = map(stress, -abs(this.maxNormal), abs(this.maxNormal), 0, 1);
                    //let pixelColor = lerpColor(color('blue'), color('red'), colorValue);

                    //set(this.x + vx, this.y + vy, pixelColor);
                    //console.timeEnd("colors");
                }
            }
        }

        updatePixels();

        pop();

    }

    displayVectors(){

        let maxForce = max(abs(this.shearX), abs(this.shearY), abs(this.momentX), abs(this.momentY));
        let m = (this.virtualRadius - 30) / maxForce;
        let start = createVector(this.x, this.y);

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

        if(this.torque !== 0){
            push();
            translate(this.x, this.y);

            let r = this.virtualRadius + 30;
            let n = 5.5;
            let theta = (90 -  360 / n) / 2;

            noFill()
            arc(0, 0, 2 * r, 2 * r, theta, theta + 360 / n);
            pop();

            theta += (360 / n) * (this.torque < 0);


            this.drawArrowHead(createVector(this.x, this.y), createVector(r * cos(theta), r * sin(theta)), -90 * Math.sign(this.torque));
        }


        this.shearX && this.displayVector(start, createVector(constrain(abs(this.shearX * m), 30, Infinity) * abs(this.shearX) / this.shearX, 0), false);
        this.shearY && this.displayVector(start, createVector(0, -constrain(abs(this.shearY * m), 30, Infinity) * abs(this.shearY) / this.shearY), false);
        this.momentX && this.displayVector(start, createVector(constrain(abs(this.momentX * m), 30, Infinity) * abs(this.momentX) / this.momentX, 0), true);
        this.momentY && this.displayVector(start, createVector(0, -constrain(abs(this.momentY * m), 30, Infinity) * abs(this.momentY) / this.momentY), true);

    }

    displayVector(start, vector, isMoment, strokeWeight_ = 2, color_ = color(0, 0, 0)){
        push();
        strokeWeight(strokeWeight_);
        stroke(color_);

        line(start.x, start.y, start.x + vector.x, start.y + vector.y);
        this.drawArrowHead(start, vector);
        isMoment ? this.drawArrowHead(start, vector.sub(vector.copy().setMag(9))) : null;
        pop();
    }

    drawArrowHead(start, vector, offsetAngle = 0){
        push();
        translate(start.x + vector.x, start.y + vector.y);
        rotate(vector.heading() + offsetAngle);

        beginShape();
        noFill();

        vertex(-8, -5);
        vertex(0, 0);
        vertex(-8, 5);

        endShape();
        pop();
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

        push();
        translate(this.x, this.y + this.virtualRadius + 45);
        line(-this.virtualRadius, -8, -this.virtualRadius, 8);
        line(this.virtualRadius, -8, this.virtualRadius, 8);

        line(-this.virtualRadius, 0, -65, 0);
        line(65, 0, this.virtualRadius, 0);

        textAlign(CENTER, CENTER);
        text(addPrefix(this.radius, "m", 2), 0, 0);
        pop();
    }

    graphMoment(moment, name, tensile, offset){
        if(moment) {
            push();
            let n = 10;
            let dy = 2 * this.virtualRadius / (n - 1)
            let dx = 2 * (this.virtualRadius / (n - 1)) * (200 / this.virtualRadius);
            let b = 200;

            translate(this.x, this.y);
            rotate(offset);

            translate(this.virtualRadius + this.offset + 70, 0);
            line(0, -this.virtualRadius, 0, this.virtualRadius);
            line(0, -this.virtualRadius, 200, -this.virtualRadius);
            line(0, this.virtualRadius, 200, this.virtualRadius)
            line(0, 0, 200, -this.virtualRadius);
            line(0, 0, 200, this.virtualRadius);

            push();
            setLineDash([10, 10]);
            line(0, -this.virtualRadius, -(this.virtualRadius + this.offset + 70), -this.virtualRadius);
            //line(0, 0, -(this.virtualRadius + this.offset + 70), 0);
            line(0, this.virtualRadius, -(this.virtualRadius + this.offset + 70), this.virtualRadius);
            pop();

            for (let i = 0; i < n / 2; i++) {
                let start = createVector(tensile ? 0 : (b - i * 2 * (this.virtualRadius / (n - 1)) * (b / this.virtualRadius)), -this.virtualRadius + dy * i);
                this.displayVector(start, createVector((tensile ? 1 : -1) * (b - i * dx), 0), false, 2.5, tensile ? color(70, 110, 160) : color(160, 70, 70));
            }

            for (let i = n / 2; i < n; i++) {
                let start = createVector(tensile ? -(b - i * 2 * (this.virtualRadius / (n - 1)) * (b / this.virtualRadius)) : 0, -this.virtualRadius + dy * i);
                this.displayVector(start, createVector((tensile ? 1 : -1) * (b - i * dx), 0), false, 2.5, tensile? color(160, 70, 70) : color(70, 110, 160));
            }

            textAlign(LEFT);
            text("σzₘ(" + name + ") = " + addPrefix(abs(moment * this.radius / this.I), "Pa", 3), 0, -25 - this.virtualRadius);

            pop()
        }
    }

    realTimeStress(){
        if(dist(mouseX, mouseY, this.x, this.y) <= this.virtualRadius) {
            let x = (mouseX - this.x) * 1.05;
            let y = (this.y - mouseY) * 1.05;

            x = constrain(x, -this.virtualRadius, this.virtualRadius);
            y = constrain(y, -this.virtualRadius, this.virtualRadius);

            x = x * this.radius / this.virtualRadius;
            y = y * this.radius / this.virtualRadius;

            this.calculateStress(x, y);

        }
    }

    calculateStress(x, y){
        let sigmaZ_normal = (this.normal / this.area);
        let sigmaZ_momentX = (this.momentX * y / this.I);
        let sigmaZ_momentY = - (this.momentY * x / this.I);

        let sigmaZ = sigmaZ_normal + sigmaZ_momentX + sigmaZ_momentY;

        push();
        fill(0);
        textAlign(LEFT);

        text("σz_N(" + addPrefix(x, "m", 2) + ", " + addPrefix(y, "m", 2) + ")   = " + addPrefix(sigmaZ_normal, "Pa", 3), dropTorque.position().x + 120, dropTorque.position().y + 5);
        text("σz_Mx(" + addPrefix(x, "m", 2) + ", " + addPrefix(y, "m", 2) + ") = " + addPrefix(sigmaZ_momentX, "Pa", 3), dropTorque.position().x + 120, dropTorque.position().y + 35);
        text("σz_My(" + addPrefix(x, "m", 2) + ", " + addPrefix(y, "m", 2) + ") = " + addPrefix(sigmaZ_momentY, "Pa", 3), dropTorque.position().x + 120, dropTorque.position().y + 65);
        text("σz(" + addPrefix(x, "m", 2) + ", " + addPrefix(y, "m", 2) + ")        = " + addPrefix(sigmaZ, "Pa", 3), dropTorque.position().x + 120, dropTorque.position().y + 95);

        pop();

        return sigmaZ;
    }

    calculateArea(radius){
        this.radius = parseUnits(radius, "m");
        console.log(this.radius);
        this.area = PI * this.radius ** 2;
        this.J = (PI * this.radius ** 4) / 2;
        this.I = this.J / 2;
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

        text("N", dropNormal.position().x - 35, dropNormal.position().y + 13);
        text("V" + this.dropX.value(), dropShearX.position().x - 35, dropShearX.position().y + 13);
        text("Vy", dropShearY.position().x - 35, dropShearY.position().y + 13);

        text("T", dropTorque.position().x - 35, dropTorque.position().y + 13);
        text("M" + this.dropX.value(), dropMomentX.position().x - 35, dropMomentX.position().y + 13);
        text("My", dropMomentY.position().x - 35, dropMomentY.position().y + 13);

        const axisM = {
            'x': 1,
            'z': -1
        };

        this.normal = parseUnits(dropNormal.value(), 'N');
        this.shearX = parseUnits(dropShearX.value(), 'N') * axisM[this.dropX.value()];
        this.shearY = parseUnits(dropShearY.value(), 'N');

        this.torque = parseUnits(dropTorque.value(), "Nm");
        this.momentX = parseUnits(dropMomentX.value(), "Nm") * axisM[this.dropX.value()];
        this.momentY = parseUnits(dropMomentY.value(), "Nm");

        pop();
    }

    createTextBox(){
        this.textRadius = createInput();
        this.textRadius.size(110, 25);
        this.textRadius.position(this.x - this.textRadius.width / 2, this.y + this.virtualRadius + 45 - this.textRadius.height / 2);
        this.textRadius.style('opacity', 0);

        this.textRadius.mouseOver(() => {
            this.textRadius.style('opacity', 1);
        });

        this.textRadius.mouseOut(() => {
            this.textRadius.style('opacity', 0);
            this.calculateArea(this.textRadius.value());
        });

        this.textRadius.value(addPrefix(this.radius, "m", 2))
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
            this.dropX.style('opacity', 1);
        });

        this.dropX.mouseOut(() => {
            this.dropX.style('opacity', 0);
        });
    }
}

function setLineDash(list) {
    drawingContext.setLineDash(list);
}