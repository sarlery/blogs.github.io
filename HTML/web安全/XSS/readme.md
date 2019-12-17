# XSS 攻击与防御

XSS（跨站脚本攻击）是一种常见的 web 安全问题。  

XSS 大致分为两种：**反射型**、**存储型**。  

## 反射型 XSS
反射型 XSS 攻击主要是将 JavaScript 脚本插入到 HTML节点中、HTML属性中以及 JS 注入。面对 XSS 漏洞，前端可以对有漏洞的代码做转义。  

### HTML 节点内容

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