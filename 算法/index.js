/**
 * 获取指定范围内的 “亲密数”
 * 所谓亲密数，就是整数 a 的所有因子的和（不包括自身）等于 b，
 * 而整数 b 的所有因子的和等于 a，并且 a !== b
 * @param {number} n 
 */
function intimacyNum(n){
    var filter = {},
        res = [];

    for(let i = 2;i <= n;i ++){
        // 做优化处理，当是完数时，下次就不遍历它了
        if(filter[i])
            continue;

        // 获取当前的数的因子相加的结果
        var now = getFactor(i),
            // 在获取另一个数因子相加的结果
            other = getFactor(now);
        if(now !== i && other === i){
            // 把符合的数送入哈希表中，下次就不遍历了
            filter[now] = now;
            res.push([i,now]);
        }
    }

    return res;

    /**
     * 获得一个数的所有因子之和
     * @param {number} num 
     */
    function getFactor(num){
        var sum = 0;
        for(let j = 1;j <= Math.floor(num / 2);j ++){
            if(num % j === 0){
                sum += j;
            }
        }
        return sum;
    }
}
// console.log(intimacyNum(3000));

/**
 * 获取指定整数范围内的所有完数
 * 所谓完数，就是指他的所有因子相加还等于它自身；
 * 
 * 大数学家欧拉曾推算出完全数的获得公式：如果 p 是质数，
 * 且2^p-1也是质数，那么（2^p-1）X2^（p-1）便是一个完全数。
 * @param {number} num 
 */
const prefectNum = function(num){
    var res = [];
    for(let i = 2;i <= num;i ++){
        var sum = 0;
        for(let j = 1;j <= Math.floor(i / 2);j ++){
            if(i % j === 0)
                sum += j;
        }
        if(sum === i)
            res.push(i);
    }
    return res;
}
// console.log(prefectNum(200));

/**
 * 水仙花数
 * 一个数 abc，且这个数满足：abc = a^3 + b ^3 + c^3
 * 一个数 abcd，且这个数满足：abcd = a^4 + b^4 + c^4 + d^4
 * 则 abc、abcd 称为水仙花数
 * @param {number} range 
 */
function narcissusNum(range){
    var res = [];
    for(let i = 100;i <= range;i ++){
        var numArr = String(i).split(""),
            len = numArr.length,
            sum = 0;
        for(let k = 0;k < len;k ++){
            sum += Math.pow(numArr[k],len);
        }
        if(sum === i)
            res.push(i);
    }
    return res;
}
// console.log(narcissusNum(100000));

/**
 * 判断一个字符串是不是对称的（回文串）
 * 比如： level、noon
 * @param {string} str 
 */
function symStr(str){
    return str.split("").reverse().join("") === str;
}
// console.log(symStr("noon"));

/**
 * 求一定范围的 “自守数”
 * 所谓自守数就是一个数的平方结果的后几位数等于该数自身的一种自然数
 * 比如：25^2 == 625    (625 的零头刚好是 25)
 * 再比如：6^2 == 36    (36 的零头刚好是 6)
 * @param {number} range 
 */
function selfNum(range){
    let res = [];
    for(let i = 10;i <= range;i ++){
        var v = String(i ** 2),
            vl = v.length,
            s = String(i),
            l = s.length;
        if(v.slice(vl - l) === s){
            res.push(i);
        }
    }
    return res;
}
// console.log(selfNum(100000));