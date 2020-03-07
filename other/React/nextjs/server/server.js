const express = require("express");
const path = require("path");
const React = require("react");
const { renderToString } = require("react-dom/server");
const { readFile: rf } = require("fs");
const { promisify } = require("util");
// const App = require("../src/App").default;
const ServerRouter = require("../src/serverRouter").default;

const app = express();
const readFile = promisify(rf);
// 判断是不是开发环境
const isDev = process.env.NODE_ENV === "development";

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if(!isDev){
    app.get("/",async (req,res) => {
        const content = renderToString(<ServerRouter location={req.path} />);
        const str = await readFile(path.join(__dirname, "../dist/index.html"));
        const html = str.toString().replace("<!--app-->",content);
        res.send(html);
    });
    app.use("/",express.static(path.join(__dirname, "../dist")));
}else{
    // 当时开发环境时，就不会生成打包后的文件，这时候就需要做另外的处理
    const devServer = require("./devServer");
    devServer(app);
}

app.listen(8004,() => {
    console.log("Server is running: http://localhost:8004");
});

