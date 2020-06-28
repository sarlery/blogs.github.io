# XSS 攻击与防御

XSS（跨站脚本攻击，Cross-site scripting，它的简称并不是 `CSS`，因为这可能会与 CSS层叠样式表重名）是一种常见的 web 安全问题。XSS 攻击手段主要是 “HTML 注入”，用户的数据被当成了 HTML 代码一部分来执行。   

有时候我们点击一个链接，发现号被盗了，这很可能就是一个 XSS 攻击。例如攻击者发现了 A 站点的一个 XSS 漏洞，A 站点的用户很多，攻击者就找到一个用户，给这个用户发送一个链接（A 站点的漏洞接口），当用户点击链接时，攻击成功。该用户的个人信息或者登录凭据可能就暴露给了攻击者。

XSS 大致分为两种：**反射型**、**存储型**。   

**反射型XSS** 通常是简单地把用户输入地数据“反射”给浏览器。黑客一般会诱使用户点击一个有恶意地链接，用户点击就会发起 XSS 攻击。反射型 XSS 攻击可以将 JavaScript 脚本插入到 HTML节点中、HTML属性中以及通过 JS 注入到 URL 或 HTML 文档中。

**存储型XSS** 这种攻击会把用户输入地数据存储到服务器中。例如在一个有 XSS 漏洞的博客网站，黑客写下一篇含有恶意 JavaScript 代码的文章，文章发布后，所有看了这篇博文的用户都会在他们的浏览器中执行恶意 JavaScript 代码。  

成功发起 XSS 攻击后，黑客写入的 JavaScript 代码就会执行，通过脚本可以控制用户的浏览器。一个常见的攻击手段是“Cookie 劫持”，cookie 中一般加密保存着当前用户的登录凭据，黑客可以通过恶意代码将用户的 cookie 发到自己的服务器上，然后就可以做到无密码登录上用户的账户（但攻击者并不知道用户的密码）。  

XSS 攻击是客户端安全中的头号大敌，如何防御 XSS 攻击是一个重要的问题。

## 1. HTML 节点内容

比如在评论页面，如果评论框中写入以下的内容并执行了（弹出文本框），这就是一个 XSS 漏洞。

```html
<script>alert(1)</script>
```

只是弹出一个文本框看起来并没有什么危害，要知道，只要能运行 JavaScript 代码，意味着 **不仅仅可以调出弹出框，还可以随意的操纵前端页面，可以发送异步请求** 。

要解决这样的问题，就需要对 `script` 标签进行转义：
```js
var escapeHtml = function(str){
    // &lt; 在 HTML 中会被转义成 <
    // &gt; 在 HTML 中会被转义成 >
    return str.replace(/</g,"&lt;")
              .replace(/>/g,"&gt;");
}
```

### innerHTML 与 innerText
执行下面的代码，`el[0]` 和 `el[1]` 元素中的内容都是什么？  

```js
const el = document.querySelectorAll(".wrapper");
let html = "<h1>Hello XSS</h1>";
el[0].innerHTML = html;
el[1].innerText = html;
```

`innerHTML` 会把字符串转成 HTML 代码片段渲染到页面上，`innerText` 会原样输出字符串，它会将特殊字符转义。因此，不要过度使用 `innerHTML` 方法，在使用前应考虑一下会不会对程序造成危害。如果一个用户输入的内容直接由 `innerHTML` 操办，那很可能是危险的。  

HTML5 指定不执行由 innerHTML 插入的 `<script>` 标签。但是有很多不依赖 `<script>` 标签去执行 JavaScript 的方式。所以当你使用 innerHTML 去设置你无法控制的字符串时，这仍然是一个安全问题。例如：  

```js
const name = "<img src='x' onerror='alert(1)'>";
el.innerHTML = name;    // 会弹出提示框，构成了 XSS 攻击
```

### textContent

如果仅是展示纯文字内容，不展示富文本，应使用 `innerText` 或者 `textContent`，这可以避免 XSS 攻击。

`textContent` 与 `innerText` 很相似，但两者又有一些不同：  

- `textContent` 会获取所有元素的内容，包括 `<script>` 和 `<style>` 元素，然而 `innerText` 只展示给人看的元素（页面中不可见的元素调用 `innerText` 时是获取不到内容的，在 chrome 中，调用 script、style 标签的 innerText 也能获取到内容）。  
- `textContent` 会返回节点中的每一个元素。相反，`innerText` 受 CSS 样式的影响，它会触发回流（`reflow`）去确保是最新的计算样式。（回流在计算上可能会非常昂贵，因此应尽可能避免。），并且不会返回隐藏元素的文本。  
- `innerText` 没有 `textContent` 兼容性好，尤其是对于 IE 浏览器。在 `Internet Explorer` (小于和等于 11 的版本) 中对 innerText 进行了修改， 不仅会移除当前元素的子节点，而且还会永久性地破坏所有后代文本节点。在之后不可能再次将节点再次插入到任何其他元素或同一元素中。  

综上，推荐使用 `textContent` 属性。 

## 2. 提前关闭 HTML 属性
比如一个 img 标签原来的样子是：`<img src="xxx">`。而经过改造后可能变成这样：  

```html
<img src="xxx" onerror="alert(1)">
```

假如我们有一个输入框，输入内容后，可以通过内容检索到一张图片。代码如下  

```js
function fn(){
    // 获取到文本框
    var value = document.getElementById("input").value;
    document.querySelector('div').innerHTML = "<img src='" + value + "' />";
}
```

这时候，攻击者可能就不会“遵循常规”，他在输入框中出入了下面的内容：  

```
x' onerror='alert(1)
```

`value` 值就变成了上面的内容，拼接后 `innerHTML` 的内容就变成了：  

```html
<img src='x' onerror='alert(1)' />
```

`src='x'` 显然不是一个正确的地址，就会导致后面 `onerror` 事件触发。

多出来的一部分也可能是在 URL 中输入了 `xxx" onerror="alert(1)`（将图片地址作为 URL 参数）。他把 src 属性的双引号提前关闭了。解决办法就是转义双引号和单引号。  

```js
var escapeHtmlProperty = function(str){
    if(!str)    return "";
    return str.replace(/"/g,'&quto;')
              .replace(/'/g,'&#39;');
}
```

## 3. JS 注入转义

在做 get 请求时，通常会往 URL 上传入参数，前端经常也会解析 URL，拿到 url 中的参数。如果将 url 中的参数直接插入到 DOM 中，这就有可能构成 XSS 攻击，攻击者利用这一漏洞，给其他用户发送一个有恶意的链接，用户就有可能中招。例如下面这个 URL：  

```
http://www.example/test.index?param=<script>alert('XSS')</script>
```

这个 URL 的 `param` 参数值并不是合理的，而是攻击者构建的。

将 JavaScript 中的变量内容直接插入到 URL 中也可能是有风险的。  

```js
var escapeForJs = function(str){
    if(!str)    return "";
    // 通过 json 进行转义
    return JSON.stringify(str);
}
```

## 4. 富文本过滤
富文本比前三个都容易触发 XSS 漏洞（尤其是存储型XSS），这是因为富文本中的文本内容实质上就是 HTML 代码片段。要想防御 XSS，就需要做过滤操作。  

过滤可分为白名单过滤和黑名单过滤。  

### 黑名单过滤
黑名单过滤就是不让某些标签或属性出现在富文本中。我们可以利用正则匹配，将匹配到的内容替换掉。  

```js
var xssFilter = function(html){
    if(!html)   return html;
                // 过滤 script 标签
    html = html.replace(/<\s*\/?script\s*>/g,"")
                // 过滤带有 javascript 标志的脚本（比如 a 标签）
               .replace(/javascript:[^'"]*/g,"")
               // 过滤 onerror 事件函数
               .replace(/onerror\s*=\s*['"]?[^'"]*['"]?/g,"")
               // ....

    return html;
}
```

黑名单过滤法不一定能过滤“干净”，毕竟 XSS 攻击类型众多，有些攻击手段不一定被过滤到。

### 白名单过滤
白名单过滤就是保留部分标签和属性。  

白名单过滤可以使用 JavaScript 中的一个第三方库：`cheerio`。可以使用 npm 进行下载或者 script 标签进行引入。  

cheerio 提供了一个 `load` 函数，该函数接受一个 html 字符串，返回一个虚拟的DOM实例，这个实例中有许多 DOM 选择器，用法和 jQuery 很像。  

```js
const cheerio = require("cheerio");

// $ 变量就可以像使用 jQuery 一样的选择器去选择 HTML 中的节点了！
var $ = cheerio.load(html);
```

白名单函数：
```js
import cheerio from "cheerio";

var xssFilter = function(html){
    var $ = cheerio.load(html);
    // 允许保留的标签和属性
    var whiteList = {
        'img': ["src"],
    };

    // 选中所有的元素
    $("*").each(function(idx,elem){
        // 如果白名单中没有这个元素，就把这个元素从 HTML 中删除
        if(!whiteList[elem.name]){
            $(elem).remove();
            return;
        }   
        // 遍历符合条件的标签中的属性，看看该属性在不在白名单中
        for(var attr in elem.attributes){
            if(whiteList(elem.name).indexOf(attr) === -1){
                $(elem).attr(attr,null);    // 将不符合条件的属性值都设成 null
            }
        }
    });

    // 最后返回处理好的 html 片段
    return $.html();
}
```

### 使用 XSS 防御库
当然，有关 XSS 防范的 JavaScript 库也有许多，比如：xss（名字就叫 xss）库。使用 npm 下载然后使用即可：

```shell
npm i xss
```

使用时直接引入即可：  

```js
import filterXSS from "xss";

var html = filterXSS('<script>alert("xss");</scr' + 'ipt>');
console.log(html);      // &lt;script&gt;alert("xss");&lt;/script&gt;
```

还支持自定义白名单。只需在 `filterXSS` 函数的第二个参数传入一个对象即可。对象的键是标签名，值是一个数组，里面传入的是标签的属性，表示这些属性不会被过滤，不在数组中的属性会被过滤。当 `whiteList` 的值是一个空数组时，表示去除所有的 HTML 标签，只保留文本内容。  

```js
var options = {
    whiteList: {
        a: ["href", "title", "target"],
    }
}
```

除此之外，xss 库还可以指定更细致的标签处理函数过滤 HTML 代码，使用详情可以参考 GitHub 仓库文档： [js-xss](https://github.com/leizongmin/js-xss/blob/master/README.zh.md)

## 浏览器内置防御手段

浏览器中都内置了一些对抗 XSS 的措施。尽量不使用特别低版本的浏览器。因为它们的防御措施可能并没有那么丰富。

### CSP

CSP（内容安全策略） 是一个 HTTP 头：`Content-Security-Policy`。这个头用于检测和减轻用于 Web 站点的特定类型的攻击，例如 XSS 和数据注入等。设定这个头可以过滤跨域的文件，比如只允许本站的脚本被浏览器接收，而别的域的脚本会失效，不被执行。具体用法可以参考 MDN：[https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP)  

### X-Xss-Protection
HTTP X-XSS-Protection 响应头是 Internet Explorer，Chrome 和 Safari 的一个功能，当检测到跨站脚本攻击 (XSS)时，浏览器将停止加载页面。它有四种取值：  

1. `X-XSS-Protection: 0`：禁止浏览器启用 XSS 过滤。
2. `X-XSS-Protection: 1`：启用浏览器启用 XSS 过滤（通常浏览器默认的值）。
3. `X-XSS-Protection: 1;mode=block`：启用XSS过滤。 如果检测到攻击，浏览器将不会清除页面，而是阻止页面加载。
4. `X-XSS-Protection: 1; report=<reporting-uri>`：启用XSS过滤。 如果检测到跨站脚本攻击，浏览器将清除页面并使用 CSP report-uri指令的功能发送违规报告（`reporting-uri` 就是发送违规报告的 URL 站点）。  

### httpOnly

`HttpOnly` 最早是由微软提出，并在`IE 6`中实现的，至今已经成为一个标准。它可以让浏览器禁止客户端的 JavaScript 访问带有 httpOnly 属性的 `cookie`。