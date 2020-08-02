const webpack = require('webpack');
const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        react: ['react','react-dom'],
    },
    output: {
        filename: '_dll_[name].js',
        // 打包输出路径
        path: path.resolve(__dirname,'dll'),
        // 将打包好的模块给个名字（导出的变量的名字）
        library: '_dll_[name]',
    },
    plugins: [
        new webpack.DllPlugin({
            // name 属性值规定与 library 属性值相同
            name: '_dll_[name]',
            // path 表示产生一个清单，这个清单可以找到打包的文件
            path: path.resolve(__dirname,'dll','manifest.json'),
        }),
    ]
}