# 防抖与节流
在一些情况下，函数的触发不是由用户直接控制的。在一些场景下，函数有可能被非常频繁地调用，而造成性能的问题。比如以下事件操作：
- `window.onresize` 事件被注册后，频繁的变化浏览器窗口大小会不断地触发该事件（过于频繁的操作）；
- `onmousemove` 事件是鼠标在移动过程中被触发；
- `onmousewheel` 事件是鼠标滚轮滚动时被触发；
- `oninput` 事件是在用户输入内容时被触发；

还有一些场景可能是用户频繁操作成为了“频繁事件”，比如：
- 当多次点击提交按钮时，导致出现多次 Ajax 请求；

针对以上场景，我们引入了 `防抖` 和 `节流` 两个函数，这两个函数实现功能很相似。从表面意思来看，防抖是为了“防止”，而节流是为了“节省”，防抖的触发频率是要比节流触发频率低的。  

防抖（debounce）
-------
#### 防抖的实现：
为了避免高触发，`setTimeout` 函数是关键，一下是防抖函数：
```js
function debounce(fn,delay){
    var timer;
    // 每次触发事件，就会执行下面返回的函数
    return function(){
        // 1.
        clearTimeout(timer);
        var args = arguments,
        // 这里的 arguments 是事件对象（event）
            self = this;
            // 这里的 this 绑定的是事件函数
        timer = setTimeout(function(){
            fn.apply(self,args);
        },delay || 500);
    }
}
```
在代码注释 1 下面的一行代码，清除 timer 就是为了“防抖”，因为这一次调用的函数在执行该行代码时清除的是上一次的 timer。也即，当上一次与这一次的间隔不足 delay 就会被清除，当事件不再被触发，“下一次的函数”也就不会再调用，这一次（最后一次被触发）的函数就是被顺利执行，让 timer 中的 `fn.apply(...)` 成功执行。  
假设，做一个功能，在表单验证中，当用户输入内容时，我们就对输入内容进行验证：
```js
input.oninput = debounce(function(e){
    var val = input.value,
        bool = /\b+/g.test(val);
    if(bool){
        alert("输入内容中不能有空格！");
    }
},600);
```
在鼠标滚轮事件中，也可能会用到防抖函数，比如当鼠标滚动时，页面进行切换展示（跟轮番图差不多），比如豆瓣官网的年度总结页面，如果不用到防抖，当鼠标滑动时，页面展示的会非常快。做一个最简单的展示效果：
HTML 代码：
```html
<body>
    <div class="wrapper">
        <div class="a" style="z-index:100;">1</div>
        <div class="b">2</div>
        <div class="c">3</div>
        <div class="d">4</div>
    </div>
</body>
```
CSS 代码：
```css
*{
    margin: 0;
    padding: 0;
}
html,body{
    height: 100%;
    width: 100%;
    overflow-x: hidden;
}
.wrapper{
    position: relative;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
}
.wrapper div{
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    font: 600 300px 'consoles';
    color: white;
    text-shadow: 6px 6px 16px #333;
}
.wrapper .a{
    background: red;
}
.wrapper .b{
    background: green;
}
.wrapper .c{
    background: black;
}
.wrapper .d{
    background: gold;
}
```
在 JavaScript中利用 zIndex 属性来实现。
所用到的DOM元素：
```js
const wrap = document.querySelector('.wrapper');
const divs = wrap.querySelectorAll('div');
var len = divs.length,
    i = 0;
```
然后是鼠标滚轮事件：`onmousewheel`，该事件对象中有一个属性 —— `detail` 或 `wheelDelta`；  
这两个属性的功能是一样的，都是来判断鼠标滚轮是向上滚动还是向下滚动，之所以有两个，是因为浏览器兼容缘故，有的浏览器是 detail ，比如火狐，而有的是 wheelDelta。但两者判断方法相同：
- 当属性值 > 0 时，表示向上滚动；
- 当属性值 < 0 时，表示向下滚动；  

于是，可以写出实现方法：
```js
wrap.onmousewheel = debounce(function(e){
    // 做兼容处理：
    var detail = e.detail ? e.detail : e.wheelDelta;
    if(detail < 0){
        if(i >= 0){
            i ++;
            divs[i - 1].style.zIndex = 10;
            if (i >= len) {     
                // 当 i 的值大于等于长度时，再滑动就让第一个元素显示
                // 从而实现轮番的效果
                i = 0;
            }
            divs[i].style.zIndex = 100;
        }
    }else{
        if(i > 0 && i < len){
            divs[i --].style.zIndex = 10;
            divs[i].style.zIndex = 100;
            if(i === 0){    
                // 这里限制了一下，当然也可以让最后一个元素显示。
                i = 0;
            }
        }
    }
},500);
```
节流（throttle）
--------
节流与防抖很相似，但两者却是不同的，节流主要用于动画。  
节流实现代码：
```js
var throttle = function(fn,interval){
    var first = true,
        timer = null;
    return function(){
        var _args = arguments,
            self = this;
        if(first){
            fn.apply(self,_args);
            return first = false;
        }
        if(timer){
            return false;
        }
        timer = setTimeout(function(){
            clearTimeout(timer);
            timer = null;
            fn.apply(self,_args);
        },interval || 400);
    }
}
```