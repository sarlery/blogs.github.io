# 发布订阅模式

在前端开发中，经常会使用到发布订阅模式，发布订阅模式也被称为观察者模式。最常见的发布订阅模式莫过于给 DOM 绑定事件，当点击一个按钮或者鼠标移动到某个元素上就会触发事件监听函数，然后弹出一个文本框或者改变元素样式。  

```js
div.addEventListener("click", () => {
    alert("Hello!");
});
```

`div` 元素相当于一个订阅者，他会告诉浏览器（发布者），他要订阅一个 `click` 事件，这个事件会弹出一个提示框。当用户点击 div 元素时，浏览器就会“发布”这个消息，告知用户。  

在 `Node.js` 中，也大量应用了发布订阅模式，它是构成 `Node.js` 平台的核心之一。比如在响应 `post` 请求时，想要拿到数据，可以给请求对象绑定 `data` 事件用来接收回传的数据，数据接收完毕后就会触发 `end` 事件，我们就可以在其中拿到完整的请求数据了。  

```js
const http = require("http");

const httpServer = http.createServer((req, res) => {
    let { url } = req;
    let method = req.method.toLocaleLowerCase();

    if(method === "post"){
        if(url === "/data"){
            let str = "";
            // 监听 data 事件，收集前端发来的数据块
            req.on('data', (chunk) => {
                str += chunk;
            });
            // 数据接收完成之后触发 end 事件
            req.on('end', () => {
                console.log("str === ", str);

                res.write("OK!");
                res.end();
            });
        }
    }
});
httpServer.listen(8888, () => {
    console.log("Server is running: http://localhost:8888");
});
```

前端利用发布订阅模式可以给元素绑定事件，`Node.js` 中利用发布订阅模式可以处理请求数据。这些发布订阅模式都是内置的，在 `Node.js` 中，有一个 `events` 模块，这个模块中有一个 `EventEmitter` 类，`EventEmitter` 可以将一个或多个函数注册为监听器，当事件触发时，相应的函数就会被调用。`Node.js` 中的许多模块都继承了这个类，拥有了事件监听的能力。  

`EventEmitter` 内部维护着一个事件监听函数集，当内部的方法 `emit` 被调用后就会触发相应的监听函数。比如：  

```js
const EventEmitter = require("events").EventEmitter;

const event = new EventEmitter();

var c = () => console.log("aaa -- second");
// 订阅事件
event.on("aaa", () => console.log("aaa -- first"))
    .once("aaa", () => console.log("aaa -- once"))
    .on("aaa", c, true)

// 触发事件
event.emit("aaa");
console.log("\n");
event.emit("aaa");

// 移除某个事件函数
event.removeEventListener("aaa", c);
console.log("\n");
event.emit("aaa");
```

订阅事件可以链式调用，上面代码中注册了三个 `aaa` 事件，其中有一个 `once` 表明之触发一次。虽然事件函数名都叫 `aaa`，但因为绑定的函数是不同的，因此当调用 `emit` 是会触发多个函数执行。`removeEventListener` 可以移除 `aaa` 事件中的 c 函数。  

要想让一个事件可以绑定多个监听函数，也很容易，只需把注册的函数存入数组中即可，当事件触发时把数组中的函数都执行一遍。下面就动手实现一个 `EventEmitter` 类。  


## EventEmitter

简单的实现一下。`EventEmitter` 类需要有一个存放监听函数的数据结构，用对象就好，对象的键是事件名称，值是数组用来存放监听函数。  

```ts
class EventEmitter{
    event: {    // 存放 on 绑定的事件函数
        [eventName: string]: Function[];
    }
    onceEvent: {    // 存放 once 绑定的事件函数
        [eventName: string]: Function[];
    }

    constructor(){
        // 初始化
        this.event = {};
        this.onceEvent = {};
    }
}
```

### on 和 once 函数

绑定事件监听函数，然后返回 `EventEmitter` 实例。
once 函数与 on 函数实现基本相同，可以实现一个通用的 `bind` 函数：  

```ts
_bind(type: string, eventName: string, listener: Function, flag = false): EventEmitter{
    const event = type === "on" ? this.event : this.onceEvent;
    const fnAry = event[eventName];
    if(!fnAry){
        event[eventName] = [listener];
    }else{
        // 如果数组中没有监听函数，才添加
        if(!fnAry.includes(listener)){
            if(typeof listener === "function")
                flag ? event[eventName].unshift(listener)
                    : event[eventName].push(listener);
        }
    }
    return this;
}

on(eventName: string, listener: Function, flag = false): EventEmitter{
    return this._bind('on', eventName, listener, flag);
}
// 绑定某个事件函数，函数触发一次后就会被销毁
once(eventName: string, listener: Function, flag = false): EventEmitter{
    return this._bind('once', eventName, listener, flag);
}
```

`on` 和 `once` 函数都可以接受一个 `flag` 参数，默认是 false。当是 `true` 时，`listener` 函数会添加到数组的最前面（unshift 操作），在触发事件时会优先调用。

`addEventListener` 与 `on` 函数一样，只是个别称。  

```ts
addEventListener(eventName: string, listener: Function, flag = false): EventEmitter{
    return this.on(eventName, listener, flag);
}
```

在 `EventEmitter` 类中，还提供了 `prependListener` 和 `prependOnceListener` 函数，它们是将监听函数添加到数组的开头位置，这两个函数分别对应于 `on` 和 `once` 两种绑定方式。  

```ts
// 把 flag 参数设置成 true
prependListener(eventName: string, listener: Function): EventEmitter{
    return this.on(eventName, listener, true);
}
prependOnceListener(eventName: string, listener: Function): EventEmitter{
    return this.once(eventName, listener, true);
}
```

### emit

触发事件，成功触发返回 true，否则返回 false。  

```ts
_perform(fnAry: Function[], ...args: any[]){
    fnAry.forEach(fn => {
        fn.apply(this, args);
    });
}
emit(eventName: string, ...args: any[]): boolean{
    // 先触发 on 中的函数，再触发 once 中的函数
    const onEventFn = this.event[eventName];
    const onceEventFn = this.onceEvent[eventName];
    let flag = false;
    if(onEventFn){
        flag = true;
        this.perform(onEventFn, ...args);
    }
    if(onceEventFn){
        flag = true;
        this.perform(onceEventFn, ...args);
        // 执行完成后，别忘了销毁该事件监听
        delete this.onceEvent[eventName];
    }
    return flag;
}
```

### removeEventListener

代码如下：  

```ts
removeEventListener(eventName: string, listener: Function): EventEmitter{
    let onEventFn = this.event[eventName];
    let onceEventFn = this.onceEvent[eventName];
    if(onEventFn){
        // 过滤
        this.event[eventName] = onEventFn.filter(fn => && fn !== listener);
    }
    if(onceEventFn){
        this.onceEvent[eventName] = onceEventFn.filter(fn => && fn !== listener);
    }
    return this;
}
```

除了 `removeEventListener` 方法外，还可以实现一个 `removeAllListener`，表示移除 `eventName` 对应的全部的监听函数。  

```ts
removeAllListener(eventName: string): EventEmitter{
    delete this.event[eventName];
    delete this.onceEvent[eventName];
    return this;
}
```

一个基本的发布订阅模式就实现了。

## 前端-自定义事件

说完了 `EventEmitter`，再来说说前端的自定义事件。  

想对某个元素设置上自己定义的事件类型，如何做到？比如：  

```js
div.addEventListener("myEvent", (e) => {
    // ...
});
```

### CustomEvent

使用如下：  

```js
// 初始化 event 对象
var event = new CustomEvent("color", {
    detail: {
        color: 'red'
    },
    bubbles: false,
    cancelable: true,
});

const div = document.getElementById("main");
// 绑定事件
div.addEventListener("color", function(e){
    console.log(e);
});

// 触发事件
div.dispatchEvent(event);
```
`CustomEvent` 构造函数接收两个参数，第一个是事件名称，第二个是一个配置参数，配置项有：  

- `bubbles` 一个布尔值，表明该事件是否会冒泡；
- `cancelable` 一个布尔值，表明该事件是否可以被取消；
- `detail` 当事件初始化时传递的数据；

通过 `dom.dispatchEvent` 方法触发事件。  

当 `bubbles` 配置项是 `true` 时表明该事件会冒泡。  

```js
var event = new CustomEvent("color", {
    detail: {
        color: 'red'
    },
    bubbles: true,
    cancelable: true,
});
// 给 document 绑定事件
document.addEventListener("color", function(e){
    console.log(e);
});

// 由 div 触发事件
div.dispatchEvent(event);
```

上面代码，因为 `color` 事件可以冒泡，因此 div 元素也可以触发。

### Event

`Event` 类与 `CustomEvent` 类相似。用法如下：  

```js
const div = document.getElementById("main");
var event = new Event('color', {
    "bubbles": true,
    "cancelable": true,
});

document.addEventListener("color", (e) => console.log(e));
div.dispatchEvent(event);
document.dispatchEvent(event);
```

与 `CustomEvent` 相比，`Event` 构造函数的第二个参数——配置项中似乎不能传递初始化数据（`detail`）。

前端的 `addEventListener` 函数也可以为元素注册一次性事件，在第三个参数中传入一个对象，将 `once` 设置成 `true` 即可。  

```js
div.addEventListener("click", () => {
    // ...
}, {
    once: true,      // 只调用一次
    capture: false, // 在冒泡阶段触发事件
});
```

