/**
 * @param {number} n
 * @return {number}
 */
var integerBreak = function(n) {
    // cache[i] 表示将数字 i 分割后得到的最大乘积
    var cache = new Array(n + 1).fill(-1);
    cache[1] = 1;
    for(let i = 2;i <= n;i ++){
        for(let j = 1;j < i;j ++){
            cache[i] = Math.max(cache[i], (i - j) * j, j * cache[i - j]);
        }
    }
    return cache[n];
};

// test

var num = 10;

console.log(integerBreak(num));

// 暴力递归
function integerBreak2(n){
    if(n === 2)     return 1;
    var max = -1;
    for(let i = 1;i < n;i ++){
        max = Math.max(max, integerBreak2(n - i) * i, (n - i) * i);
    }
    return max;
}