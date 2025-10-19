let img;
let input;
let drawing = false;
let startX, startY;
let squares = [];
let snapDist = 10;
let exportButton;
let toolbar;

function setup() {
    // Create toolbar div
    toolbar = createDiv();
    toolbar.style('margin', '10px');
    toolbar.style('display', 'flex');
    toolbar.style('gap', '10px');
    toolbar.style('align-items', 'center');

    // Upload button
    input = createFileInput(handleFile);
    input.parent(toolbar);

    // Export button
    exportButton = createButton('Save Code to File');
    exportButton.parent(toolbar);
    exportButton.mousePressed(saveCodeToFile);

    // Create initial canvas
    createCanvas(800, 600);
    background(220);
    textAlign(CENTER, CENTER);
    text('Upload an image to begin', width / 2, height / 2);
}

function handleFile(file) {
    if (file.type === 'image') {
        img = loadImage(file.data, () => {
            resizeCanvas(img.width, img.height);
            image(img, 0, 0);
        });
    }
}

function draw() {
    if (img) {
        image(img, 0, 0);

        // Draw all saved squares
        noStroke();
        for (let s of squares) {
            fill(s.color);
            rect(s.x, s.y, s.w, s.h);
        }

        // Draw current preview
        if (drawing) {
            let { snappedX, snappedY } = getSnapped(mouseX, mouseY);
            let w = snappedX - startX;
            let h = snappedY - startY;
            noFill();
            stroke(0, 255, 0);
            rect(startX, startY, w, h);
        }
    }
}

function mousePressed() {
    if (img && mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
        let snapped = getSnapped(mouseX, mouseY);
        startX = snapped.snappedX;
        startY = snapped.snappedY;
        drawing = true;
    }
}

function mouseReleased() {
    if (drawing) {
        let snapped = getSnapped(mouseX, mouseY);
        let w = snapped.snappedX - startX;
        let h = snapped.snappedY - startY;

        // Color at rectangle center
        let centerX = startX + w / 2;
        let centerY = startY + h / 2;
        let c = img.get(centerX, centerY);

        squares.push({ x: startX, y: startY, w, h, color: c });
        drawing = false;
    }
}

// 🧲 Snap helper
function getSnapped(x, y) {
    let snappedX = x;
    let snappedY = y;

    for (let s of squares) {
        let edgesX = [s.x, s.x + s.w];
        let edgesY = [s.y, s.y + s.h];

        for (let ex of edgesX) if (abs(x - ex) < snapDist) snappedX = ex;
        for (let ey of edgesY) if (abs(y - ey) < snapDist) snappedY = ey;
    }
    return { snappedX, snappedY };
}

// 💾 Save the generated code as a text file
function saveCodeToFile() {
    let code = "// Generated p5.js sketch\n";
    code += "function setup() {\n";
    code += "  createCanvas(" + width + ", " + height + ");\n";
    code += "  noStroke();\n\n";

    for (let s of squares) {
        let r = int(red(s.color));
        let g = int(green(s.color));
        let b = int(blue(s.color));
        code += `  fill(${r}, ${g}, ${b});\n`;
        code += `  rect(${int(s.x)}, ${int(s.y)}, ${int(s.w)}, ${int(s.h)});\n\n`;
    }

    code += "}\n";
    saveStrings([code], "traced_rects.js");
}
