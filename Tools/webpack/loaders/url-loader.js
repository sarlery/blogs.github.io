const loaderUtils = require("loader-utils");
// mime 包可以获取文件的后缀
const mime = require("mime");

/**
 * url-laoder 会处理路径
 * url-loader 有一个 options 选项：limit
 * limit 选项可以指定文件的大小（字节）
 * 当文件小于 limit 值时会生成 base64 的字符串
 * 大于 limit 值时才会像 file-loader 一样去处理文件
 * 因此，在 webpack 中使用了 url-loader 后，就不用再使用 file-loader 了。
 * @param {string} source 
 */
function loader(source){
    var {limit} = loaderUtils.getOptions(this);
    if(limit && limit > source.length){
        // 转成 base64 格式
        return `module.exports="data:${mime.getType(this.resourcePath)};base64,${source.toString("base64")}"`;
    }else{
        // 否则的话就交给 file-loader 去处理
        return require("./file-loader").call(this,source);
    }
}
loader.raw = true;

module.exports = loader;