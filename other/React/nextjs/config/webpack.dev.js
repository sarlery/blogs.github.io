const { smart } = require("webpack-merge");
const base = require("./webpack.base");

module.exports = smart(base,{
    mode: "development",
    devtool: "inline-source-map",
    output: {
        publicPath: "/public"
    },
    devServer: {
        open: true,
        contentBase: base.output.path,
        // 这里的 publicPath 与 output 中的 publicPath 保持一致
        publicPath: "/public",
        historyApiFallback: {
            // 设置主页路径
            index: "/public/index.html"
        },
        overlay: {
            // 当编译出错时就在网页上显示出来
            // 这里只显示错误信息
            errors: true,
        }
    }
});