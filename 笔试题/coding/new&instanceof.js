/**
 * 手动实现 new 方法
 * 思路：1. 创建一个空对象
 *      2. 链接该对象（设置该对象的constructor）到另一个对象
 *      3. fn 绑定 this 到空对象上并执行
 *      4. 如果执行后返回值是一个对象，则返回
 *      5. 返回值不是对象，就返回创建出的那个对象
 * @param {Function} fn
 * @param  {...any} args
 */
function myNew(fn, ...args) {
    let result = {};
    const returnVal = fn.call(result, ...args);
    if(returnVal instanceof Object) {
        return returnVal;
    }
    // 将实例的原型链执行函数的原型
    Object.setPrototypeOf(result, fn.prototype);
    return result;
}

// test：
function Person(name, age) {
    this.name = name;
    this.age = age;
    return {};
}

const p = new Person('Ming', 18);
// console.log(myNew(Person, 'Ming', 18));


/**
 * 手动实现 instanceof
 * 检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。
 * 基本类型都会返回 false，其它类型都继承自 Object
 * @param {any} example
 * @param {Function} Constructor
 */
function myInstanceof(example, Constructor) {
    if(typeof example !== 'object' || example === null) {
        return false;   // 基本类型返回 false
    }
    let prototype = Constructor.prototype;
    let __proto__ = Object.getPrototypeOf(example);
    while(__proto__) {
        if(__proto__ === prototype) {
            return true;
        }
        __proto__ = Object.getPrototypeOf(__proto__);
    }
    return false;
}

console.log(myInstanceof('', String));
console.log(myInstanceof([], Object));
console.log(myInstanceof([], Array));
console.log(myInstanceof(123, Object));
// console.log(myInstanceof(() => {}, Function));
// console.log(myInstanceof(new Person('Ming', 18), Person));

// console.log(p instanceof Person);
