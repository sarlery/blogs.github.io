# Object 中的几个很相似的方法  
这里主要讨论这么几个方法，他们用法很相似，但又有所不同。在实际开发中就有可能陷入其中，搞不清到底用哪个方法比较好。下面就开始一一介绍。  
## `in` 和 `hasOwnProperty()` 两方法的区别
这两个方法用来判断一个属性是否是某个对象中的，都会返回一个布尔值。
```js
var obj = {
    a: 1
}
console.log('a' in obj);    // true
console.log(obj.hasOwnProperty('a'));       // true
```
但两个方法作用并不完全相同。  
+ `in` 运算符用来判断属性在指定的对象或其原型链中是否存在。
+ `hasOwnProperty()` 方法相较于 `in`，该方法会 **忽略掉那些从原型链上继承到的属性**。  
具体看下面例子：  
```js
// 定义一个类
var Person = function(sex,age){
    this.sex = sex;
    this.age = age;
    this.home = 'BeiJing';
    this.getAge = function(){
        return this.age;
    };
    // 这个类的原型上有一个方法
    Person.prototype.getSex = function(){
        return this.sex;
    }
}

// 实例化一个对象出来
var person = new Person('男',18);

// 当使用 in 操作符时：
for(let p in person){
    console.log(p);
    // 这时就会打印出：
}

// 当使用 hasOwnProperty() 访问 getSex 时却会返回 false：
console.log(person.hasOwnProperty('getSex'));   // false
// 访问其它属性时 返回true
```