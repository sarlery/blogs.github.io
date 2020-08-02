const { merge } = require('webpack-merge');
const path = require('path');
const { HotModuleReplacementPlugin } = require('webpack');
const common = require('./webpack.config')

module.exports = merge(common, {
    entry: ['react-hot-loader/patch', path.join(__dirname, '../src/index.js')],
    mode: 'development',
    devServer: {
        port: 8001,
        host: 'localhost',
        contentBase: path.join(__dirname, '../build'),
        // publicPath: '/build/',
        historyApiFallback: true,
        hot: true,
        open: true
    },
    plugins: [
        new HotModuleReplacementPlugin()
    ],
    devtool: 'source-map'
});