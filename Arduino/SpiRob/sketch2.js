let port, reader, writer;
let readings = []

async function connectSerial(){
    noLoop();
    ({ port, reader, writer } = await getPort(115200));
    loop();
}

async function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(60);
    angleMode(DEGREES);
    textSize(100)
    textAlign(CENTER, RIGHT);

    await connectSerial();
}

async function draw() {
    while(true) {
        const {value, done} = await reader.read();

        if (done) {
            reader.releaseLock();
            break;
        }

        background(220);

        readings.unshift(int(value));

        if(readings.length > 25)
            readings.pop();

        // let avg = 0;
        //
        // for(let i = 0; i < readings.length; i++)
        //     avg += readings[i];
        //
        // avg /= readings.length;
        // text("A0: " + avg,width / 2, height / 2)

    }
}

function drawSpiral(){
    let R = 25 * 10;
    let a = 1;
    let b = 0.22;

    text(exp(2), width / 2, height / 2);
    let r = a * exp()



}
