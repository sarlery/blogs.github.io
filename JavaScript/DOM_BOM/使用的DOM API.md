# 几个常用的 API

## 1. classList.contains

这个方法可以判断某个元素节点是否有某个 class 类名，返回布尔值。比如：  

```js
// div 元素是否有 wrapper 类名
div.classList.contains("wrapper");  
```

封装：

```js
function hasClassName(el, className){
    return el.classList.contains(className);
}
```
### node.contains

除了 classList.contains 方法之外，还有一个 `node.contains` 方法，这个方法返回的是一个布尔值，来表示传入的节点是否为该节点的后代节点。语法：  

```js
node.contains(otherNode);
```

写成函数的形式：  

```js
function nodeContains(parent, child){
    return parent !== child && parent.contains(child);
}
```

## 2. classList.toggle
这个 API 可以切换 class 类名，来回的删除、添加指定的类名。这个 API 可以让我们很方便的实现动画效果。比如下面的例子：  

```html
<style>
    .wrapper{
        height: 100px;
        width: 100px;
        border: 1px solid #dddddd;
        transition: background-color 1s;
    }
    .toggle{
        background-color: green;
    }
</style>

<body>
    <div class="wrapper"></div>
    <script>
        const div = document.querySelector(".wrapper");
        div.addEventListener("click", (e) => {
            div.classList.toggle("toggle");
        });
    </script>
    
</body>
```
效果：  

![class-toggle](img/DOM&#32;API/class-toggle.gif)  

把这个 API 封装成一个函数： 

```js
function toggleClassName(el, className){
    el.classList.toggle(className);
}
```

## 3. scrollIntoView

这个方法可以让当前的元素滚动到浏览器窗口的可视区域内。`a` 标签的 `href` 属性可以是哈希标记（#），当点击 a 标签时就会跳转到当前文档中的内部目标位置。`scrollIntoView` 与之相似，语法：  

```js
element.scrollIntoView(alignToTop?, scrollIntoViewOptions?);
```
两个参数都是可选的，`alignToTop` 是一个布尔类型参数，如果为 `true`，元素的顶端将和其所在滚动区的可视区域的顶端对齐。如果为 `false`，元素的底端将和其所在滚动区的可视区域的底端对齐。

`scrollIntoViewOptions` 是一个对象。它包含以下属性，这些属性都是可选的：  

- `behavior` 定义动画过渡效果， "auto"或 "smooth" 之一。默认为 "auto"；
- `block` 定义垂直方向的对齐， "start", "center", "end", 或 "nearest"之一。默认为 "start"。
- `inline` 定义水平方向的对齐， "start", "center", "end", 或 "nearest"之一。默认为 "nearest"。  

比如渲染一个歌曲列表，这个列表很长，手动滑动时很费力。这时可以在侧边 `fixed` 一个字母表，当点击某个字母时跳到以该字母开头的歌曲位置。

```html
<style>
    .ul{
        list-style: none;
    }
    .ul .letter{
        height: 160px;
        width: 100vw;
        border-bottom: 1px solid #aaaaaa;
        line-height: 160px;
    }
    .sideBar{
        position: fixed;
        right: 0;
        top: 30px;
    }
</style>
<body>
    <div class="wrapper">
        <ul class="ul">

        </ul>
        <ul class="sideBar"></ul>
    </div>
    <script>
        const ul = document.querySelector(".ul");
        const sideBar = document.querySelector(".sideBar");
        const songs = [         // 假如是后端的数据
            { name: "稻香", code: "d" },
            { name: "喜欢你", code: "x" },
            { name: "山水之间", code: "s" },
            { name: "我的梦", code: "w" },
            { name: "光年之外", code: "g" },
            { name: "忽然之间", code: "h" },
            { name: "芒种", code: "m" },
            { name: "red", code: "r" },
            { name: "红玫瑰", code: "h" }
        ];

        (() => {
            compare(songs, "code");
            render(songs);
            renderAlphabet(sideBar, handleClick);
        })();

        function compare(ary, prop, order = 1){
            ary.sort((a,b) => {
                if(a[prop] > b[prop]){
                    return order;
                }else if(a[prop] < b[prop]){
                    return -order;
                }else return 0;
            });
        }
        function renderAlphabet(wrapper, clickCb){
            for(let i = 0;i < 26;i ++){
                let li = document.createElement("li");
                let code = String.fromCharCode(i + 65);
                li.innerHTML = code;
                li.setAttribute("data-letter", code);
                li.addEventListener("click", (e) => clickCb(e, code));
                wrapper.appendChild(li);
            }
        }
        function handleClick(e, code){
            var el = document.querySelector(`.letter-${code}`);
            el && el.scrollIntoView(true);
        }
        function render(list){
            list.forEach(item => {
                var li = document.createElement("li");
                li.innerHTML = item.name;
                li.classList.add("letter", "letter-" + item.code.toLocaleUpperCase());
                ul.appendChild(li);
            });
        }
    </script>
</body>
```

效果：  

![scrollIntoView](img/DOM&#32;API/scrollIntoView.gif)

## 4. scrollBy

这个方法是 window 上的，元素上也有这个方法，但兼容性不太好。它用来在窗口中按指定的偏移量滚动文档。两种语法：  

```js
window.scrollBy(x,y);
window.scrollBy(options);
```
- `x` 是水平滚动的偏移量，单位：像素；
- `y` 是垂直滚动的偏移量，单位：像素；
- `options` 是一个包含三个属性的对象：  
  - `top`: 等同于 `x`;
  - `left`: 等同于 `y`;
  - `behavior`: 表示滚动行为，支持参数：`smooth` (平滑滚动)，`instant` (瞬间滚动)，默认值 `auto`，效果等同于 `instant`。  

`scrollBy` 中的 x、y是相对值。比如下面的例子，在手机端看小说时，当我们点击自动阅读时，页面就会慢慢滚动，这样我们就不用手动滑动了。  

```html
<style>
    .btn-group{
        position: fixed;
        bottom: 6vh;
        right: 1vw;
    }
    .start, .stop{
        padding: 1rem;
        background-color: rgba(0,128,0);
        color: wheat;
        border: 1px solid #eeeeee;
        font-size: 1.2rem;
        border-radius: 10px;
    }
    .stop{
        background-color: #f22;
    }
</style>
<body>
    <div class="wrapper">
        // 许多的文字 ...
    </div>
    <div class="btn-group">
        <button class="start">自动阅读</button>
        <button class="stop">停止</button>
    </div>
    <script>
        const start = document.querySelector(".start");
        var key = false;
        var handle = 0;     // 句柄
        // 添加事件
        start.addEventListener('click', function(){
            if(!key){
                key = true;
                play();
            }
        },false);
        document.querySelector(".stop").addEventListener("click",stop,false);

        function stop(){
            key = false;
            window.cancelAnimationFrame(handle);
        }
        function play(){
            handle = window.requestAnimationFrame(play);
            window.scrollBy(0, 10);
        }
    </script>
</body>
```

上面代码中，handle 是为了在点击 stop 时停止滚动。key 是为了“上锁”，如果不上锁，多次点击 start 按钮后页面回滚动的越来越快。而使用了 key 变量只有第一次点击 start 按钮后才起作用。点击 stop 按钮后再把锁解开。  

### 得知到达底部

这个应用还有一点问题，当滚动到底部后，如果用户往上滑动，这时 requestAnimationFrame 方法还在运作，我们应当在运动到底部时把它停下来。可以修改 play 中的代码：  

```js
function play(){
    handle = window.requestAnimationFrame(play);
    window.scrollBy(0, 10);

    // 返回元素内容高度的度量，包括由于溢出导致的视图中不可见内容。
    var scrollHeight = document.documentElement.scrollHeight;
    // 返回元素的内容垂直滚动的像素数
    var scrollTop = Math.ceil(document.documentElement.scrollTop);
    // 返回元素内部的高度(单位像素)，包含内边距，但不包括水平滚动条、边框和外边距。
    var clientHeight = document.documentElement.clientHeight;

    var res = scrollHeight - scrollTop - clientHeight;
    if(Math.abs(res) <= 4){
        alert("到达了底部");
        stop();
    }
}
```

`scrollTop` 是个小数，因此 `scrollHeight` + `scrollTop` 并不一定等于 `clientHeight`，因此有误差范围。 效果：  

![scrollBy](img/DOM&#32;API/scrollBy.gif)

这三个方法可能不同的浏览器返回的结果不同，可能有的浏览器 `document.body.scrollTop` 总是返回 0，而 `document.documentElement.scrollTop` 却是有值的。这时可以做兼容处理。

`scrollTop` 不一定兼容 IE，可以使用下面的方法来获取：  

```js
function getScrollTop(){
　　return document.documentElement.scrollTop || document.body.scrollTop;
}
```
`document.scrollingElement.scrollTop` 也可以获取到 scrollTop 的值。 `scrollingElement` 在标准模式下是文档的根元素： document.documentElement。
当在怪异模式下， `scrollingElement` 属性返回 HTML body 元素（若不存在返回 null ）。但在 IE 中并没有实现。

`scrollHeight` 也不一定兼容，需要做兼容处理：

```js
function getScrollHeight(){
　　return document.documentElement.scrollHeight || document.body.scrollHeight;
}
```

最后是 `clientHeight`：

```js
function getWindowHeight(){
　　var windowHeight = 0;
　　if(document.compatMode == "CSS1Compat"){
　　　　windowHeight = document.documentElement.clientHeight;
　　}else{
　　　　windowHeight = document.body.clientHeight;
　　}
　　return windowHeight;
}
```

与 `scrollBy` 类似的还有 `scrollTo` 属性，`scrollTo` 的参数不是相对像素，而是绝对的，即：元素的指定坐标位置。一个应用是它可以实现点击回到文档顶部的功能。  

```js
$(el).click(function(){
    window.scrollTo(0,0);
});
```

### 翻页效果

`scrollBy` 可以做翻页的效果。比如我们有四个页面，高度都是 100vh：

```css
body,
html {
    margin: 0;
    padding: 0;
    overflow: hidden;
}
.article {
    height: 100vh;
}
.article-1 {
    background-color: green;
}
.article-2 {
    background-color: red;
}
.article-3 {
    background-color: gold;
}
.article-4 {
    background-color: purple;
}
```

html 结构：

```html
<div class="wrapper">
    <div class="article article-1"></div>
    <div class="article article-2"></div>
    <div class="article article-3"></div>
    <div class="article article-4"></div>
</div>
```

然后就可以使用防抖 + 鼠标滚动事件实现了：  

```js
function throttle(fn, delay) {
    let valid = true
    return function (...args) {
        if (!valid) {
            return false
        }
        valid = false
        setTimeout(() => {
            fn(...args);
            valid = true;
        }, delay);
    }
}
document.addEventListener("mousewheel", throttle(scroll, 200),false);
function scroll(e){
    var wheelDelta = e.wheelDelta;
    if (wheelDelta < 0) {
        window.scrollBy({
            top: window.innerHeight,
            left: 0,
            behavior: "smooth"
        });
    } else {
        window.scrollBy({
            top: -window.innerHeight,
            left: 0,
            behavior: "smooth"
        });
    }
}
```

`behavior: "smooth"` 可以让滚动有平滑效果。

![scrollBy 翻页](img/DOM&#32;API/scrollBy翻页.gif)  

如果是客户端就要使用touch事件。思路：比较 touchsart 以及 touchend 事件中 Y 轴的坐标位置之差来判断是向上运动还是向下运动。需要注意的是，在 css 中应设置这么一个属性，当触控事件发生在元素上时，不进行任何操作，以使用自己提供的拖放和缩放行为。关于这个属性的更多用法可以参考 MDN 文档：[touch-action](https://developer.mozilla.org/zh-CN/docs/Web/CSS/touch-action)  

```css
*{
    touch-action: none;
}
```

然后是 js 代码：  

```js
const slider = {
    pageY: 0,
    pageY_end: 0,
    diff: 0,
    touchStart(e){
        this.pageY = e.changedTouches[0].pageY;
    },
    touchEnd(e){
        this.pageY_end = e.changedTouches[0].pageY;
        this.diff = this.pageY - this.pageY_end;
        var top = 0;

        if (this.diff > 0) {
            // 往下滑动
            top = this.height;
        } else if (this.diff < 0) {
            // 往上滑动
            top = -this.height;
        }
        window.scrollBy({
            top: top,
            left: 0,
            behavior: "smooth"
        });
    },
    init(el, height = window.innerHeight){
        this.height = height;
        var self = this;
        var { touchEnd, touchStart } = this;
        el.addEventListener("touchstart", touchStart.bind(self), false);
        el.addEventListener("touchend", touchEnd.bind(self), false);
    }
}
slider.init(document);
```


## 5. 表单验证属性

几个常见的表单约束属性：

- `pattern` 给输入框指定正则表达式，用户输入的 value 必须匹配正则表达式才可验证通过；
- `maxlength` 用户可以输入文本输入框中的最大字符；
- `minlength` 用户可以输入文本输入框中的最小字符数；
- `required` 表示这个表单控件的值不能为空；
- `min` 对于 type="number" 的表单而言，小于指定的 min 值则无效；
- `max` 对于 type="number" 的表单而言，大于指定的 max 值则无效；

然后是两个有用的伪类，伪类可用于设置表单元素的样式，以帮助用户查看其值是有效还是无效。  

- `:valid` 表示内容验证正确的 `<input>` 或其他 `<form>` 元素。
- `:invalid` 任意内容未通过验证的 `<input>` 或其他 `<form>` 元素。  

比如下面的例子：  

```html
<style>
    input[type='text']:valid + span::after{
        content: "✅";
        color: green;
    }
    input[type='text']:invalid{
        border: 1px solid red;
    }
    input[type='text']:invalid + span::after{
        content: "❌";
        display: none;
    }
    span::after{
        padding-left: 10px;
    }
    input[type='text']:focus + span::after{
        display: inline;
    }
</style>

<form>
    nickname：<input type="text" name="nickname" pattern="\w{6,20}" required /><span></span>
    <br />
    email：<input type="email" required /><span></span>
    <br />
</form>
```

效果：

![input invalid](img/DOM&#32;API/input-pattern.gif)  

通过上面的例子会发现，valid/invalid 伪类就像输入监听器一样。`pattern` 书写的正则表达式不要用 `//` 进行包裹。 

除了上面两个伪类之外还有一个成对的伪类用于 number、range、time、week、date等有 `min` 和 `max` 属性类型的输入框：  

- `:in-range` 其当前值处于属性 `min` 和 `max` 限定的范围之内；
- `:out-of-range` 其当前值处于属性 `min` 和 `max` 限定的范围外。

### 自定义错误消息

我们可以自定义验证错误的信息，但这需要 JavaScript 的介入。比如下面的 input 标签，使用了 `pattern` 作为验证依据。

```html
<form>
    <input type="text" name="nickname" pattern="\w{6,20}" required />
    <button type="submit">提交</button>
</form>
```

如果错误时 chrome 浏览器会把这样的警告：  

![chrome-warn](img/DOM&#32;API/chrome-warn.png)  

但这种提醒是模糊的，要想自定义消息。可以使用 JavaScript 自定义消息，或者使用下面的 API：  

```html
<form>
    <input type="text" id="nickname" name="nickname" pattern="\w{6,20}" required />
    <button type="submit">提交</button>
</form>

<script>
    var nickname = document.getElementById("nickname");
    nickname.addEventListener("input", function (event) {
        if (nickname.validity.patternMismatch) {
            nickname.setCustomValidity("你应该输入6-20个长度的字母或数字！");
        }else{
            nickname.setCustomValidity("");
        }
    });
</script>
```

上面代码中，`validity` 是一个对象，它有以下几个属性，这些属性的值都是布尔类型，这些属性的值为 true 时就说明表单内容验证没有通过。  

- `customError` 该元素的自定义有效性消息已经通过调用元素的 `setCustomValidity()` 方法设置成为一个非空字符串；
- `patternMismatch` 该元素的值与指定的 `pattern` 属性不匹配；
- `rangeOverflow` 该元素的值大于指定的 `max` 属性；
- `rangeUnderflow` 该元素的值小于指定的 `min` 属性；
- `stepMismatch` 该元素的值不符合由 `step` 属性指定的规则；
- `typeMismatch` 该元素的值不符合元素类型所要求的格式(当type 是 email 或者 url时)；
- `valid` 其他的约束验证条件都不为 `true`；
- `valueMissing` 该元素有 required 属性,但却没有值；  

`setCustomValidity()` 方法就是消息通知。除了使用这些 API 之外，当然也可以完全自定义。

关于表单验证可以参考 MDN 文档：  

[Web 表单校验](https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Forms/Data_form_validation)  


## 6. encodeURIComponent

这个方法是 JavaScript 内部的方法，它不属于 DOM。`encodeURIComponent` 转义除了字母、数字、和下面字符之外的所有字符。  

- `(`
- `)`
- `.`
- `!`
- `~`
- `*`
- `'`
- `-`
- `_`  

为了避免服务器收到不可预知的请求，对任何用户输入的作为URI部分的内容你都需要用 `encodeURIComponent` 进行转义。因此我们可以看到，有些网址会有如下的字符串：

```url
query=pear%0D%0A
```

这是经过该方法转义的字符串。当你前端程序开发者编写 get 请求时，query 参数应该使用该方法进行转义。而对于 `application/x-www-form-urlencoded` (POST方法，key-value 形式的字符串) 这种数据方式，空格需要被替换成 '+'，所以通常使用 `encodeURIComponent` 的时候还会把 "%20" 替换为 "+"。

比如下面的数据，如果提交时不使用 `encodeURIComponent` 转义一下，发到服务端就会变成这样的数据：`你 好 呀      `（`+` 变成了空格）  

```js
var xhr = new XMLHttpRequest();
xhr.open("POST", "/urlencoded");
xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded")
xhr.onreadystatechange = function(){
    if(xhr.readyState === 4){   
        if(xhr.status === 200){
            console.log(xhr.response);
        }
    }
}
xhr.send("name=你 好 呀 + + +&age=18&gender=male");
```

`decodeURIComponent` 是用于解码的。

下面是一个将对象转成 key-value 字符串的函数：  

```js
function encode(obj) {
    var str = '';
    Object.keys(obj).forEach(key => {
        str += encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]) + '&';
    });
    var res = str.substring(0, str.length - 1);
    return res;
}
```

除了这两个方法之外，还有一对与之类似的方法：  

- `encodeURI` 将特定字符的每个实例替换为一个、两个、三或四转义序列来对统一资源标识符 (URI) 进行编码。它的参数是一个完整的 URI。返回一个新字符串，表示提供的字符串编码为统一资源标识符 (URI)。下面是该方法不会转义的字符：  

    - `;` `,` `/` `?` `:` `@` `&` `=` `+` `$` `#`  
    - 字母 数字 `-` `_` `.` `!` `~` `*` `'` `(` `)`  

`encodeURI` 自身无法产生能适用于HTTP GET 或 POST 请求的 URI，例如对于 XMLHTTPRequests, 因为 "&", "+", 和 "=" 不会被编码，然而在 GET 和 POST 请求中它们是特殊字符。因此一般不使用这个方法转义请求的数据，而是使用 `decodeURIComponent/encodeURIComponent`。  

- `decodeURI` 函数解码一个由 `encodeURI` 先前创建的统一资源标识符。

## 7. 表单元素转成对象

通过 `document.forms` 可以获取到当前文档中 form 元素的集合，而使用 `form.elements` 可以获取到 form 表单中的表单元素。使用 FormData 类可以将表单中的数据转成类似 map 的数据结构。下面是一个将 form 表单元素数据转成对象的函数：  

```js
function formToObject(formEl){
    return Array.from(new FormData(formEl)).reduce(
        (acc, [key, value]) => ({
            ...acc,
            [key]: value
        }),{}
    );
}
```

上面代码中，Array.form 方法可以将 `Map` 生成数组，比如下面的代码，map 经过 array.from 加工后变成了一个二维数组。  

```js
var map = new Map();
map.set("nickname", "dyzq");
map.set("age", 18);
map.set("gender", "male");

console.log(Array.from(map));
/* 
[
    ["nickname", "dyzq"],
    ["age", 18],
    ["gender", "male"]
]
*/
```
`[key, value]` 是数组解构赋值。acc 累加器初始值是空对象。

## 8. File、Blob、ArrayBuffer 相互转换

假如后端传过来一个 `a.jpg` 图片文件，但这个文件的数据类型是 `ArrayBuffer`，想要用 `URL.createObjectURL` 展示图片，如何做到？  

`createObjectURL` 函数的参数是 `File` 对象、`Blob` 对象或者 `MediaSource` 对象。​因此就要将 `ArrayBuffer` 转成这三者中的其一类型。  

### ArrayBuffer、File 相互转换

ArrayBuffer 转成 File 直接调用 new File 构造函数即可：  

```js
function bufToFile(buf, filename){
    return new File([buf], filename);
}
```

File 函数的第一个参数是一个包含`ArrayBuffer`，`ArrayBufferView`，`Blob`，或者 `DOMString` 对象的数组，第二个参数表示文件名称。

File 转成 ArrayBuffer 需要借助 `FileReader` 类。  

```js
function fileToBuf(file, cb){
    var fr = new FileReader();
    var filename = file.name;

    fr.readAsArrayBuffer(file);
    fr.addEventListener("loadend",(e) => {
        var buf = e.target.result;
        cb(buf, filename);
    },false);
}
```

上面函数中，fr 是 FileReader 的实例，`readAsArrayBuffer` 可以读取指定的 `Blob` 或 `File` 内容，当读取完成后会触发 `loadend` 事件，同时 `result` 属性中将包含一个 `ArrayBuffer` 对象以表示所读取文件的数据。我们的 `fileToBuf` 接受一个回调，它接受 ArrayBuffer 和 filename 两个参数。  

### ArrayBuffer 与 Blob 互转

首先说一下 ArrayBuffer 转成 Blob。跟 ArrayBuffer 转成 File 很像。也是调用 `new Blob` 构造函数：  

```js
function bufToBlob(buf, mimeType = ""){
    return new Blob([buf], { type: mimeType });
}
```

Blob 函数的第二个参数与 File 函数的第二个参数略有不同，Blob 是一个对象，对象中有一个 type 属性，默认值为 ""，它代表了将会被放入到blob中的数组内容的 `MIME` 类型。Blob 的第一个参数也是一个由 `ArrayBuffer`, `ArrayBufferView`, `Blob`, `DOMString` 等对象构成的数组。  

> `DOMString` 是 DOM 字符串，比如：`<a id="a"><b id="b">hey!</b></a>`。它的 type 则是：`text/html`。  

然后是 Blob 转成 ArrayBuffer。Blob 转成 ArrayBuffer 也是通过 FileReader 类进行转换。上面的 File 转 ArrayBuffer 我们稍微更改一下即可：  

```js
function blobToBuf(blob, cb){
    var fr = new FileReader();
    var type = blob.type;

    fr.readAsArrayBuffer(blob);
    fr.addEventListener("loadend",(e) => {
        var buf = e.target.result;
        cb(buf, type);
    },false);
}
```

或者将两个函数写成一个，可以使用 `Object.prototype.toString.call` 作为判别依据。  

### Blob 与 File 互转

`File` 对象其实是特殊类型的 `Blob`，且可以用在任意的 Blob 类型的上下文中。比如说，`FileReader`, `URL.createObjectURL()`, `createImageBitmap()`, 及 `XMLHttpRequest.send()` 都能处理 `Blob` 和 `File`。File 接口也继承了 Blob 接口的属性。这两个东西互转感觉没必要，如果要转的话，可以利用 FileReader 作为桥梁，先转成 ArrayBuffer，然后在转成相应的 Blob 或者 File。

通过设置一个XMLHttpRequest 对象的 responseType 属性来改变一个从服务器上返回的响应的数据类型。可用的属性值为空字符串 (默认), "arraybuffer", "blob", "document","json" 和 "text"。比如后端如果发送的是一个二进制图像文件，在前端可以指定接受类型是 `blob`，这样 response 数据将是 blob 类型的数据。  

```js
var xhr = new XMLHttpRequest();
xhr.open("GET", "/myfile.png", true);
// 指定接受类型
xhr.responseType = "blob";

xhr.onload = function(oEvent) {
    var blob = xhr.response;
    // ...
};

xhr.send();
```

发送二进制文件到服务端的话，`XMLHttpRequest` 对象的`send`方法已被增强，可以通过简单的传入一个`ArrayBuffer` `Blob`, 或者 `File`对象来发送二进制数据。

有关 `XMLHttpRequest` 接受和发送二进制数据可以参考 MDN 上的文档：  

[发送和接收二进制数据](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/Sending_and_Receiving_Binary_Data)  


