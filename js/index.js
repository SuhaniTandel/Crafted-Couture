const canvas = document.getElementById("designCanvas");
const ctx = canvas.getContext("2d");

let painting = false;
let brushColor = "#000000";
let brushSize = 5;
let eraserMode = false;
let history = [];
let redoStack = [];

// Save initial blank state
saveState();

// Start drawing
canvas.addEventListener("mousedown", (e) => {
    painting = true;
    redoStack = []; // Clear redo stack when a new action starts
    saveState();
    draw(e);
});

// Stop drawing
canvas.addEventListener("mouseup", () => {
    painting = false;
    ctx.beginPath();
});
canvas.addEventListener("mouseleave", () => painting = false);

// Drawing function
canvas.addEventListener("mousemove", draw);

function draw(e) {
    if (!painting) return;

    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.strokeStyle = eraserMode ? "#ffffff" : brushColor;

    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
}

// Change color
document.getElementById("colorPicker").addEventListener("change", (e) => {
    brushColor = e.target.value;
    eraserMode = false;
});

// Change brush size
document.getElementById("brushSize").addEventListener("input", (e) => {
    brushSize = e.target.value;
});

// Eraser mode
function setEraser() {
    eraserMode = true;
}

// Save canvas state for undo/redo
function saveState() {
    history.push(canvas.toDataURL());
}

// Undo last action
function undo() {
    if (history.length > 1) {
        redoStack.push(history.pop());
        restoreCanvas(history[history.length - 1]);
    }
}

// Redo last undone action
function redo() {
    if (redoStack.length > 0) {
        const lastRedo = redoStack.pop();
        history.push(lastRedo);
        restoreCanvas(lastRedo);
    }
}

// Restore canvas from image
function restoreCanvas(dataUrl) {
    let img = new Image();
    img.src = dataUrl;
    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
    };
}

// Clear canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    history = [];
    redoStack = [];
}

// Upload an image & draw on top
document.getElementById("uploadImage").addEventListener("change", function(e) {
    let file = e.target.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = function(event) {
        let img = new Image();
        img.src = event.target.result;
        img.onload = function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            saveState();
        };
    };
    reader.readAsDataURL(file);
});

// Save design
function saveDesign() {
    localStorage.setItem("savedDesign", canvas.toDataURL());
    alert("Design saved!");
}

// Download design
function downloadDesign() {
    let link = document.createElement("a");
    link.download = "custom_design.png";
    link.href = canvas.toDataURL();
    link.click();
}

// Load saved design if available
window.onload = function() {
    let savedDesign = localStorage.getItem("savedDesign");
    if (savedDesign) {
        restoreCanvas(savedDesign);
    }
};
