const path = require("path");

module.exports = {
    entry: path.join(__dirname, "src/index.js"),
    output: {
        path: path.join(__dirname, "dist"),
        filename: "boundle.js"
    },
    mode: "development",
    resolveLoader: {
        // webpack 寻找 loader 的路径
        modules: [
            "node_modules",
            // 添加一个别的路径
            path.resolve(__dirname, "loaders")
        ]
    },
    devtool: "source-map",
    module: {
        rules: [{
            test: /\.js$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        "@babel/preset-env"
                    ],
                    plugins: [
                        "@babel/plugin-transform-runtime"
                    ]
                }
            }
        }, {
            test: /\.js$/,
            use: {
                loader: "banner-loader",
                options: {
                    text: "作者：xxx",
                    filename: ""
                }
            }
        }, {
            test: /\.(jpg|png|gif|jpeg)$/,
            use: {
                loader: "url-loader",
                options: {
                    limit: 1024 * 30
                }
            }
        }]
    }
}
