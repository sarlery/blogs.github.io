# DOM、BOM一些兼容性问题
汇集了许多关于DOM和BOM的兼容性问题，主要是关于 IE 浏览器的，考虑到浏览器迭代，这里主要列出了 IE8 以及之后的浏览器版本。  
IE8 浏览器在 2008年推出，距现在（2019）已有11年之久，已经是很老的一款浏览器了。但是在一些项目中，可能仍需要考虑到兼容性，如果兼容到 IE8 已经是很兼容了，毕竟该浏览器也几乎没多少市场份额了。多是一些机构或政府部门在使用。 而有些兼容性问题也可能是其它浏览器之间的差异，比如 Chrome 和 FireFox 对于鼠标滚轮事件对象的滚轮方向判断方式不同，Chrome使用 wheelDelta，而FireFox 则采用 detail 做判断。下面将一一说明或做补充实现来尽量弥补浏览器之间的差异。其实大部分就是为了兼容 IE 早期浏览器。  

## DOM 部分
DOM 即：文档对象模型，其中定义了许多操作 HTML 文档内容的 API，在早期的浏览器中，特别是 IE，有些API是不支持的，或者API的名称或功能和标准不太一样，这样就造成了差异。  
### DOM 选择器的差异
#### `getElementById` 和 `getElementsByName`  
在低于 IE8 版本（不包括 IE8）的浏览器中，这两个选择器匹配的元素的 ID/name 值是不区分大小写的！而且这两个方法不仅能匹配到有ID值的元素，还能匹配到name属性的元素（互通！），比如：页面上有两个元素，一个元素有 ID属性，值为"main"，而另一个元素有name属性，这个属性的值也是"main"，这样调用`ById` 的方法可能会匹配到 "name=main" 的元素，同样的`ByName` 的方法也可能匹配到"id=main"的元素。  
因此，如果要兼容 IE8 版本以下的浏览器，最好小心使用，不要将同样的字符串同时用作 `name` 或 `id`。  

#### `getElementsByClassName()` 
这个属性除了 **IE8 以及更早的版本没有实现外，所有浏览器都实现了**。 而 IE8 支持 `querySelectorAll()` 和 `querySelector()` 方法，可以使用它来代替使用 `getElementsByClassName()` 方法。  

#### 选取子类和兄弟元素
这里主要是四个属性，分别是：  
+ `firstElementChild` 获取元素的第一个子元素；
+ `lastElementChild` 获取元素的最后一个子元素；
+ `nextElementSibling` 获取这个元素的下一个兄弟元素；
+ `previousElementSibling`获取这个元素的上一个兄弟元素；  

上面四个方法在 IE 中并没有实现（IE 8 及其以下版本）。  
我们可以自己实现一下这四个属性。  

先实现一下后两个属性  
`element._nextElementSibling()` 返回元素的下一个兄弟元素，如果没有则返回 `null` :
```js
Element.prototype._nextElementSibling = function(){
    if('firstElementChild' in Element.prototype) 
        return this.firstElementChild;
    var node = this.nextSibling;
    while(node){
        if(node.nodeType === 1){
            return node;
        }else{
            node = node.nextSibling;
        }
    }
    return null;
}
```
上面代码中 `in` 运算符在 IE8 及其以上版本是支持的，可以使用，`node.nextSibling` 和 `node.nodeType` 属性在 IE8 上也是支持的，前者表示获取一个结点（是结点，而非元素结点）的下一个兄弟节点（而不一定是元素节点）；后者是指获取一个结点的结点类型，当 nodeType === 1时，表示该结点是一个元素结点。不同的结点它的节点类型也不相同：  

![](./img/nodeType.png)  

需要注意的是，在支持的浏览器中，`nextElementSibling` 是只读的，因此可以使用 `Object.defineProperty` 方法改造一下，这个方法 IE8 也是支持的。  
```js
if(!("nextElementSibling" in Element.prototype)){
    Object.defineProperty(Element.prototype, "nextElementSibling", {
        get: function(){        // 只有 get 方法，没有 set
            var node = this.nextSibling;
            while(node && 1 !== node.nodeType)
                node = node.nextSibling;
            return node;
        }
    });
}
```

接着实现 `previousElementSibling` ：
```js
if(!("previousElementSibling" in Element.prototype)){
    Object.defineProperty(Element.prototype, "previousElementSibling", {
        get: function(){        // 只有 get 方法，没有 set
            // 这里使用的是 previousSibling 方法
            var node = this.previousSibling;
            while(node && 1 !== node.nodeType)
                node = node.previousSibling;
            return node;
        }
    });
}
```

实现前两个方法  
`firstElementChild` —— 返回元素的第一个子元素。没有找到则返回 `null`
```js
if (!("firstElementChild" in Element.prototype)) {
    Object.defineProperty(Element.prototype, "firstElementChild", {
        get: function () { // 只有 get 方法，没有 set
            var node = this.childNodes,
                len = node.length;
            for(var i = 0;i < len;i ++){
                if(node[i].nodeType === 1){
                    return node[i];
                }
            }
            return null;
        }
    });
}
```
这里使用了 `node.childNodes` 方法，这个方法返回这个结点中的所有子结点（不光有元素节点）。然后从第一个子结点开始遍历，找到第一个子元素节点。  
同样的，`lastElementChild` 只需要将循环从 len - 1 开始遍历就会得到最后一个子元素结点：
```js
if (!("lastElementChild" in Element.prototype)) {
    Object.defineProperty(Element.prototype, "lastElementChild", {
        get: function () { // 只有 get 方法，没有 set
            var node = this.childNodes,
                len = node.length;
            for(var i = len - 1;i >= 0;i --){
                if(node[i].nodeType === 1){
                    return node[i];
                }
            }
            return null;
        }
    });
}
```

### `textContent`
`textContent` 属性就是将指定的元素的所有后代的Text结点简单的串联在一起。而 `innerText` 没有一个明确指定的行为。
`textContent` 和 `innerText` 功能很相似，但又有一些不同，具体不同大致有这些：  
+ `innerText` 不返回 `<script>` 元素里的内容，而且他还会忽略多余的空白，并试图保留表格格式；
+ `innerText` 元素针对某些表格元素只有只读属性（如：`<table>`、`<tbody>`、`<tr>`）；
+ `innerText` 受 CSS 样式的影响（可能会触发重排），并且不会返回隐藏元素的文本，而 `textContent` 会；
+ `textContent` 会获取所有元素的内容，包括 `<script>` 和 `<style>` 元素；  

![textContent](./img/textContent.png)  

#### 实现一个 `textContent` 
在 IE8 及其以下版本，该属性是没有的，而 `innerText` 属性是存在的。可以利用 innerText 来实现。
```js
if(!("textContent" in Element.prototype)){
    Object.defineProperty(Element.prototype,"textContent",{
        get: function(){
            return innerText;
        },
        set: function(value){
            this.innerText = value;
        }
    });
}
```
上面直接返回 innerText 作为读取结果 也可以在复杂一点，利用 childNodes 和递归来实现 get 函数：
```js
if(!("textContent" in Element.prototype)){
    Object.defineProperty(Element.prototype,"textContent",{
        get: function(){
            var str = '';
            function getContent(node){
                var childs = node.childNodes,
                    len = childs.length;
                for(var i = 0;i < len;i ++){
                    /*
                        考虑到 IE8 中不能使用 let 关键字
                        需要使用 var + 立即执行函才行
                    */
                    (function(i){
                        if(!childs[i]){
                            return;
                        }
                        if(childs[i].nodeType === 3){
                            // IE 当中不是直接的一个字符串内容，而是一个对象，
                            // 对象当中的 data 属性存在着文本内容
                            str += childs[i].data;
                        }else{
                            getContent(childs[i]);
                        }
                    })(i);
                }
            }
            getContent(this);
            return str;
        },
        set: function(value){
            this.innerText = value;
        }
    });
}
```

DOM 中兼容 IE8 版本及其以上的一些 API 大概有那么多。下面来看看有关尺寸方面的 API，这些 API 运行 JavaScript 操作 CSS，这些 API 属于 CSS 对象模型（CSSOM）。  
## CSSOM
### `window.pageXoffset` 和 `window.pageYoffset`
这两个属性分别返回文档在水平/垂直方向已滚动的像素值。注意是 **文档**，整个文档内容有时会很多，会出现滚动条，比如淘宝网，垂直方向就会出现滚动条。  
在多部分浏览器中还实现了另一对属性：`window.scrollX` 和 `window.scrollY` 这两个属性作用和 `pageX/Yoffset` 一样（或说完全相同），遗憾的是在 IE9 之前 这两个属性都没有，IE9 之后实现了 `pageX/Yoffset` 属性，但一直没有 `scrollX/Y` 属性（其实有一个就行了）。  
这两个属性既可读也可写，但是最好不要进行写操作，因为写操作只是单纯的赋值，写之后页面不会有明显的变化（比如滚动条会滚动到指定的地方），如果要进行写入操作，可以使用 [`window.scrollTo`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/scrollTo) 或者 [`window.scrollBy`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/scrollBy) 两个方法。  

![](./img/scrollX_Y.png)

看一下面的一个例子，在这个例子中，当页面滚动时，页面就会显示文档在垂直方向滚动的距离：
```html
<body>
    br*100      <!-- 这里放了100 个br，为了看到滚动条 -->
    <style>
        div{
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            font-size: 30px;
            font-weight: 700;
            color: red;
            height: 40px;
            line-height: 40px;
            width: 200px;
            padding: 10px 20px;
            text-align: center;
            border: 2px dashed #12accc;
        }
    </style>

    <div>scrollY: <span>0</span></div>

    <script>
    
        var span = document.querySelector('span');

        window.onscroll = function(){
            span.innerText = Math.floor(window.pageYoffset);
        }
    
    </script>

</body>
```
#### 兼容处理
```js
if(!('pageXoffset' in window)){
    Object.defineProperty(window,'pageXOffset',{
        get: function(){
            return (document.documentElement || document.body.parentNode || document.body).scrollLeft;
        },
        set: function(value){
            return value;
        }
    });
    Object.defineProperty(window,'pageYOffset',{
        get: function(){
            return (document.documentElement || document.body.parentNode || document.body).scrollTop;
        },
        set: function(value){
            return value;
        }
    });
}
```
对于 `scrollX/Y` 的处理也是类似，因为 IE8 中未实现 `Object.defineProperties()` 方法，因此只能一个一个的来进行处理。在 set 函数中也可以添加条件判断，对传入的值进行限定。也可以添加 `configurable` 和 `enumerable` 等的选项。  

### `element.getBoundingClientRect()`
该方法会返回一个只读的对象，这个对象包含元素的几个几何尺寸：  

![](./img/getBoundingClientRect.png)  

除了图片中提到的top、left、right 和 bottom 属性之外，还会返回两个属性 —— height 和 width 属性。图中的四个属性是相对于 **视口** 坐标位置而言的（**但在 IE 中，却是相对于整个文档的！**）。后两个属性的值不光包括 CSS 中设置的 width 和 height 属性值，还有设置的 border 和
padding两个属性值（即:视觉上的宽度或高度）。  
但在 IE 中并没有 height 和 width 这两个属性，在 Chrome 和 FireFox 中还额外有两个属性 —— x 和 y，这两个属性相对于视口坐标位置，分别表示该元素的左上角距离视口最左侧或最顶部的距离。  

![](./img/x_y.png)  

#### 兼容性处理  
这里如果重写该方法，很难做到原来的效果。特别是对于 top、left、bottom、right 这里是个属性，如果用 offsetTop 来实现是会存在风险的，因为 offsetTop 是相对于具有定位的父元素而言的，而不一定相对于视口。  

![](./img/offsetTop.png)  

在这里只实现以下 width 和 height（x 和 y 和 对象中的 left、top 是一样的）。
```js
var box = elem.getBoundingClientRect();
var w = box.width || (box.right - box.left),
    h = box.height || (box.bottom - box.top);
```
至于 IE 中 top 等四个属性返回的是相对于文档的值，可以利用以下运算或得到相对于视口的结果：  
```js
var top = (document.body.scrollHeight || document.documentElement.scrollHeight) - window.pageYOffset - div.offsetHeight;
var left = (document.body.scrollWidth || document.documentElement.scrollWidth) - window.pageXOffset - div.offsetWidth;
```
`document.body.scrollHeight/Width` 会返回 整个文档的高度/宽度。  
需要注意的是：`getBoundingClientRect()` 方法所返回的矩形对象并不是实时的，它只是调用方法时文档视觉状态的静态快照，在用户滚动或改变浏览器窗口大小时不会更新它们（当再次调用时值才会变）。与该方法类似的还有 [`getClientRects`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getClientRects) ，他返回的是一个类数组对象，主要用于获取内联元素位置参数，一般用的也不多。  

### `window.getComputedStyle()`