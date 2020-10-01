/**
 * ES5 实现 const 声明变量
 * writable false 表示只读不可写，赋值运算符无效
 * configurable true 表示属性的描述符才能够被改变，同时该属性也能从对应的对象上被删除。
 * enumerable true 表示属性才会出现在对象的枚举属性中
 * @param {string} key 变量名
 * @param {any} value 变量值
 */
function es5Const(key, value) {
    let context = this || window;
    "use strict"
    Object.defineProperty(context, key, {
        // writable: false,
        // configurable: false,
        // value,
        get() {
            return value;
        },
        set() {
            throw new TypeError('Assignment to constant variable.');
        }
    });
}

// test:
es5Const('a', 123);
a = 456;

console.log('a === ', a);
