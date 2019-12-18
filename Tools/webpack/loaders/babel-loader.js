const babel = require("@babel/core");
const loaderUtils = require("loader-utils");

function loader(source){
    // loader 中有一个 this 指向 loaderContext
    // getOptions 可以获得 loader 中的 options 配置对象
    var options = loaderUtils.getOptions(this);

    // loaderContext 中有一个 async 方法
    // 这个方法是为了能异步的返回处理好的结果
    // cb 接受两个参数，第一个参数是 error 信息，
    // 第二个参数是 处理好 source 后的结果
    var cb = this.async();

    babel.transform(source,{
        ...options,
        // 在 loader 中指定了 sourceMap 后还需要在 webpack 中进行配置（devtool: 'source-map'）才能生成 sourceMap
        sourceMaps: true,
        // 指定文件的名字。resourcePath 就是文件所在的绝对路径（因此需要使用 split 方法）
        filename: this.resourcePath.split('/').pop()
    },function(err,result){
        // console.log(result);
        // 异步的返回结果
        // result.code 就是loader处理后的代码
        // result.map 就是 sourceMap
        cb(err,result.code,result.map);
    });
}

module.exports = loader;