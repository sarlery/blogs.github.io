// style-loader
const loaderUtils = require("loader-utils");

function loader(source){
    // 创建一个 style 标签，标签里的内容就是 css-loader 处理后的结果
    let str = `
        let style = document.createElement("style");
        style.innerHTML = ${JSON.stringify(source)};
        document.head.appendChild(style);
    `;
    // 返回这个 JS 脚本
    return str;
}

loader.pitch = function(remainingRequest){
    // remainingRequest 表示为“剩余的请求”，
    // 在 pitch 中，先走的是 style-loader
    // 因此还剩下 css-loader 和 less-loader 没有执行
    // 所以，remainingRequest 就是 css-loader!less-loader! 当前文件路径（就是 less 文件路径） 的格式的字符串

    // 让 style-laoder 去处理 remainingRequest
    // loaderUtils.stringifyRequest 方法可以将绝对路径转成相对路径
    // remainingRequest 中的路径是绝对路径，需要转换一下
    // require 的路径返回的就是 css-loader 处理好的结果
    // !!css-loader!less-loader!less文件路径
    // innerHTML中 引用了 css-loader 和 style-loader
    // 这时就会跳过剩余的 pitch，开始获取资源，执行 normal。先执行 less-loader
    // 然后执行 css-loader 最后执行 style-loader
    var str = `
        let style = document.createElement('style');
        style.innerHTML = require(${loaderUtils.stringifyRequest(this,'!!' + remainingRequest)});
        document.head.appendChild(style);
    `;
    return str;
}

module.exports = loader;