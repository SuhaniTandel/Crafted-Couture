document.addEventListener("DOMContentLoaded", function () {
    const canvas = new fabric.Canvas("canvas", {
        backgroundColor: "white",
        selection: true,
        preserveObjectStacking: true
    });

    let history = [];
    let redoStack = [];

    function saveState() {
        history.push(JSON.stringify(canvas));
        redoStack = []; // Clear redo history after new changes
    }

    function loadState(state) {
        canvas.loadFromJSON(state, function () {
            canvas.renderAll();
        });
    }

    function undo() {
        if (history.length > 0) {
            redoStack.push(history.pop());
            loadState(history[history.length - 1] || "{}");
        }
    }

    function redo() {
        if (redoStack.length > 0) {
            const state = redoStack.pop();
            history.push(state);
            loadState(state);
        }
    }

    document.getElementById("undo").addEventListener("click", undo);
    document.getElementById("redo").addEventListener("click", redo);

    // Print Area Selection
    function changePrintArea(area) {
        saveState();
        canvas.clear();

        let rect;
        if (area === "front") rect = new fabric.Rect({ width: 200, height: 250, fill: "lightgray" });
        else if (area === "back") rect = new fabric.Rect({ width: 220, height: 260, fill: "lightgray" });
        else if (area === "sleeve") rect = new fabric.Rect({ width: 100, height: 150, fill: "lightgray" });
        else if (area === "neck") rect = new fabric.Rect({ width: 180, height: 100, fill: "lightgray" });
        else if (area === "waist") rect = new fabric.Rect({ width: 250, height: 80, fill: "lightgray" });

        rect.set({ top: 50, left: 100, selectable: false });
        canvas.add(rect);
    }

    document.getElementById("frontPrint").addEventListener("click", () => changePrintArea("front"));
    document.getElementById("backPrint").addEventListener("click", () => changePrintArea("back"));
    document.getElementById("sleevePrint").addEventListener("click", () => changePrintArea("sleeve"));
    document.getElementById("neckPrint").addEventListener("click", () => changePrintArea("neck"));
    document.getElementById("waistPrint").addEventListener("click", () => changePrintArea("waist"));

    // Adding Images
    document.getElementById("uploadImage").addEventListener("change", function (event) {
        const reader = new FileReader();
        reader.onload = function (e) {
            fabric.Image.fromURL(e.target.result, function (img) {
                img.scaleToWidth(150);
                img.set({ left: 100, top: 100 });
                canvas.add(img);
                saveState();
            });
        };
        reader.readAsDataURL(event.target.files[0]);
    });

    // Adding Text
    document.getElementById("addText").addEventListener("click", function () {
        const text = new fabric.Textbox("Your Text", {
            left: 100,
            top: 100,
            fontSize: 24,
            fill: "black",
            fontFamily: "Arial"
        });
        canvas.add(text);
        saveState();
    });

    // Align Elements
    function alignObject(position) {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            if (position === "left") activeObject.left = 10;
            else if (position === "center") activeObject.left = (canvas.width / 2) - (activeObject.width / 2);
            else if (position === "right") activeObject.left = canvas.width - activeObject.width - 10;
            else if (position === "top") activeObject.top = 10;
            else if (position === "middle") activeObject.top = (canvas.height / 2) - (activeObject.height / 2);
            else if (position === "bottom") activeObject.top = canvas.height - activeObject.height - 10;
            
            canvas.renderAll();
            saveState();
        }
    }

    document.getElementById("alignLeft").addEventListener("click", () => alignObject("left"));
    document.getElementById("alignCenter").addEventListener("click", () => alignObject("center"));
    document.getElementById("alignRight").addEventListener("click", () => alignObject("right"));
    document.getElementById("alignTop").addEventListener("click", () => alignObject("top"));
    document.getElementById("alignMiddle").addEventListener("click", () => alignObject("middle"));
    document.getElementById("alignBottom").addEventListener("click", () => alignObject("bottom"));

    // Resizing
    document.getElementById("printSize").addEventListener("input", function () {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            activeObject.scaleToWidth(this.value);
            activeObject.scaleToHeight(this.value);
            canvas.renderAll();
            saveState();
        }
    });

    // Rotate
    document.getElementById("rotateLeft").addEventListener("click", function () {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            activeObject.rotate(activeObject.angle - 15);
            canvas.renderAll();
            saveState();
        }
    });

    document.getElementById("rotateRight").addEventListener("click", function () {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            activeObject.rotate(activeObject.angle + 15);
            canvas.renderAll();
            saveState();
        }
    });

    // Delete Selected Object
    document.getElementById("deleteObject").addEventListener("click", function () {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            canvas.remove(activeObject);
            saveState();
        }
    });

    // Enable Free Drawing
    document.getElementById("freeDraw").addEventListener("click", function () {
        canvas.isDrawingMode = !canvas.isDrawingMode;
        this.innerText = canvas.isDrawingMode ? "✏️ Stop Drawing" : "✏️ Draw";
    });

    // Eraser Tool
    document.getElementById("eraser").addEventListener("click", function () {
        const objects = canvas.getObjects();
        objects.forEach(obj => {
            if (obj instanceof fabric.Path) {
                canvas.remove(obj);
            }
        });
        saveState();
    });

    // Save Design as Image
    document.getElementById("saveDesign").addEventListener("click", function () {
        const dataURL = canvas.toDataURL({ format: "png" });
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "design.png";
        link.click();
    });

    saveState(); // Save initial state
});
