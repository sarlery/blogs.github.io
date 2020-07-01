# JS 强制类型转换

## 1. parseInt 与 array.map 的结合
看下面代码，程序运行后会输出什么？
```js
var arr = ['1','2','3'].map(parseInt);
console.log(arr);
```
想要解出这个题目，首先要了解 `map` 方法和 `parseInt`。这两个方法在平时使用的频率是很高的，对于 map 方法肯能都很熟悉，经常用它来操作数组，然后返回一个新的数组，比如下面的例子，给了一个数组，让原数组中的大写字母都变成小写字母形式：
```js
var words = ["wAterMelon","Pear","apple","GRapE"];
// toLocaleLowerCase 方法可以将大写转成小写
var fruits = words.map(item => item.toLocaleLowerCase());
```
> map 的回调函数接收两个参数，分别是 item（数组的每一项）、index（数组的索引）
需要注意的是：map 方法返回的数组的长度是与原数组一样的。不应该使用 map 方法来做筛选操作（筛选应该考虑使用 filter、some等方法），map 是对数组中每个元素的操作。比如下面例子，我们想要筛选出年龄大于 18 的人群：
```js
var persons = [
    {name: '小明',age: 18},
    {name: '小刚',age: 16},
    {name: '老王',age: 66},
    {name: '小李',age: 20},
    {name: '老张',age: 40}
];

var result = persons.map(item => {
    if(item.age > 18){
        return item;
    }
});
```
使用 map 方法返回的结果却是这样的：`[undefined, undefined, {…}, {…}, {…}]` 因为有两个不满足（就是前两个），它却返回 undefined，可见，map 方法返回的数组的索引与原数组的索引是对应的。想要对上面做筛选，做好的办法就是使用 `array.filter` 方法：
```js
var result = persons.filter(item => item.age > 18);
```
下面来说一下 `parseInt`
这个方法应该也不会陌生，在处理 CSS 尺寸时会经常用到它，这个函数主要是为了从字符串开头截取出含有整数数字的字符串并转成数字。比如：
```js
parseInt('-123abc');    // -123 (去除字母)
parseInt('-1c2abc');     // -1   (只会获得左边第一个匹配到的数字)
parseInt('12.33');      // 12    (只会匹配整数，小数部分剔除)
```
很多人都知道 parseInt 的第一个参数，它是一个字符串，parseInt 还可以指定第二个参数，用来指定进位基数，默认是十进制，当匹配不到指定的数值时，则会返回 NaN。需要注意的是：**传入的第二个参数，并不是让第一个参数转成对应的几进制，而是指：第二个参数是几进制，那么就认为第一个参数会是几进制！**比如下面的例子：
```js
parseInt("0110",2);     // 6，第二个参数是二进制，那么就认为第一个参数是一个二进制数
parseInt("0110.11",2);      // 6，同样会忽略小数部分

// NaN，第二个参数是七进制，但是第一个参数却不是七进制！
parseInt("87",7);         
parseInt("8a7",8);   // 同样返回 NaN，因为 只会获得左边第一个匹配到的数字
```
对于这道题目，还需要了解一个用法，在 `parseInt` 的第二个参数中还可以传数字 `0`，这个也表示八进制，还可以传字符串`0x`，表示十六进制。表示十六进制时需要注意：
```js
parseInt("8a7",'0x');       // 8
// 有十六进制中的 a-f 时，字符前应加 "0x"
parseInt("0x8a7",'0x');     // 2215  
```
说了那么多，这道题已经出来答案了。因为 map 方法的回调刚好接收两个参数 —— item（数组每一项） 和 index（每一项的索引）。显然 index 是从 0 到 2 在这个题目当中。这就相当于：
```js
// 原数组：['1','2','3']

parseInt('1',0);    // 0 表示八进制，所以返回 1
parseInt('2',1);    // 没有一进制，返回 NaN
parseInt('3',2);    // 二进制中没有数字 3，返回 NaN
```
最后答案：`[1,NaN,NaN]`  

## 2. parseInt 与 Number

parseInt 和 Number都可以将传入的非数字类型转成数字，两者有哪些区别呢？

`parseInt` 的第一个参数如果不是一个字符串，则将其转换为字符串(使用 `toString` 抽象操作)，并且字符串开头的空白符将会被忽略。`parseInt` 函数会从左往右对字符串解析，直到某个字符不是一个数字，如果这个字符串的开头字符不是一个数字，就会返回 `NaN`。  

```js
parseInt('10px');   // 10
parseInt('12.3');   // 12
parseInt([]);       // NaN
parseInt('q123');   // NaN
parseInt(true);     // NaN，true 转成字符串是 'true'
parseInt([1,2]);    // 1（[1,2].toString() 等于 '1,2'）
parseInt(function(){},16);  // 15（function(){} 转成字符串后第一个字符是f，16进制转成10进制就是15）
Number(null);       // NaN
Number(undefined);  // NaN
```

`Number` 与 `parseInt` 不同的是，Number 是为了将一个非数字类型的变量显示转换成数字类型。他不一定会像 `parseInt` 要把参数先转成字符串。而且 `Number` 将字符串转成数字时如果字符串中有不能转成数字的字符，就会返回 `NaN`。  

```js
Number('10');   // 10
Number('12.33');    // 12.33
Number('12px');     // NaN
Number(true);       // 1
Number([]);         // 0
Number([1]);        // 1
Number({});         // NaN
Number("");         // 0
Number(null);       // 0
Number(undefined);  // NaN
```

## 3. 复杂类型的隐式转换
看下面程序，变量 a 等于什么时，可以让等号成立（为真正值）:
```js
console.log(a == 1 && a == 2 && a == 3);    // true
```
看到这个题目，顿时不知所措！a 怎么可能即等于 1、也可以等于 2，还能等于三呢？
再看看题目发现 等号使用的双等号，在双等号时类型不一样的值作比较很可能会发生隐式转换！  
考虑到隐式转换，再想一下，如果 a 是一个基本类型，判断相等时 a 是不会变的，也就不会可以让 `a == 1 && a == 2 && a == 3` 满足，因此变量 a 是一个复杂类型。  
这时候就要了解隐式转换的一些内容。考虑下面几个表达式的结果：
```js
{} + {} == ?    // "[object Object][object Object]"
[] + {} == ?    // "[object Object]"
{} + [] == ?    // 0
[] + [] == ?    // ""
"" + {} == ?    // "[object Object]"
"" + [] == ?    // ""
console.log(![]);   // false
console.log(!{});   // false
```

> 如果某个操作数是字符串，`+` 将进行拼接操作；如果其中的操作数有对象，则对象会先调用 valueOf 函数，不返回原始值就再调用 `toString` 函数，如果都不返回原始值，就会报错。这种行为被称为 `ToPrimitive 抽象操作`。  

例如：  

```js
var a = {};
var b = [];
// 内部的 valueOf 方法返回了原始值！
a.valueOf = () => 1;
b.valueOf = () => 1;
console.log(a + b); // 2
```

下面的代码将会报错：  

```js
var a = {};
var b = [];
// toString 返回的不是原始值，而是复杂的对象类型值
a.toString = () => [1,2,3];
b.toString = () => [1,2,3];
// Uncaught TypeError: Cannot convert object to primitive value
console.log(a + b);
``` 

### 复杂类型的隐式转换
在 JavaScript 中，基本类型主要有这么几个：`string`,`number`,`boolean`,`undefined`,`null`,`symbol`,`bigint`。这里主要讨论前三个类型与对象作运算的结果。下面是转换的三组结论：  
#### 1. 对象转换成布尔类型，得到的是真值
比如：
```js
var a = [],b = {};
// 将会打印出 yes
if(a && b){ console.log("yes"); }
```
#### 2. 对象转换成字符串
这个在转换时会有几个步骤，具体如下：
1. 如果对象具有 `toString()` 方法，则调用这个方法，然后得到一个原始值，用这个原始值再做运算（这时候再有隐式转换就是原始值之间的事了）  
2. 如果对象没有 `toString()` 方法，或者这个方法并不返回一个原始值，则调用对象中的 `valueOf()` 方法，得到一个原始值，然后再将这个原始值转换成字符串，得到后的这个值再做运算处理。
3. 如果该对象无法从 `toString()` 和 `valueOf()` 中获得一个原始值，那么这时就会抛出一个类型错误。  

每个通过对象字面量的形式实例化的对象都会继承 `Object.prototype` 上的方法，原型上就有 `toString()` 和 `valueOf()` 方法。因此会出现上面代码中的情况。比如：
```js
var a = {}, b = [];
// 下面是系统会返回的转化后的原始值
a.toString();       // "[object Object]"
b.toString();       // ""
```

> 数组中的 `toString` 方法返回的结果与 `join` 方法不传参时的结果相同。

#### 3. 对象转成数字
这个跟转成字符串很相似，具体如下：  
1. 如果对象具有 `valueOf()` 方法，则调用这个方法，然后返回一个原始值，并将这个原始值转换成数字，然后再做运算；
2. 如果对象没有 `valueOf()` 方法，则调用 `toString()` 方法，然后返回一个原始值，并将这个原始值转成数字，然后再做运算；
3. 如果这个对象 既没有 `valueOf()` 方法，也没有 `toString()` 方法，则就会抛出一个类型错误；  
> 需要注意的是：数组或者对象使用 `valueOf()` 方法转换时返回的是一个对象，而不会返回原始值，因此对象、数组转换会调用 `toString()` 方法。
```js
console.log({} + 1);    // "[object Object]1"
console.log(1 + {});    // "1[object Object]"
```
说了那么多，还没有解答正题，如何做到等式成立呢？显然变量 a 是个对象，而且它的 `toString()` 或者 `valueOf` 方法被改写了。不再让 `toString()` 或 `valueOf()` 有原来的作用。 为了避免隐患，最好不用直接修改对象原型上的 `toString` 或者 `valueOf()` 方法，而应该在现有的对象上添加，这样可以尽量避免污染别的程序。  
```js
var a = {
    idx: 0,
    valueOf(){
        return ++ this.idx;
    }
}
console.log(a == 1 && a == 2 && a == 3);    // true
```
或者：
```js
var a = {
    idx: 0,
    toString(){
        return ++ this.idx;
    }
}
```
或者：
```js
var a = {
    arr: [1,2,3],
    toString(){
        return this.arr.shift();
    }
}
```
等等吧，改写 `toString` 或者 `valueOf` 的方式有很多。  

### 类似的题目

再看下面这个题目：  

编写一个 `add()` 函数，能执行下面的代码，并且能在控制台输出注释中的数字。

```js
console.log(add(1, 2));         // 3
console.log(add(1, 2, 3));      // 6
console.log(add(1)(2));         // 3
console.log(add(1)(2)(3));      // 6
```

从上面代码可以看出，`add` 函数是一个柯里化函数，但有一点让人难以捉摸，`add` 函数的参数似乎可以是任意的，每次都可以打印出结果，这如何做到？  

`add` 函数内部需要一个柯里化函数，在执行完一次后返回这个函数。然后 `console.log(fn)` 打印一个函数时内部会调用 `toString` 方法，例如：  

```js
var aaa = function(){};
aaa.toString = function(){
    return "hello!";
}
console.log(aaa);       // hello
```

因此只要改写一下柯里化函数的 `toString` 方法就可以做到 `add` 函数的功能。代码如下：

```js
function add(){
    var tempSlice = [].slice,
        // 等到传入的参数
        params = tempSlice.apply(arguments);
    function currying(){
        var arr = tempSlice.apply(arguments);
        // 将新的参数数组与旧的参数数组拼接起来
        params = params.concat(arr);
        return currying;    // 返回 currying，等待下一次的调用
    }
    currying.toString = function(){
        var result = 0;
        params.forEach(value => {
            result += value;
        });
        return result;
    }
    return currying;
}
```

## [] == ![]

[] == ![] 的结果会是什么？  

答案是 `true`。  

对于等号的隐式转换，即 `x == y`，有以下几个规律：  

1. 字符串与数字  
   - 如果 x 是数字，y 是字符串，则返回 x == ToNumber(y) 的结果；  
   - 如果 x 是字符串，y 是数字，则返回 ToNumber(x) == y 的结果；  

2. 其他类型和布尔类型  
   - 如果 x 是布尔类型，则返回 ToNumber(x) == y 的结果；  
   - 如果 y 是布尔类型，则返回 x == ToNumber(y) 的结果；  

3. `undefined` 和 `null`  
   - undefined == null 会返回 true；  
   - null == undefined 会返回 true；  

4. 对象和非对象  
   - 如果 x 是字符串或数字，y 是对象，则对象会先调用 valueOf 函数，不返回原始值就再调用 `toString` 函数，如果都不返回原始值，就会报错，返回原始值后再与 x 比较（可能还会发生隐式转换）  
   - 如果 y 是字符串或数字，x 是对象，则对象会与上面的转换过程一样；  

5. 对象和对象  
   - 对象和对象不需要隐式转换，它们比较的是指针地址；  

> 通过上面的分析可知，[] == ![]，即 `[] == false`，布尔类型与其他类型比较，布尔类型会转成数字类型，即：`[] == 0`，这时候就又变成了对象和非对象比较，对象会调用 `valueOf`，返回值还是 `[]`，然后调用 `toString`，就变成了空字符串 `""`，字符串与数字比较，字符串会转成数字 `0`，最后结果为 `true`。  

例如，下面的例子，`[] == 1` 会返回 `false`，如果更改了对象原型中的 `valueOf` 函数，`[] == 1` 将会返回 true。  

```js
Array.prototype.valueOf = function(){
    return 1;
}
console.log([] == 1);   // true
```
或者修改 `toString` 方法：

```js
Array.prototype.toString = function(){
    return 1;
}
```

因此呢，下面的式子将成立：  

```js
"0" == false;   // 布尔转数字：0，再与字符串比较，返回 true
"" == [];       // [] 转成字符串是 ""，因此返回 true
0 == [];        // [] 转成字符串是 ""，然后 "" 转成数字变成 0
2 == [2];       // [2] 转成 "2"
"" == [null];   // [null] 会转成 ""
0 == [undefined];   // [undefined] 会转成 ""，""又会转成 0
```

JS 当中的假值： `false`、`0`、`-0`、`0n`、`""`、`null`、`undefined` 和 `NaN`。因此 `![]` 和 `!{}` 会返回 `false`。除了 `undefined`、`null` 和 `NaN` 之外，其余的假值使用 `==` 比较时都会返回 `true`。 

`null` 和 `undefined` 比较奇特，这两者可以相互进行隐式强制类型转换，但其他的值与这两个值比较时不会发生隐式转换。  

```js
undefined == null;  // true
NaN == null;        // false
"" == undefined;    // false
0 == null;          // false
false == undefined; // false
false == null;      // false
```

至于 `NaN` 就更为奇特了，表示不是一个数字（Not-A-Number），`NaN == NaN` 或者 `NaN === NaN` 都会返回 `false`，并且被认为是数字类型。

隐式转换比较复杂，不建议使用 `==`，而是使用 `===`。

