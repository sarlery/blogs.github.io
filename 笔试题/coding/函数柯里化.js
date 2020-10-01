
/**
 * 函数柯里化
 * @param {Function} fn
 * @param {arguments} args
 */
function curry(fn, args) {
    const fnLen = fn.length;
    args = args || [];

    return function() {
        let newArgs = args.concat(Array.prototype.slice.call(arguments));
        if(newArgs.length < fnLen) {
            return curry.call(this, fn, newArgs);
        } else {
            return fn.apply(this, newArgs);
        }
    }
}

// test

function add(a, b, c, d) {
    return a + b + c + d;
}

const curriedFn = curry(add);

let addRes = curriedFn(1)(2, 3);
let result = addRes(4);

console.log(result === 10);
