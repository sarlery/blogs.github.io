# React 优化组件

## 1. shouldComponentUpdate
使用 `shouldComponentUpdate` 生命周期函数（简称 `SCU`）可以优化 React 组件。`SCU` 可以让我们自己控制组件是否进行渲染。它返回一个布尔值，`true` 代表重新渲染，`false` 代表不渲染。默认 SCU 返回 `ture`。即：父组件更新会连带着子组件也更新，有时候重新渲染子组件并没有必要。使用 SCU 可以优化组件渲染。  

```js
shouldComponentUpdate(nextProps, nextState) {
  if (this.props.color !== nextProps.color) {
    return true;    // 不相等时返回 true，更新组件
  }
  if (this.state.count !== nextState.count) {
    return true;    // 相等时返回 false，不更新组件
  }
  return false;
}
```

React 提供了 `PureComponent` 类自动为我们做优化，使用时把组件继承这个类即可。  

```js
class Example extends PureComponent{
  // ...
}
```

`PureComponent` 使用“浅比较”的模式来检查 props 和 state 中所有的字段，以此来决定是否组件需要更新。“浅比较”不会比较对象内部的属性。例如 props 的数据如下：  

```js
props = {
  obj: {
    a: 1,
    b: 2
  },
  count: 1
}
```

比较时，不会比较 `obj` 对象内部的属性，只是比较 `obj` 地址有没有发生变化。每次更新都要生成一个新的对象才行，因此，`SCU` 必须配合“不可变值”一起使用（数据变化必须返回新的数据，而不是接着使用原来的数据，尤其是对于引用类型来说）。  

由于 `PureComponent` 是浅比较，当数据结构很复杂时，情况会变得麻烦。对于函数组件可以使用 `memo` 进行包裹，与 `PureComponent` 一样默认使用“浅比较”。  

```js
function MyCom(){
  // ...
}
export default React.memo(MyCom);
```

也可以给 `memo` 函数传入第二个参数，这个函数与 `SCU` 函数返回值相反。  

```js

function areEqual(prevProps, nextProps){
  // props 不相等时返回 false，表示更新组件
  // props 相等时返回 true，表示不更新组件
}

React.memo(MyCom, areEqual);
```

下图是 React 的生命周期函数。  

![React lifecycle](img/react-lifecycle.png)  

从图中可以看出，`SCU` 处在 `render` 之前，它可以拦截组件的 `props` 和 `state`。

## 2. PureComponent
当然，上面的写法不太好。如果 props 或者 state 的内容很多时，做判断就很繁琐。React 提供了 `PureComponent` 的组件，在使用时只需要继承 `React.PureComponent` 就行了，而不再直接使用 `shouldComponentUpdate` 钩子函数。  

```jsx
class App extends React.PureComponent{
    // ....
}
```

需要注意的是：`PureComponent` 做的是 **浅比较**。浅比较就是两个变量引用值相等，使用 `===` 衡量。比如下面的都是浅比较： 

```js
var a = 2,b = 2;
console.log(a === b);   // true

var c = {a: 1};
var d = {a: 1};
// c 和 d 虽然对象中的内容相同，但是地址不同
console.log(c === d);   // false
```

而深比较是“原值相等”，深比较不使用运算符，而是需要实现一个深比较的函数。比如上面的代码中，对象 c 与对象 d 进行深比较时，因为 c 和 d对象中的属性都相等，因此为 true。  

```js
function deepEqual(o1,o2){
    // ... 具体实现
}
console.log(deepEqual(c,d));    // true  
```

> 如果你想无论 props/state 的值有没有改变都要更新组件，那么就不要使用 `PureComponent` 或者 `shouldComponentUpdate`。因为使用的话，你的程序很可能会出现 bug。  

还有一点需要注意，因为 `PureComponent` 是浅比较，如果你的 props/state 中有数组或者对象更新了其中的元素或者属性，`PureComponent` 并不会认为有更新。因此如果一个组件不是纯函数组件（组件中没有 props 和 state），就需要考虑使用 `PureComponent` 会不会影响组件渲染效果。  

## 3. useEffect
useEffect `React Hooks` 中的一个钩子函数。effect hooks可以让你在函数组件中执行副作用操作。  

`useEffect` 函数很强大。使用这个函数可以模拟 React 当中的 `componentDidMount`，`componentDidUpdate` 和 `componentWillUnmount` 这三个生命周期函数。因此合理地使用 Effect 至关重要。  

`componentDidMount` 和 `componentWillUnmount` 在整个组件的生命周期中只会执行一次，而 `componentDidUpdate` 表示组件更新完毕，因此当组件有更新后，该函数就会被执行。  

通常在 `componentDidMount` 中会写一些副作用，比如开始的 `Ajax` 请求、记录日志、手动的变更 DOM 等操作。现在使用 `Effect` 也可以做到。  

`useEffect` 函数接收两个参数，第一个参数是一个回调函数，在里面写入的是一些副作用；第二个参数是个可选参数，`Effect` 之所以能够模拟生命周期函数就是依靠第二个参数。  

第二个参数是一个数组，默认值是一个空数组（当你不传第二个参数时）。当不是空数组时，数组里的内容应该是一个个的 `props` 或者 `state`，表示当数组中的 `props/state` 发生变化时，`useEffect` 的第一个参数（回调函数）就会再次执行（这有些像 `PureComponent` 组件）。如果不传第二个参数，它在第一次渲染之后和每次更新之后都会执行。而如果传入的是一个空数组，Effect 函数只运行一次（组件挂载时：`componentDidMount`）  。

除此之外，`useEffect` 函数还可以返回一个函数，React 会在组件卸载的时候执行这个函数。当 `Effect` 的第二个参数是空数组时，这相当于模拟了 `componentWillUnmount` 函数的作用。  

下面的例子，当点击按钮时，count 就会变化，切换浏览器标签页时文档 title 会发生改变。

```jsx
function App() {
    let [count, setCount] = useState(0);
    let [normalTitle,setNormalTitle] = useState("");

    useEffect(() => {
        document.title = `You clicked ${count} times`;
        setNormalTitle(document.title);
    },[count]);

    useEffect(() => {
        // 当浏览器切换到别的的标签页时会触发该事件
        document.onvisibilitychange = function(){
            console.log(this.visibilityState);
            if(document.visibilityState === "hidden"){
                document.title = "不要走呀~~";
            }else{
                document.title = normalTitle;
            }
        }
    },[normalTitle]);

    function handleClick(){
        setCount(count + 1);
    }

    return (
        <button onClick={handleClick}>Click</button>
    );
}
```

## 4. useCallback 和 useMemo
在使用 React Hook 时，我们常常会用到 `useCallback` 和 `useMemo`，这两个 API 都可以传入一个 deps 数组，与 `useEffect` 中的 deps 相比三者有什么不同之处呢？  

`useCallback` 和 `useMemo` 的行为相似，`useCallback` 会返回一个 `memoized` 的回调函数。而 `useMemo` 会返回一个 `memozied` 的值。  

`memoized` 回调函数会在 deps 中的某个依赖项发生变化时才被调用；`memoized` 值会在 deps 中的某个依赖项发生变化时才重新计算。  

如果 `useCallback` 和 `useMemo` 不传第二个参数，每次渲染都会执行函数或重新计算新的值，而如果传入的是空数组，则只初始渲染时执行一次（空数组表明没有依赖项）。使用 `useMemo` 有助于避免在每次渲染时都进行高开销的计算。  

而 `useEffect` 中的 deps 与两种不同。不传入 deps 参数时，每次渲染 useEffect 回调都会被执行。而 deps 如果是空数组时，只会在 `componentDidMount` 阶段执行一次，这可以处理一些副作用，比如发起网络请求，设置定时器等。如果 `useEffect` 回调函数内返回了一个函数，这个返回的函数会在 `componentWillUnmount` 阶段执行。如果 deps 中传入了依赖项，当某个依赖项发生变化时 useEffect 回调会被执行。  

与 `useEffect` 相似的还有一个 `useLayoutEffect` API，在浏览器完成布局与绘制之后，传给 useEffect 的函数会延迟调用（异步执行），不应在这个函数中执行阻塞浏览器更新屏幕的操作；`useLayoutEffect` 会在所有的 DOM 变更之后同步调用 effect（在浏览器执行绘制之前），使用它来读取 DOM 布局并**同步**触发重渲染，它会阻塞浏览器的绘制。`useLayoutEffect` 要比 `useEffect` 执行时机早。尽量使用 `useEffect`。  

## 5. memo
`memo` 与 `useMemo` 不同，useMemo 是包装 js 函数用的，而 memo 是包装组件用的。它与 `PureComponent` 非常相似。但是 memo 适用于函数组件，而不适用于 class 组件。  
 
例如上面的 App 组件就可以使用 `memo` 进行包裹：  

```js
import React,{memo} from "react";

function App(){
    // ...
}
// 导出 App：

export default memo(App);
```

上面已经说过，memo 作用与 `PureComponent` 作用基本相同。因此在使用 `memo` 时应考虑清楚，如果你的函数组件在给定相同 props 的情况下渲染相同的结果，那么可以使用 memo。memo 使用的是浅比较的方式，因此 props 中如果有对象或者数组，就应谨慎使用。  

memo 函数可以接受第二个参数，该参数是一个回调。这个回调与 `shouldComponentUpdate` 相似，但参数略有不同。memo 的回调的第一个参数是 `prevProps`，表示上一次的 props，第二个参数是 `nextProps` 表示当前的 props。同样的，回调函数需要返回一个 bool 值，`true` 表示对比的 props 相同，`false` 表示对比的 props 不相同。  

比如下面的例子：

```jsx
import React, { useEffect, useState,useCallback ,useMemo, memo } from 'react';

function App() {
    let [count, setCount] = useState(0);

    function handleClick() {
        setCount(count + 1);
    }

    var handleClickCallback = useMemo(() => handleClick, [count]);

    return (
        <>
            <CountNum count={count} />
            <button onClick={handleClickCallback}>Click</button>
        </>
    );
}

function Num(props) {
    return (
        <h2>The Number is: {props.count}</h2>
    );
}

// 得到优化后的函数组件
const CountNum = memo(Num,areEqual);

function areEqual(prevProps, nextProps) {
    // props 相等时就返回 true，表示不更新组件
    if(prevProps.count === nextProps.count){
        return true;
    }
    // 不相等时，就更新组件
    return false;
}

export default App;
```
App 组件不需要使用 memo 优化，这是因为 App 组件中没有 props，memo 比对的是 props 的变化，然后更新组件。  

## 6. lazy/Suspense
`React.lazy` 函数能让你像渲染常规组件一样处理动态引入的组件。而 `Suspense` 是一个组件，这两个东西一般是配合使用的。  

在 webpack 中如果做文件打包，打包出来的文件可能会很大。而打包好的文件中可能有一些代码并不需要每次加载页面时就请求它（或说使用到它），比如当用户点击按钮时才会运行某一些代码。这时候就可以使用异步的方式再去获取资源。  

```js
// 异步的导入 print.js 文件
button.onclick = e => import(/* webpackChunkName: "print" */ './print').then(module => {
    // print 函数 存在于 module.default 中
    var print = module.default;
    // 执行异步加载到的 print 函数
    print();
});
```

React 的 lazy 函数与之类似。在组件首次被渲染时，就会自动导入这个被懒加载的组件。  

```jsx
const LazyComponent = React.lazy(() => import('./LazyComponent'));
```

lazy 必须与 Suspense 组件一起使用。例如下面的代码，当 count 大于 6 时，就会动态插入 Text 组件：  

```jsx
import React,{lazy,Suspense,useCallback,useState} from "react";
// 懒加载
const Text = lazy(() => import("./Text.jsx"));

function App(){
    let [count,setCount] = useState(0);

    var handleClick = useCallback(function(){
        setCount(count + 1);
    },[count]);

    return (
        <>
            <h2>The number is: {count}</h2>
            {
                count > 6 ? 
                    <Suspense fallback={<div>Loading...</div>}>
                        <Text />
                    </Suspense>
                : ""
            }
            <button onClick={handleClick}>Click</button>
        </>
    );
}

// Text.jsx
import React,{memo} from "react";

function Text(props){
    return (
        <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cum aspernatur a asperiores consequatur qui explicabo, excepturi, eos ea, sequi quis perferendis. Accusamus velit eos accusantium facilis dolor, quas cupiditate. Esse.
        <p>
    );
}

import default memo(Text);
```

`Suspense` 组件必须有一个 `fallback` 属性。fallback 的值应是一个组件，它表示懒加载的组件在没有加载到页面之前应显示的效果，通常是一个 `Loading`。  

## 7. 错误边界
错误边界是一种React组件，这种组件可以捕获并打印发生在其 **子组件树任何位置的JavaScript错误** ，并且，它会渲染出备用UI，而不是渲染那些崩溃了的子组件树。渲染期间，生命周期方法和整个组件树的构造函数中捕获错误。

需要注意的是，错误边界无法捕获以下场景产生的错误：  

- 事件处理
- 初步代码（例如 `setTimeout`、`requestAnimationFrame` 等函数）
- 服务端渲染
- 组件自身引起的错误（而非它的子组件）  

可以这样实现一个错误边界组件：  

```jsx
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // 更新 state 使下一次渲染能够显示降级后的 UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // 你同样可以将错误日志上报给服务器
        logErrorToMyService(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // 你可以自定义降级后的 UI 并渲染
            return this.props.fallback;
        }

        return this.props.children; 
    }
}
```

使用时，将这个组件包含在常规组件的外面：  

```jsx
// 发生错误时，fallback 就会被渲染出来
<ErrorBoundary fallback={<p>Something went wrong.</p>}>
    <MyWidget />
</ErrorBoundary>
```

使用 lazy/Suspense 时，异步加载的组件可能没有加载成功，这时候也可以使用 `ErrorBoundary` 进行包裹：  

```jsx
import ErrorBoundary from './ErrorBoundary';
const OtherComponent = React.lazy(() => import('./OtherComponent'));

const MyComponent = () => (
    <div>
        <ErrorBoundary fallback={<p>Something went wrong.</p>}>
            <Suspense fallback={<div>Loading...</div>}>
                <OtherComponent />
            </Suspense>
        </ErrorBoundary>
    </div>
);
```

## 8. Portals
Portals 是 React16 新出的一个功能，被称为“插槽”。它可以将子节点渲染到存在于父组件以外的 DOM 节点上。  

比如，一个组件本来在 `<App />` 组件中，但是通过 `Portal` 可以将这个组件插入到页面的任意位置。  

通过 `Portal` 将 `Dialog` 组件插入到 `body` 标签下。  

```jsx
import React, {useState} from 'react';
import Dialog from "./components/Dialog.jsx";
import "./App.sass";

function App(){
    let [isShow,setIsShow] = useState(false);
    function enterHandleClick(){
        setIsShow(true);
    }
    function hiddenBtn(){
        setIsShow(false);
    }
    return(
        <div className="wrapper">
            <div className="btn-wrapper">
                <button onClick={enterHandleClick}>确认提示框</button>
            </div>
            {/* 把提示框写在了这里 */}
            <div className="prompt-box">
                {
                    isShow ? 
                    <Dialog>
                        <div className="dialog-wrapper">
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro quisquam deleniti qui quam deserunt. Voluptatum doloribus fugiat consectetur harum, aliquam eius hic, amet aperiam cum ipsum, explicabo quos. Mollitia, error.</p>
                            <div>
                                <button onClick={hiddenBtn} className="enter">确认</button>
                                <button onClick={hiddenBtn} className="cancel">取消</button>
                            </div>
                        </div>
                    </Dialog>
                    : ""
                }
            </div>
        </div>
    );
}
export default App;
```

下面是使用了 `Portal` 的 `Dialog` 组件：  

```jsx
import React,{useEffect} from "react";
import ReactDOM from "react-dom";

function Dialog(props){

    var el = document.createElement("div");

    // componentDidMount 时将 el 插入到 body 中
    useEffect(() => {   
        document.body.appendChild(el);        
        return () => {
            // 页面卸载时，清除 el 元素
            document.body.removeChild(el);
        }
    },[]);

    return ReactDOM.createPortal(
        // 插槽 jsx
        props.children,
        // 传送到另一端的元素节点
        el
    );
}
export default Dialog;
```
使用 `React.createPortal` 可以实现 `Portal` 插槽。这样，当点击 **确认提示框** 时，Dialog 组件实际是在 body 下，而不是在 App 组件下，因此编写 CSS 时应注意。  

`Portal` 的用法和作用可以参看这篇文章：[传送门：React Portal](https://zhuanlan.zhihu.com/p/29880992?utm_source=wechat_session&utm_medium=social&from=singlemessage)。
 
## 9. PropTypes
`PropTypes` 可以给组件的 props 进行类型检查。PropTypes 需要另行下载：

```cmd
npm install prop-types 
```

用法：  

```js
import PropTypes from "prop-types";

function App(props){
    return <h1>{props.name}</h1>
}

App.propTypes = {
    // name 应该是一个字符串类型的值
    name: PropTypes.string
};
```

PropTypes 的用法与类型可以参考 React 官网上的文档：[PropTypes 文档说明](https://zh-hans.reactjs.org/docs/typechecking-with-proptypes.html)。  

当然，除了 `PropTypes` 之外，也可以使用 `TypeScript` 来编写 React，typescript 相当于自带了 props 类型检测功能。  


## 10. Immutable.js
`immutable.js` 是一个 JavaScript 库。使用时需要下载：  

```cmd
yarn add immutable
```

通过上面的 `PureComponent` 和 `memo` 我们已经知道，当 props/state 的数据类型是复杂类型时（比如数组或者对象），`PureComonent/memo` 可能就会出现bug。比如下面的代码，数组里的元素变了（数组倒序、正序），但是数组地址没变，而组件也并不会更新。  

```jsx
class App extends React.PureComponent{
    state = {
        arr: [2,4,6,1,3,5]
    };

    handleClick(){
        // 对数组进行排序
        state.arr.sort((a,b) => a - b);
        // 更新 state
        this.setState(state => ({
            arr: state.arr
        }));
    }

    render(){
        return (
            <>
                <button onClick={() => this.handleClick()}>Click</button>
                <ul>
                    {
                        this.state.arr.map(item => <li key={item}>The number is {item}</li>)
                    }
                </ul>
            </>
        );
    }
}
```
当点击按钮后，发现页面并没有发生变化，这是因为 sort 函数是对原数组进行排序，返回值并不是一个新的数组，而 `PureComponent/memo` 是 **浅比较**，因此行不通。  

在 React 中不要直接去使用数组的以下的几个方法，因为使用它们更新 props/state 很可能会出现 bug，因为它们都是修改原数组。  

- `sort` 给数组排序；
- `reverse` 颠倒数组；
- `splice` 从数组中添加/删除项目；
- `push` 向数组尾部插入新的元素；
- `pop` 数组尾部删除元素；
- `unshift` 向数组的开头添加一个或更多元素，并返回新的长度；
- `shift` 删除并返回数组的第一个元素；  

如果要使用，可以结合 ES6 中的扩展运算，重新生成一个数组：  

```jsx
handleClick(){
    this.setState(state => {
        this.state.arr.sort((a,b) => b - a);
        return {
            // 使用数组扩展运算符
            arr: [...state.arr]
        }
    });
}
```

也可以使用对象的扩展运算符，或者使用 `Object.assign` 方法。比如下面的例子，当点击按钮后，salary 的数值就会改变，这是因为使用了 ES6 中的对象扩展。

```jsx
class App extends React.PureComponent {
    state = {
        person: {
            name: "Jack",
            age: "18",
            number: 12345678910,
            salary: 3
        }
    };

    handleClick() {

        this.setState(state => {
            state.person.salary += 1;
            return {
                // 使用对象扩展运算
                person: {...state.person}
            }
        });
    }

    render() {
        return (
            <>
                <button onClick={() => this.handleClick()}>Click</button>
                <ul>
                    {
                        Object.keys(this.state.person).map(item => {
                            return <li key={item}>
                                <span>{item}: </span>
                                <span>{item === "salary" ? this.state.person[item] + "K" : this.state.person[item]}</span>
                            </li>
                        })
                    }
                </ul>
            </>
        );
    }
}
```
扩展运算也可以用 `Object.assign` 方法进行代替。  

```js
handleClick() {
    this.setState(state => {
        state.person.salary += 1;
        return {
            // 使用 Object.assign 方法
            person: Object.assign({},state.person)
        }
    });
}
```

无论是使用扩展运算符，还是使用 `Object.assign` 函数，它们只能进行一维的浅克隆。也就是说，面对二维数组、对象嵌套、数组与对象的嵌套时，这些方法，只能克隆外层，里面的复杂类型还是引用关系。这时候就要考虑如何实现深层次克隆比较。而 `immediate.js` 就是做这个工作的。  

immutable 这个单词表示“不可改变的”。也就是说，数据一旦被 `immutable.js` 创建后，通过原生方式改变数据是不可以的，只有使用 immutable 内部提供的方法去进行数据变更。  

```js
import Immutable from "immutable";
// 可以查看到 immutable 内部提供的函数
console.log(Immutable);
```

使用 `fromJS` 方法可以将纯 JS 对象和数组深层转换为不可变映射和列表。 immutable 提供了 `set` 和 `get` 方法，`set` 方法可以设置新的值，`get` 方法通过 `key` 的方式获取 `value`。 `set` 方法设置新的值后，会返回一个全新的 immutable data。例如下面的 js 对象，使用 fromJS 包装，然后使用 get 方法可以获取对象的属性值，然后使用 `set` 方法改变原来的值并返回新的 `对象`。  

```js
import {fromJS} from "immutable";

// 使用 fromJS 包装
var person = fromJS({
    name: "Jack",
    age: 18,
    salary: 3
});

// 改变 person 中的属性值通过 set
var salary = person.get("salary");
// newPerson 的 salary 值就会变成 4
// 而 person 中的 salary 值还是 3
var newPerson = person.set("salary",salary + 1);
```

immutable 实例中还有一个 `toJS` 方法，可以将被 immutable 化的原生 js 数据解构再转回来。比如上面的 newPerson 使用 `toJS` 后可以又变回原生 js 对象：  

```js
import {fromJS} from "immutable";
// ...
console.log(newPerson.toJS());
// {name: "Jack",age: 18,salary: 4}
```  

immutable 实现了几乎所有的原生 js 支持的数据结构，但是这些数据结构的值都是不可变的，只有通过 `set` 方法才能获取更新后的数据结构。  

immutable 还提供了 `setIn` 和 `getIn` 方法，对象嵌套式的复杂数据结构，可以使用这两个方法很方便地获取到深层的 key 值。  
```js
const {fromJS} = require("immutable");

var obj = fromJS({
    a: 123,
    b: {
        name: "Jack",
        age: 28,

        child: {
            name: "Joy",
            age: 6
        },
    },
    c: [4,5,6,7,8],
    d: "Hello!"
});

// 更改属性 a 得值
var obj_1 = obj.set("a",456);
// 更改属性 b 里面的 child 属性里的 age 属性值
var obj_2 = obj.setIn(["b","child","age"],7);
// 获取到 b.child.name 属性
var childName = obj.getIn(["b","child","name"]);
// 将数组 c 中的下标是 1 的项（数组第二项）值改为 50
var obj_3 = obj.setIn(["c",1],50);

console.log(
    "obj_1: ",obj_1.toJS(),"\n",
    "obj_2: ",obj_2.toJS(),"\n",
    "childName: ",childName,"\n",
    "obj_3: ",obj_3.toJS(),"\n"
);
```

immutable.js 的使用可以查看这篇文档，因为 immutable 库挺大的，API 也比较多。  

[immutable 常用 API 简介](https://segmentfault.com/a/1190000010676878?utm_source=tag-newest)

相比于深度克隆，Immutable.js 采用了持久化数据结构和结构共享，保证每一个对象都是不可变的，任何添加、修改、删除等操作都会生成一个新的对象，且通过结构共享等方式大幅提高性能。实现原理可以参考这篇博文：  

[深入探究immutable.js 的实现机制](https://segmentfault.com/a/1190000016404944)  

当熟练使用 `immutable` 时就差不多能解决 react 组件不更新的问题了。  

immutable 通常与 `Redux` 一起使用，这是因为 Redux 要求 reducer 中的 state 值是只读的，每次返回新的值时，我们都要克隆一份，然后做修改，最后返回（通常的做法可能就是使用扩展运算甚至是 `JSON.stringify` 和 `JSON.parse`）。  

除了 `immutable + redux` 外，也可以使用 `mobx` 库进行状态管理。`mobx` 库使用起来也很方便，只是需要了解 JavaScript 的装饰器。  

