/**
 * 判断两个值不否相等
 * 在 Object.is 中，+0 !== -0 成立
 * Object.is(NaN, NaN) 也成立
 * @param {any} left
 * @param {any} right
 */
function objectIs(left, right) {
    if(left === right) {
        // 默认情况下 -0 === +0 成立
        // 当 left 和 right 分别等于 -0 和 +0 时
        // 1 / -0 === -Infinity; 而 1 / 0 === Infinity
        // -Infinity !== Infinity
        return left !== 0 || right !== 0 || 1 / left === 1 / right;
    } else {
        // NaN 默认不等于 NaN
        return left !== left && right !== right;
    }
}

// 判断是不是 NaN
// typeof NaN === 'number' 成立
function myIsNaN(value) {
    return typeof value === 'number' && value !== value;
}

// test:

console.log(objectIs(NaN, NaN));
console.log(objectIs(0, -0));
console.log(objectIs(-0, -0));

console.log(myIsNaN(NaN));
console.log(myIsNaN(''));
console.log(myIsNaN(123));

