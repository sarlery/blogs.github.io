
/**
 * 手动实现 call 方法
 * @param {Function} fn
 * @param {Object} context
 * @param  {...any} args
 */
function myCall(fn, context = window, ...args) {
    const sys = Symbol();
    context[sys] = fn;
    const result = context[sys](...args);
    console.log(context[sys]);
    delete context[sys];
    return result;
}

// test:
const obj = {
    a: 1,
    b: 2
};

function aaa(c, d) {
    this.c = c;
    this.d = d;
    return this.a + this.b + c * d;
}

/**
 * apply 实现
 * @param {Function} fn
 * @param {Object} context
 * @param {Array<any>} args
 */
function myApply(fn, context = window, args) {
    const sys = Symbol();
    context[sys] = fn;
    const result = context[sys](...args);
    delete context[sys];
    return result;
}

// console.log(myApply(aaa, obj, [1, 2]));


/**
 * bind 实现
 * 特点：绑定函数时，调用内部 call 方法
 * 绑定函数也可以使用 new 运算符构造，它会表现为目标函数已经被构建完毕了似的。
 * 绑定后使用 new 运算符，提供的 this 值将会被忽略，但前置参数仍会提供给模拟函数。
 * @param {Function} fn
 * @param {Object} context
 * @param  {...any} args
 */
function myBind(fn, context = window, ...args) {
    if(typeof fn !== 'function') {
        return ;
    }
    const slice = Array.prototype.slice;
    return function newFn() {
        const newArgs = args.concat(slice.call(arguments));
        if(this instanceof newFn) {
            // 如果调用了 new 运算符，则 this 将是 newFn 的实例
            return new fn(...newArgs);
        }
        return fn.call(context, ...newArgs);
    }
}

// test：
const bindFn = myBind(aaa, obj, 3);
console.log(bindFn(2));
console.log(new bindFn(2));
