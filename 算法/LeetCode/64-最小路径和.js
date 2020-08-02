/**
 * 给定一个包含非负整数的 m x n 网格，请找出一条从左上角到右下角的路径，使得路径上的数字总和为最小。
 * 每次只能向下或者向右移动一步。
 * @param {number[][]} grid
 * @return {number}
 */
var minPathSum = function(grid) {
    var dp = [], len = grid.length, n = grid[0].length;
    dp[0] = [0];
    for(let i = 0;i < len;i ++){
        dp[i] = [];
        for(let j = 0;j < n;j ++){
            if(i === 0){
                dp[i][j] = j === 0 ? grid[i][j] : dp[i][j - 1] + grid[i][j];
            } else if (j === 0){
                dp[i][j] = dp[i - 1][j] + grid[i][j];
            }else{
                dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j];
            }
        }
    }
    return dp.pop().pop();
};

// test

var arr = [
    [1,3,1],
    [1,1,1],
    [4,2,1]
];

console.log(minPathSum(arr));