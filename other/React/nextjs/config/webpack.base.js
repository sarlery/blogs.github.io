const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
    entry: path.join(__dirname,"../src/index.js"),
    output: {
        path: path.join(__dirname, "../dist"),
        filename: "main.js",
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        }]
    },
    resolve: {
        extensions: ['.js','.jsx','.mjs']
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "../public/index.html")
        }),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ["../dist"],
            dry: false,
            dangerouslyAllowCleanPatternsOutsideProject: true
        })
    ]
}