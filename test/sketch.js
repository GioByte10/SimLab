let objects1 = [];
let objects2 = [];

function setup(){

    background(220);

    objects1.push(new testObject(width / 2, height / 2, '🪨'));
    objects1.push(new testObject(random(width), random(height), '📜'));

    objects2.push(new testObject(width / 2, height / 2, '🪨'));
    objects2.push(new testObject(random(width), random(height), '📜'));

    objects1[0].update();
    text(objects2[0].emoji, 10, 100);

}


class testObject{
    constructor(x, y, emoji){
        this.position = createVector(x, y);
        this.emoji = emoji;
    }

    update(){
        let o = objects2[0];
        o.emoji = '✂️';
    }

}
