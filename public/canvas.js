let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let tool = canvas.getContext("2d");
let pencilcolor = document.querySelectorAll(".pencil-color");
let pencilWidthElem = document.querySelector(".pencil-width");
let eraserWidthElem = document.querySelector(".eraser-width");
let download = document.querySelector(".download");
let undo = document.querySelector(".undo");
let redo = document.querySelector(".redo");
let undoRedoTracker = [];
let track = 0;
// tool.beginPath();
// tool.moveTo(10, 10);
// tool.strokeStyle = "red";
// tool.lineTo(200, 200);
// tool.stroke();
let penColor = "red";
let eraserColor = "white";
let penWidth = pencilWidthElem.value;
let eraserWidth = eraserWidthElem.value;

tool.strokeStyle = penColor;
tool.lineWidth = penWidth;
// tool.beginPath();
// tool.moveTo(100, 120);
// tool.lineTo(400, 400);
// tool.stroke();

let mouseDown = false;
canvas.addEventListener("mousedown", (e) => {
  mouseDown = true;
  let data = {
    x: e.clientX,
    y: e.clientY,
  };
  socket.emit("beginPath", data);
});
canvas.addEventListener("mousemove", (e) => {
  let data;
  if (mouseDown) {
    data = {
      x: e.clientX,
      y: e.clientY,
      color: eraserFlag ? eraserColor : penColor,
      width: eraserFlag ? eraserWidth : penWidth,
    };
  }
  socket.emit("drawPath", data);
});
canvas.addEventListener("mouseup", (e) => {
  mouseDown = false;
  //one graphic is completd
  let url = canvas.toDataURL();
  undoRedoTracker.push(url);
  track = undoRedoTracker.length - 1;
});

//add my undo and redo here

undo.addEventListener("click", (e) => {
  console.log("called undo");
  if (track > 0) track--;
  let data = {
    trackValue: track,
    undoRedoTracker,
  };
  //console.log("track in undo" + track);
  socket.emit("redoUndo", data);
});
redo.addEventListener("click", (e) => {
  if (track < undoRedoTracker.length - 1) track++;
  let data = {
    trackValue: track,
    undoRedoTracker,
  };
  socket.emit("redoUndo", data);
});
//add a function to undo rand redo
function undoRedoCanvas(trackObj) {
  track = trackObj.trackValue;
  if (track === 0) {
    tool.clearRect(0, 0, canvas.width, canvas.height);
  }
  undoRedoTracker = trackObj.undoRedoTracker;
  //use these
  let url = undoRedoTracker[track];
  let img = new Image();
  img.src = url;

  img.onload = function () {
    tool.clearRect(0, 0, canvas.width, canvas.height);
    tool.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
}
function beginPath(strokeObj) {
  tool.beginPath();
  tool.moveTo(strokeObj.x, strokeObj.y);
}
function drawPath(strokeObj) {
  tool.strokeStyle = strokeObj.color;
  tool.lineWidth = strokeObj.width;
  tool.lineTo(strokeObj.x, strokeObj.y);
  tool.stroke();
}
pencilcolor.forEach((colorElem) => {
  colorElem.addEventListener("click", (e) => {
    let color = colorElem.classList[0];
    penColor = color;
    tool.strokeStyle = penColor;
  });
});
pencilWidthElem.addEventListener("change", (e) => {
  penWidth = pencilWidthElem.value;
  tool.lineWidth = penWidth;
});
eraserWidthElem.addEventListener("change", (e) => {
  eraserWidth = eraserWidthElem.value;
  tool.lineWidth = eraserWidth;
});
eraser.addEventListener("click", (e) => {
  if (eraserFlag) {
    tool.strokeStyle = eraserColor;
    tool.lineWidth = eraserWidth;
  } else {
    tool.strokeStyle = penColor;
    tool.lineWidth = penWidth;
  }
});
download.addEventListener("click", (e) => {
  let url = canvas.toDataURL();
  let a = document.createElement("a");
  a.href = url;
  a.download = "board.jpg";
  a.click();
});
socket.on("beginPath", (data) => {
  beginPath(data);
});
socket.on("drawPath", (data) => {
  drawPath(data);
});
socket.on("redoUndo", (data) => {
  undoRedoCanvas(data);
});
