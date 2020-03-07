const path = require("path");

const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: path.join(__dirname,"react实践","index.js"),
    output: {
        path: path.join(__dirname,"react实践","dist"),
        filename: "js/boundle.js"
    },
    mode: "development",
    module: {
        rules: [
            {
                test: /\.(m?js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-react"
                        ],
                        plugins: [
                            "@babel/plugin-transform-runtime",
                            "@babel/plugin-transform-react-jsx",
                            "@babel/plugin-proposal-class-properties"
                        ]
                    }
                }
            },{
                test: /\.ts$/,
                use: "ts-loader"
            },{
                test: /\.(sa|sc)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "postcss-loader",
                    "sass-loader"
                ]
            },{
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "postcss-loader",
                    "less-loader"
                ]
            },{
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader"
                ]
            },{
                test: /\.(gif|png|jpeg|jpg)$/i,
                use: {
                    loader: "url-loader",
                    options: {
                        limit: 2048,
                        name: "[name].[ext]"
                    }
                }
            }
        ]
    },
    optimization: {
        splitChunks: {
            // 将重复的包分离到一个单独的 chunk 中
            chunks: "all",
            cacheGroups: {
                vendors: {
                  filename: 'js/[name].bundle.js'
                }
            }
        },
    },
    devServer: {
        contentBase: path.join(__dirname,"react实践","dist"),
        hot: true,
        port: 5000,
        open: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname,"react实践","public","index.html"),
            filename: "index.html",
        }),
        new MiniCssExtractPlugin({
            filename: "css/[name].css",
            chunkFilename: "css/[id].css"
        }),
        // 开启热模块更替
        new webpack.HotModuleReplacementPlugin()
    ],
}

