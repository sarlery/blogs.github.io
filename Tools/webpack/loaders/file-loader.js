const loaderUtils = require("loader-utils");

/**
 * file-loader 的作用：
 * 根据图片生成一个 MD5 并发射到打包的目录下
 * file-laoder 还会返回当前的文件路径（在 js 中可以使用 import 方式进行引入）
 * @param {string} source 
 */
function loader(source){
    // 根据当前的格式和文件内容来创建一个路径
    let filename = loaderUtils.interpolateName(this,'[name].[ext]',{
        content: source
    });
    // 发射文件
    this.emitFile(filename,source);
    // 返回文件的路径
    return `module.exports="${filename}"`;
}

// source 接受的是字符串，而图片是二进制文件
// 因此需要使用 raw 属性，将字符串转成 二进制数据
loader.raw = true;

module.exports = loader;