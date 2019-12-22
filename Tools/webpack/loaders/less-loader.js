// less-loader
let less = require("less");
// source 就是 less 文件中的源码
function loader(source){
    let css;
    // less 中有一个方法
    // 这个方法可以处理 less 文件中的样式
    less.render(source,function(err,result){
        // 处理好后，回调函数中的 result 参数就是处理好后的结果
        css = result.css
    });
    // 返回处理好的结果
    return css;
}

module.exports = loader;