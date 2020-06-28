const express = require("express");
const app = express();

// 设置其他域的白名单
const whiteOrigins = [
    "http://localhost:3000",
    "http://abc.localhost:3000"
];
app.use(express.static(__dirname));

app.use(function (req, res, next) {
    const origin = req.headers.origin;
    console.log(req.headers);
    // 如果在白名单中能找到，就允许这个域访问到这个服务器的数据
    if(whiteOrigins.includes(origin)){
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Credentials", true);
        res.setHeader("Access-Control-Allow-Headers", "name,age");
        res.setHeader("Access-Control-Allow-Methods", 'PUT, OPTIONS');
        res.setHeader("Access-Control-Expose-Headers", "Name");
        res.setHeader("Access-Control-Max-Age", -1);
    }
    next();
});
app.get("/getData",(req,res) => {
    res.cookie("msg", '你好！');
    res.end("Hello!");
});
app.put("/getData",(req,res) => {
    res.cookie("msg", '你好！');
    res.setHeader("Name", "Ming")
    res.end("你好！！");
});
app.listen(4000);
