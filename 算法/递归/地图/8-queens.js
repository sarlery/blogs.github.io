// 八皇后问题

const MAX = 8;
let count = 0;

// queens 是一个长度为 8 的一维数组
// 数组的每一项表示第几个皇后（数组索引）排在了第几列（数组值）
var queens = new Array(MAX);

function check(n){   // 得到结果
    if(n >= MAX){       // 边界条件，n == 8 说明 8 个皇后已经摆放完毕
        print(queens);
        return;
    }
    for(let i = 0;i < MAX;i ++){        // i 表示第几列
        queens[n] = i;      // 先将第 n 个皇后摆放在第一列
        if(judge(n)){   // 如果发现第 n 个皇后与前面 n-1 个皇后没有冲突
            check(n + 1);   // 没有冲突就摆放第 n+1 个皇后
        }
        // 如果有冲突，说明皇后 n 不能放在第 i 列，继续循环，看看能不能放在 i+1 列
    }
}

/**
 * 判断冲突
 * 同一列、同一行不能有别的皇后
 * 对角线不能有别的皇后
 * @param {number} n 待排列的第几个皇后
 */
function judge(n){
    for(let i = 0;i < n;i ++){
        // 如果列一样，就返回 false
        // 如果在对角线上，返回 false。如果是在对角线上，行的差值和列的差值是一样的（正方形）
        if(queens[i] === queens[n] || Math.abs(i - n) === Math.abs(queens[i] - queens[n])){
            return false;
        }
    }
    return true;
}

function print(ary){
    console.log(ary.join(' '));
    count += 1;
}


check(0);

console.log('count: ', count);