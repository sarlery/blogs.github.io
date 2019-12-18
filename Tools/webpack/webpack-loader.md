# loader 原理与实现

## 实现 babel-loader
需要先下载 `@babel/core`、`@babel/preset-env` 两个 Babel 包：  

```bash
npm install @babel/core @babel/preset-env
```

```js
{
    test: /\.js$/,
    use: {
        loader: 'babel-loader',
        options: {
            "presets": [
                [
                    "@babel/preset-env",
                    {
                    "targets": {
                        "browsers": ["last 2 versions"]
                    },
                    "modules": false,
                    "useBuiltIns": "usage",
                    "corejs": 3
                    }
                ]
            ]
        }
    }
}
```

## 样式 loader 的编写

webpack 中的配置：  

```js
rules: [
    {
        test: /\.less$/,
        use: ['style-loader','css-loader','less-loader']
    }
]
```

### less-loader 的实现
less-loader 主要是将 less 格式的样式转成浏览器能认识的原生 css 代码。

1. 首先需要先下载 `less`：    
    `npm install less`。  
2. 编写 `less-loader` 的loader文件。  

```js
// less-loader
let less = require("less");
// source 就是 less 文件中的源码
function loader(source){
    let css;
    // less 中有一个方法
    // 这个方法可以处理 less 文件中的样式
    less.render(source,function(err,result){
        // 处理好后，回调函数中的 result 参数就是处理好后的结果
        css = r.css
    });
    // 返回处理好的结果
    return css;
}

module.exports = loader;
```

上面就完成了 less-loader 的编写。less-loader 的返回值回传给 css-loader，css-loader 再对样式做进一步的处理。处理好后再把处理好的结果返回，让 `style-loader` 接受，做最后的处理。

css-loader 的处理过程比较麻烦，这里先介绍一下 style-loader。

### style-loader 的编写
`style-loader` 的作用是讲 css 代码插入到 `head` 标签下的 `style` 标签中。  

webpack 配置文件中的 use 数组中的第一个 loader 应该返回一个 JS 脚本（字符串格式的 JS 脚本），因此 `style-loader` 需要这么做。

```js
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
// 在 style-loader 上写 pitch（pitch 的执行顺序是从左到右，即：style-loader 先被执行）
// `style-loader` 的 pitch 有返回值时，css-loader 和 less-loader 的 pitch 就不在执行了。就是开始执行 `normal`。  

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
```

### css-loader 的实现
css-loader 处理的是样式中引入的图片路径（`url(xxx)`）。  

我们就需要想办法将源码中的 `url()` 字符串提取出来，然后给路径做替换。再把替换后的路径插入到源码中。

先说一下 JavaScript 正则表达式中的一个方法：`exec`。这个方法很强大。它的调用格式：`reg.exec(str)`。  

这个方法会返回一个数组，数组里面是匹配到的字符串结果。此数组的第 0 个元素是与正则表达式相匹配的文本，第 1 个元素是与 RegExpObject 的第 1 个子表达式相匹配的文本（如果有的话），第 2 个元素是与 RegExpObject 的第 2 个子表达式相匹配的文本（如果有的话），以此类推。`RegExpObject` 可以看做是正则表达式中的括号里匹配的内容。比如下面的字符串：  

```js
let str = `
    body{
        background: url('./01.jpg');
    }
    div{
        background: url('./02.png');
    }
`;

var reg = /url\((.+?)\)/g,
    res = reg.exec(str);
console.log(res);
```
打印的结果将返回一个数组：`["url('./01.jpg')","'./01.jpg'"]`。数组第一项正则表达式匹配的文本，而第二项匹配的是正则表达式中 `(.+?)` 中的内容。  

`exec` 方法可以连续调用，当再次调用 `var next = reg.exec(str)` 时，将返回 `["url('./02.png')","'./01.png'"]`。表示匹配下一个符合条件的的字符串。当匹配不到时会返回 `null`。  

因此可以使用循环找出所有符合条件的结果：  

```js
var current = reg.exec(str),
    arr = [];
while(current){ 
    arr.push(current);
    current = reg.exec(str);
}
```

`RegExpObject` 中有一个 `lastIndex` 属性，当 exec() 找到了与表达式相匹配的文本时，在匹配后，它将把 RegExpObject 的 lastIndex 属性设置为匹配文本的最后一个字符的下一个位置。比如：

```js
var reg = /123(abc)/g,
    str = 'qwe123abcqqq',
    reg.exec(str);
    console.log(reg.lastIndex);     // 9
```

因此利用 `lastIndex` 熟悉就可以将截掉的 css 代码拿出来，利用字符串的 `slice` 方法。  

以下就是 css-loader 的源码：
```js
// css-loader
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
    return arr.join('\r\n');
}
```

以上就是样式 loader 的实现原理。