const { log } = require("console");
const express = require("express");
const socket = require("socket.io");
const app = express();
app.use(express.static("public"));
let port = 5000;
let server = app.listen(port, () => {
  log("listtening to port 5000");
});
let io = socket(server);
io.on("connection", (socket) => {
  log("connectio made");
});
