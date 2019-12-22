function loader(source){
    // 匹配 url(xxx) 格式的字符串
    // 正则表达式的子项（括号里匹配的内容）匹配的就是纯粹的路径
    let reg = /url\((.+?)\)/g;
    let pos = 0;
    let current;
    let arr = ['let list = []'];

    // current 
    while(current = reg.exec(source)){
        let [matchUrl,g] = current;
        // last 就是 url() 字符的第一个字符（u）前面的那个字符的索引
        let last = reg.lastIndex - matchUrl.length;
        // 将 url() 字符串的前面的内容添加到数组中
        arr.push(`list.push(${JSON.stringify(source.slice(pos,last))}`);
        // 然后 pos 等于 lastIndex，为了保存 url() 字符串后面的内容
        pos = reg.lastIndex;
        // 把 g 替换成 require 的写法 => url(require('xxx'))
        arr.push(`list.push('url('+require(${g}+')')`);
    }
    // url() 字符串后面的内容截取完即可
    arr.push(`list.push(${JSON.stringify(source.slice(pos))})`);
    // 最后将 list 拼接并导出（list 中存入的改过的 css 代码）
    arr.push(`module.exports = list.join('')`);
    // 用 eval 执行字符串中的内容
    return eval(arr.join('\r\n'));
}

module.exports = loader;