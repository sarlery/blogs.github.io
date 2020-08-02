## 1. undefined 和 null 的异同

相同部分：  

1. 不包含方法或属性；
2. 都是假值；
3. 都只有一个值；
4. 都是“空缺”的意思；

不同之处：  

1. 含义不同，`undefined` 表示一个未定义的值，`null` 表示一个空的对象；
2. 类型不同，typeof undefined 会得到 `'undefined'`；而 typeof null 会得到 `object`；
3. 数字转换不同，Number(undefined) 会得到 `NaN`；而 Number(null) 会得到 `0`；
4. 在非严格模式下，undefined 能被当作变量来使用和赋值，而 null 不行。  

## 2. 严格模式

ES6 的模块自动采用严格模式，不管你有没有在模块头部加上 "use strict;"。  

严格模式的限制：  

- 变量名必须声明后再使用；
- 函数的参数不能有同名属性，否则报错；
- 不能使用 `with` 语句；
- 不能对只读属性赋值，否则报错；
- 不能使用前缀 `0` 表示八进制，否则报错；
- 不能删除不可删除的属性，否则报错；
- 不能删除变量 `delete prop`，会报错，只能删除属性 `delete global[prop]`；
- `evel` 不会在它的外层作用域引入变量；
- `evel` 和 `arguments` 不能被重新赋值；
- `arguments` 不会自动反映函数参数的变化；
- 不能使用 `arguments.callee` 和 `arguments.caller`；
- 禁止 `this` 指向全局对象，顶层的 `this` 指向 `undefined`；
- 不能使用 `fn.caller` 和 `fn.arguments` 获取函数调用的堆栈；
- 增加了保留字（比如 `protected`、`static` 和 `interface`）；  

## 3. this 指向

## 4. 闭包

## 5. 面向对象

## 6. let const 与 var 的区别

`let` 与 `const` 的特性相似。两者与 `var` 的不同之处：  

- `var` 声明的变量会进行变量提升，`let` 和 `const` 不会变量提升，它们只在所在的代码块内有效（即 `{}` 内），提前获取 `let` 或者 `const` 声明的变量的值会报错，提前使用 `var` 声明的变量，值会是 `undefined`；  
- `var` 可以重复声明变量，但 `let` 和 `const` 不能重复声明，这会报错。`var` 声明之后再使用 `let` 或者 `const` 声明，或者用 `let` 和 `const` 声明之后再使用 `var` 重复声明也会报错； 
- 只要块级作用域内存在 `let` 命令，它所声明的变量就“绑定”这个区域，不再受外部影响。在代码内，使用 let 声明变量之前，改变量是不可用的，在语法上，称为“暂时性死区”（temporal dead zone，TDZ）。  
- `let` 实际上为 JavaScript 新增了块级作用域。

`const` 声明一个只读的常量，一旦声明，常量的值就不能改变。

### 块级作用域

ES6 之前，可以使用立即执行函数（IIFE）创建块级作用域。ES6 引入了块级作用域，明确允许在块级作用域之中声明函数。ES6 规定，块级作用域之中，函数声明语句的行为类似于 `let`，在块级作用域之外不可引用。

```js
function fn(){
    console.log('World!');
}
(function(){
   if(false){   // 创建了块级作用域
       function fn(){   // 重复生命一次 fn 函数
            console.log('Hello!');
        }
    } 
    fn();   // 调用会报错！
    // fn is not a function
})();
```

在符合 ES6 的浏览器中，上面都会报错，因为实际运行的是以下的代码：  

```js
function fn() {
    console.log('World!');
}
(function () {
    var fn = undefined;
    if (false) { // 创建了块级作用域
        function fn() { // 重复生命一次 fn 函数
            console.log('Hello!');
        }
    }
    fn(); // 调用会报错！
})();

```

## 7. 内存泄漏与垃圾收集


