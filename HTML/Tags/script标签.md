# <script> 标签

HTML中的 `<script>` 标签用来加载外部脚本或者编写内联脚本。但在开发中很可能会遇到 `<script>` 标签中的代码执行不太对的情况。  

比如下面的例子，编写内联脚本时，动态获取一个图片的宽度，获取的结果总是零。这是因为内敛脚本在执行时图片并没有缓存下来，导致获取宽度失败。  

```html
<body>
    <img src="./img/01.png" />

    <script>

        let img = document.querySelector('img');

        console.log(img.offsetWidth);   // 0

    </script>

</body>
```

这是因为页面在执行时，遇到 `<script>` 标签都会让页面等待脚本的解析和执行。无论JavaScript代码是内嵌的还是外链的，页面的下载和渲染都必须停下来等待脚本执行完成。  

## onload 事件

使用 onload 事件可以解决上面的问题。图片可以绑定一个 `onload` 事件，表示当图片加载完成后才触发执行脚本。  

```html
<body>
    <img src="./img/01.png" />

    <script>

        let img = document.querySelector('img');

        img.onload = function(){
            console.log(img.offsetWidth);
        }

    </script>

</body>
```

### window.onload 与 img.onload 的不同

`window.onload` 事件表示页面加载完成后才加载JavaScript代码。这里的 “页面加载完成” 指的是在文档装载完成后会触发  load 事件，此时，在文档中的所有对象都在 DOM 中，所有图片，脚本，链接以及子框都完成了装载。 而 `img.onload` 仅仅指的是图片装载完成。

有了 `onload` 事件我们可以把脚本写在 `<head>` 标签中。

```html
<head>
    <script>
        window.onload = function(){
            let img = document.querySelector('img');
            img.style.height = "300px";
            console.log(img.offsetWidth);
        }
    </script>
</head>
```

## 无阻塞脚本

除了上面 `onload` 事件可以延时脚本执行外，`<script>` 标签还有别的用法让脚本无阻塞的去执行。  

`<script>` 标签有两个属性 —— `defer` 和 `async`。`defer` 属性可以让JavaScript代码安全地延迟执行；而 `async` 属性可以让JavaScript代码异步的执行。  

### 两者的不同

`async` 和 `defer` 属性的相同点是采用并行下载（页面执行到带 `async` 或 `defer` 属性的标签时不会阻塞页面渲染，而是边下载脚本边渲染页面）。这两个属性不能用在内嵌脚本中（带 src 属性）。

`defer` 的作用并不像 `window.onload` 事件，`defer` 属性的脚本将在文档完成解析后，触发 DOMContentLoaded 事件前执行。（这时图片可能还没下载好）。当初始的 HTML 文档被完全加载和解析完成之后，DOMContentLoaded 事件会被触发，而无需等待样式表、图像和子框架的完成加载。

`async` 属性是在脚本加载完成后自动执行。该属性对于内联脚本是没有作用的。  

### 执行顺序

```html
<body>
    <script src="./index.js" defer></script>

    <script>
        alert("script");
    </script>

    <script>
        window.onload = function(){
            alert("load");
        }
    </script>
</body>

<!--
    index.js 内容：
    alert("defer");
-->
```

以上代码执行顺序："script" --> "defer" --> "load"  

## 动态生成的 `<script>` 标签

比如下面的代码：

```html
<script>
    var script = document.createElement('script');

    script.src = "./async.js";

    document.body.appendChild(script);


    // async.js 内容：
    // alert("async");
</script>
```

动态生成的 `<script>` 标签相当于带有 `async` 属性的 `<script>`。当被插入到文档中后脚本就会自动执行。  

### `<script>` 元素的 `load` 事件

动态生成的 `<script>` 标签可以接受一个 `onload` 事件，脚本加载完成时会被触发。

```html
<script>
    var script = document.createElement("script");
    script.src = './index.js';
    script.onload = function(){
        alert("脚本加载完成!");
    }
    document.body.appendChild(script);
</script>
```

### 通过 XMLHttpRequest 实现的脚本注入

通过 Ajax 请求也可以动态加载 js 文件。这种方式相当于创建一个新的 `<script>` 标签。当新创建的标签被添加到页面时，代码就会立刻执行然后准备就绪。  

```js
var xhr = new XMLHttpRequest();
xhr.open('GET','/index.js',true);

xhr.onreadystatechange = function(){
    if(xhr.readyState === 4){
        if(cxhr.status >= 200 && xhr.status < 300 || xhr.status === 304){
            var script = document.createElement('script');
            script.type = "text/jsvascript";
            // script 的内容是 相应的 JavaScript 文本
            script.text = xhr.responseText;
            document.body.appendChild(script);
        }
    }
}
```

使用这种方式加载代码时，JavaScript文件必须与所请求的页面处于相同的域，这意味着JavaScript文件不能从 CDN 下载。

## 组织脚本

由于每个 `<script>` 脚本都会阻塞页面渲染（当然除了有 defer 和 async 属性的标签）。那么在开发中应怎样改善这一情况呢？为了提高页面性能或者说体验，可以通过以下方式进行优化：  

1. 把多个脚本文件进行合并，这样可以减少网络请求数量。但并不是合并越多越好，文件太大还会导致阻塞事件变长。
2. 尽量 `<script>` 标签添加在 `<body>` 标签的最下方，这样可以避免阻塞渲染。
3. 使用 `onload` 事件避免阻塞渲染。
4. 把一段内嵌脚本放在 `<link>` 标签之后会导致页面阻塞去等待样式表的下载，这样做是可以确保内嵌脚本在执行时能获得最精确的样式信息。
