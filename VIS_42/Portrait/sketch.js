const FPS = 60;

const imageNames = {
    FOREHEAD: 0,
    EYE_LEFT: 1,
    EYE_RIGHT: 2,
    NOSE: 3,
    EAR: 4,
    MOUTH: 5

};
const { FOREHEAD, EYE_LEFT, EYE_RIGHT, NOSE, EAR, MOUTH} = imageNames;

const imageTypes = {
    STATIC: 0,
    DYNAMIC: 1
}
const {STATIC, DYNAMIC} = imageTypes;

let images = [];
let debugging = false;
let animationFrameCount = FPS;
let pts = []

function preload(){
    images[EYE_LEFT] = new CustomImage('eye_left.png', 'rays.png');
    images[EYE_RIGHT] = new CustomImage('eye_right_2.png', 'cornea.png');
    images[FOREHEAD] = new CustomImage('forehead_6.png', 'brain.png');
    images[NOSE] = new CustomImage('nose.png');
    images[EAR] = new CustomImage('ear_2.png', 'sound.png');
    images[MOUTH] = new CustomImage('mouth_5.png');
}

function setup() {
    createCanvas(1711, 844);
    frameRate(FPS);
    imageMode(CENTER);
    angleMode(DEGREES)

    if(navigator.userAgent.match(/iPhone|iPad|iPod|Android|webOs|BlackBerry|Windows Phone/i))
        pixelDensity(1);

    images[EYE_LEFT].load(width / 2 - 90, height / 2 + 50, 170, 1, 0, 0, 1000);
    images[EYE_RIGHT].load(width / 2 + 100, height / 2 + 40, 200, 400, -20, 0, 200);
    images[FOREHEAD].load(width / 2 + 10, height / 2 - 130, 550, 500, 180, -100, 300);
    images[NOSE].load(width / 2, height / 2 + 90, 100);
    images[EAR].load(width / 2 + 230, height / 2 + 50, 80, 150, 0, 0, 150);
    images[MOUTH].load(width / 2 + 10, height / 2 + 240, 360);

    // Set hit polygons (instead of hitboxes)
    images[EYE_LEFT].setHitPolygon([[703,564],[688,526],[681,501],[692,424],[710,394],[760,384],[804,394],[837,400],[835,432],[816,479],[798,543],[782,567],[718,562]]);
    images[EYE_RIGHT].setHitPolygon([[1170,609],[910,550],[1036,553],[1030,504],[1026,433],[999,390],[897,411],[911,473],[917,550]])
    images[FOREHEAD].setHitPolygon([[614,375],[705,370],[760,352],[850,370],[912,354],[998,354],[1039,357],[1114,380],[1131,304],[1086,197],[1028,98],[974,136],[908,106],[835,89],[786,100],[710,123],[642,156],[620,218],[604,296],[611,338]])
    images[NOSE].setHitPolygon([[855,571],[898,556],[881,504],[870,452],[850,452],[839,495],[816,556]])
    images[EAR].setHitPolygon([[1056,547],[1079,548],[1101,518],[1114,469],[1108,428],[1090,412],[1060,412],[1052,524]])
    images[MOUTH].setHitPolygon([[694,580],[718,623],[743,670],[780,712],[829,737],[875,737],[927,716],[970,692],[1005,656],[1026,622],[1040,574],[899,580],[855,592],[795,579]]);

    let bubble = new Bubble(width / 2 -600, height / 2 - 300, 270, 70, width / 2 -300, height / 2 - 200);
    bubble.addText("Something I would say")

    images[MOUTH].addBubble(bubble);

}

function draw() {
    background(220);

    for(let i = 0; i < images.length; i++)
        images[i].display();

    if(debugging)
        debug();

}

function hittingPolygon(x, y, vertices) {
    let inside = false;
    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
        let xi = vertices[i][0], yi = vertices[i][1];
        let xj = vertices[j][0], yj = vertices[j][1];
        let intersect = ((yi > y) !== (yj > y)) &&
            (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

class CustomImage {
    constructor(file, insideFile, bubble) {
        this.image = loadImage('assets\\' + file);

        if(insideFile)
            this.insideImage = loadImage('assets\\' + insideFile);

        this.mouseOn = false;
        this.animationStart = 0;

    }

    addBubble(bubble) {
        this.bubble = bubble;
    }

    load(x, y, size, r, theta, yoff, insideSize){
        this.ox = x;
        this.oy = y;

        this.x = this.ox;
        this.y = this.oy
        this.size = size;

        this.ratio = this.image.height / this.image.width;

        if(r) {
            this.r = r;
            this.theta = theta;
            this.yoff = yoff;
            this.insideSize = insideSize;
            this.insideRatio = this.insideImage.height / this.insideImage.width;
        }
    }

    setHitPolygon(hitPoints){
        this.hitPoints = hitPoints
    }


    display(){
        push();

        if(this.insideImage || this.bubble){
            if(hittingPolygon(mouseX, mouseY, this.hitPoints)) {
                if(this.bubble) {
                    this.bubble.display()

                }else {
                    if(!this.mouseOn){
                        this.mouseOn = true;
                        this.animationStart = frameCount;
                    }

                    let timePercent = (frameCount - this.animationStart + 1) / animationFrameCount;
                    timePercent = constrain(timePercent, 0, 1);

                    let animationSeconds = animationFrameCount / FPS;
                    let percent = timePercent <= 0.5 ? 2 * sq(timePercent * animationSeconds) : -2 * sq(timePercent * animationSeconds - 1) + 1;

                    tint(255, percent * 200);
                    image(this.insideImage, this.x + this.r * cos(this.theta) * percent, this.yoff + this.y + this.r * sin(this.theta) * percent,
                        this.insideSize * percent, this.insideRatio * this.insideSize * percent);
                }
            }else if(this.insideImage){
                if(this.mouseOn) {
                    this.mouseOn = false;
                    this.animationStart = frameCount;
                }
                let timePercent = 1 - (frameCount - this.animationStart + 1) / animationFrameCount;
                timePercent = constrain(timePercent, 0, 1);

                let animationSeconds = animationFrameCount / FPS;
                let percent = timePercent <= 0.5 ? 2 * sq(timePercent * animationSeconds) : -2 * sq(timePercent * animationSeconds - 1) + 1;

                tint(255, percent * 200);
                //console.log(this.insideImage)
                image(this.insideImage, this.x + this.r * cos(this.theta) * percent, this.yoff + this.y + this.r * sin(this.theta) * percent,
                    this.insideSize * percent, this.insideRatio * this.insideSize * percent);
            }
        }
        pop();

        image(this.image, this.x, this.y, this.size, this.size * this.ratio);

        this.x += random(-0.3, 0.3);
        this.y += random(-0.3, 0.3);

        this.x = constrain(this.x, this.ox - 7, this.ox + 7);
        this.y = constrain(this.y, this.oy - 7, this.oy + 7);

    }
}

function debug(){
    push();

    textAlign(LEFT, TOP);
    fill(255);
    text(mouseX + ', ' + mouseY, mouseX + 6, mouseY - 7);

    line(0, mouseY, width, mouseY);
    line(mouseX, 0, mouseX, height);

    textAlign(RIGHT, TOP);
    text(width + ', ' + height, width - 20, height - 40);
    text(width / 2 + ', ' + height / 2, width - 20, height - 20);

    stroke(255, 0, 0);
    line(0, height / 2, width, height / 2);
    line(width / 2, 0, width / 2, height);

    pop();
}

function keyPressed(){
    if(keyCode === 68){     // D key
        debugging = !debugging;
    }
}

function touchStarted(){
    pts.push([mouseX, mouseY]);
    console.log(JSON.stringify(pts))
    // for(let i = 0; i < pts.length; i++){
    //     console.log()
    // }

}

class Bubble{
    constructor(x, y, w, h, originX, originY){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.originX = originX;
        this.originY = originY;
        this.txt = "";
    }
    addText(txt){
        this.txt = txt;
    }
    display(bgCol=255, fgCol=0){
        push();
        fill(bgCol);
        stroke(0);
        strokeWeight(2);
        let r = min(this.w, this.h)/4;
        rect(this.x, this.y, this.w, this.h, r);
        stroke(bgCol);
        let offset1 = this.w*0.65;
        let offset2 = this.w*0.85;
        triangle(this.originX, this.originY, this.x + offset1, this.y + this.h - 2, this.x + offset2, this.y + this.h - 2);
        stroke(fgCol);
        line(this.originX, this.originY, this.x + offset1, this.y + this.h);
        line(this.originX, this.originY, this.x + offset2, this.y + this.h);
        textAlign(LEFT, CENTER);
        textSize(22);
        noStroke();
        fill(fgCol);
        text(this.txt, this.x + this.w * 0.05, this.y + this.h * 0.2, this.w * 0.9, this.h * 0.6);

        pop()
    }
}