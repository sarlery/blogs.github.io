const path = require("path");
const axios = require("axios");
const React = require("react");
const { createProxyMiddleware } = require("http-proxy-middleware");
const MemoryFileSystem = require("memory-fs");
const webpack = require("webpack");
const { renderToString } = require("react-dom/server");
const serverConfig = require("../config/webpack.server");

// 这个模块可以读写内存中的数据
const mfs = new MemoryFileSystem();
const serverCompiler = webpack(serverConfig);
const proxy = createProxyMiddleware({
    target: "http://localhost:8080"
});

let Appboundle;

// 首先通过 axios 把 HTML 模板请求过来
function getTemplate(){
    return new Promise((resolve,reject) => {
        axios.get("http://localhost:8080/public/index.html")
        .then(res => {
            resolve(res.data);
        }).catch(reject);
    });
}

// module 是 commonjs 的外层对象，通过它可以导出内容
const Module = module.constructor;

// 监听 entry 以来的文件是否有变化，如果有变化它就会进行打包
serverCompiler.outputFileSystem = mfs;
serverCompiler.watch({},(err,stats) => {
    if(err) throw err;
    stats = stats.toJson();
    stats.errors.forEach(err => console.error(err));
    stats.warnings.forEach(warn => console.warn(warn));

    const bundlePath = path.join(
        serverConfig.output.path,
        serverConfig.output.filename
    );
    const bundle = mfs.readFileSync(bundlePath,"utf-8");
    const m = new Module();
    // 导出的内容，以及导出模块的名称
    m._compile(bundle, "server-entry.js");
    Appboundle = m.exports.default;
});

module.exports = function(app){

    app.use("/public", proxy);
    app.get("*",async (req,res) => {
        getTemplate().then(template => {
            const content = renderToString(<Appboundle location={req.path} />);
            res.send(template.replace('<!--app-->', content));
        }).catch(err => console.error(err));
    });
}