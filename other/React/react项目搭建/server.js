const path = require("path");
const express = require("express");

const app = express();

app.use(express.static(path.join(__dirname,"../","react实践","dist")));

app.listen(4000,() => {
    console.log("Server is running: http://localhost:4000");
});