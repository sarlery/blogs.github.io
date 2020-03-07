const path = require("path");
// server 端开发模式下，不打包出文件，而是在内存中进行
module.exports = {
    mode: process.env.NODE_ENV,
    target: 'node',
    entry: path.join(__dirname, "../src/serverRouter.js"),
    resolve: {
        extensions: ['.js','.jsx','.mjs']
    },
    output: {
        filename: "server-entry.js",
        path: path.join(__dirname, "../dist"),
        // 打包后的模块规范
        libraryTarget: "commonjs2"
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            use: {
                loader: "babel-loader"
            }
        }]
    }
};