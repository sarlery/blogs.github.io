# XSS 攻击与防御

XSS（跨站脚本攻击）是一种常见的 web 安全问题。  

XSS 大致分为两种：**反射型**、**存储型**。  

## 反射型 XSS
反射型 XSS 攻击主要是将 JavaScript 脚本插入到 HTML节点中、HTML属性中以及 JS 注入。面对 XSS 漏洞，前端可以对有漏洞的代码做转义。  

### 1. HTML 节点内容

比如在评论页面，如果评论框中写入以下的内容并执行了，这就是一个 XSS 漏洞。

```html
<script>alert(1)</script>
```

要解决这样的问题，就需要对 `script` 标签进行转义：
```js
var escapeHtml = function(str){
    return str.replace(/</g,"&lt;")
              .replace(/>/g,"&gt;");
}
```

### 2. 提前关闭 HTML 属性
比如一个 img 标签原来的样子是：`<img src="xxx">`。而经过改造后可能变成这样：  

```html
<img src="xxx" onerror="alert(1)">
```

多出来的一部分可能就是在 URL 中输入了 `xxx" onerror="alert(1)`。他把 src 属性的双引号提前关闭了。解决办法就是转义双引号和单引号。  

```js
var escapeHtmlProperty = function(str){
    if(!str)    return "";
    return str.replace(/"/g,'&quto;')
              .replace(/'/g,'&#39;');
}
```

### 3. JS 注入转义
将 JavaScript 中的变量内容直接插入到 URL 中也可能是有风险的。  

```js
var escapeForJs = function(str){
    if(!str)    return "";
    // 通过 json 进行转义
    return JSON.stringify(str);
}
```

### 4. 富文本过滤
富文本比前三个都容易触发 XSS 漏洞，这是因为富文本中的文本内容实质上就是 HTML 代码片段。要想防御 XSS，就需要做过滤操作。  

过滤可分为白名单过滤和黑名单过滤。  

#### 黑名单过滤
黑名单过滤就是不让某些标签或属性出现在富文本中。  

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

#### 白名单过滤
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

## CSP

CSP（内容安全策略） 是一个 HTTP 头：`Content-Security-Policy`。这个头用于检测和减轻用于 Web 站点的特定类型的攻击，例如 XSS 和数据注入等。具体用法可以参考 MDN：[https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP)  

## X-Xss-Protection
HTTP X-XSS-Protection 响应头是Internet Explorer，Chrome和Safari的一个功能，当检测到跨站脚本攻击 (XSS)时，浏览器将停止加载页面。它有四种取值：  

1. `X-XSS-Protection: 0`：禁止浏览器启用 XSS 过滤。
2. `X-XSS-Protection: 1`：启用浏览器启用 XSS 过滤（通常浏览器默认的值）。
3. `X-XSS-Protection: 1;mode=block`：启用XSS过滤。 如果检测到攻击，浏览器将不会清除页面，而是阻止页面加载。
4. `X-XSS-Protection: 1; report=<reporting-uri>`：启用XSS过滤。 如果检测到跨站脚本攻击，浏览器将清除页面并使用 CSP report-uri指令的功能发送违规报告（`reporting-uri` 就是发送违规报告的 URL 站点）。  

