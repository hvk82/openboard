const { log } = require("console");
const express = require("express");
const socket = require("socket.io");
const app = express();
app.use(express.static("public"));
let port = process.env.PORT || 5000;
let server = app.listen(port, () => {
  log("listtening to port 5000");
});
let io = socket(server);
io.on("connection", (socket) => {
  log("connectio made");
  socket.on("beginPath", (data) => {
    io.sockets.emit("beginPath", data);
  });
  socket.on("drawPath", (data) => {
    io.sockets.emit("drawPath", data);
  });
  socket.on("redoUndo", (data) => {
    io.sockets.emit("redoUndo", data);
  });
});
