// 组合继承
/**
 * 缺点：父类构造函数被调用了两次
 * 而且子类的原型上可能会挂载一些不必要的属性，这些属性是父类实例上的
 */
function Super() {
    this.name = 'Ming';
    this.age = 18;
}
Super.prototype.sayName = function() {
    return this.name;
}

function Sub(age) {
    Super.call(this);
    this.age = age;
}

// 继承
Sub.prototype = new Super();
Sub.prototype.constructor = Sub;
Sub.prototype.sayAge = function () {
    return this.age;
}

const sub = new Sub(21);
console.log(sub.sayName());
console.log(sub.sayAge());

/* -------------------------------------------------------------- */

// ES5 继承
/**
 * 寄生组合式继承
 * @param {Function} Parent 父类
 * @param {Function} Child 子类
 */
function inherit(Parent, Child) {
    // 让子类的原型指向父类的原型
    // Child.prototype.__proto__ === Parent.prototype
    Object.setPrototypeOf(Child.prototype, Parent.prototype);
    // 属性继承需要在子类内部调用父类
}

// test
function Parent(name) {
    this.name = name;
    this.age = 18;
}

Parent.prototype.sayName = function() {
    return this.name;
}

function Child(name, age) {
    // 继承实例属性
    Parent.call(this, name);
    // 继承原型方法
    inherit(Parent, Child);
    // 定义自己的属性
    this.age = age;
}
// 定义自己的原型方法
Child.prototype.sayAge = function() {
    return this.age;
}

// const child = new Child('Ming', 20);
// console.log(child.sayName());
// console.log(child.sayAge());
// console.log(child.__proto__.constructor.prototype.__proto__.constructor === Parent);

/* -------------------------------------------------------------- */
// ES6 继承
class P{
    constructor(name) {
        this.name = name;
        this.age = 18;
    }
    sayName() {
        return this.name;
    }
}

class C extends P{
    constructor(name, age) {
        super(name);
        this.age = age;
    }
    sayAge() {
        return this.age;
    }
}

// const c = new C('Ming', 20);
// console.log(c.sayName());
// console.log(c.sayAge());
