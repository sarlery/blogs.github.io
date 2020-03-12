# DOM API 使用技巧

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
　　var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
　　if(document.body){
　　　　bodyScrollTop = document.body.scrollTop;
　　}
　　if(document.documentElement){
　　　　documentScrollTop = document.documentElement.scrollTop;
　　}
　　scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
　　return scrollTop;
}
```
`document.scrollingElement.scrollTop` 也可以获取到 scrollTop 的值。 `scrollingElement` 在标准模式下是文档的根元素： document.documentElement。
当在怪异模式下， `scrollingElement` 属性返回 HTML body 元素（若不存在返回 null ）。但在 IE 中并没有实现。

`scrollHeight` 也不一定兼容，需要做兼容处理：

```js
function getScrollHeight(){
　　var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
　　if(document.body){
　　　　bodyScrollHeight = document.body.scrollHeight;
　　}
　　if(document.documentElement){
　　　　documentScrollHeight = document.documentElement.scrollHeight;
　　}
　　scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
　　return scrollHeight;
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

与 `scrollBy` 类似的还有 `scrollTo` 属性，`scrollTo` 的参数不是相对像素，而是绝对的，即：元素的指定坐标位置。  

### 翻页效果

