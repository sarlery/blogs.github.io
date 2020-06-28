const express = require("express");
const app = express();
app.use(express.static(__dirname));

app.get("/getDate", (req,res) => {
    res.send({
        msg: "你好！"
    });
});

app.listen(3000, "127.0.0.1", () => {
    console.log("server is running: http://localhost:3000");
});
