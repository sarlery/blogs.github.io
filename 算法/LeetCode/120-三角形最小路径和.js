/**
 * 给定一个三角形，找出自顶向下的最小路径和。每一步只能移动到下一行中相邻的结点上。
 * 相邻的结点 在这里指的是 下标 与 上一层结点下标 相同或者等于 上一层结点下标 + 1 的两个结点。
 * 
 * [
 *      [2],
 *      [3, 4],
 *      [6, 5, 7],
 *      [4, 1, 8, 7]
 * ]
 * 自顶向下的最小路径和为 11 （2 + 3 + 5 + 1 = 11）
 * @param {number[][]} triangle 
 * @returns number
 */

var minimumTotal = function(triangle) {
    var dp = [];
    var len = triangle.length;
    if(len > 0){
        dp = [[triangle[0][0]]];
    }
    for(let i = 1;i < len;i ++){
        dp[i] = [];
        for(let j = 0;j < triangle[i].length;j ++){
            if(j === 0){
                dp[i][j] = dp[i - 1][j] + triangle[i][j];
            }else if(j === i){
                dp[i][j] = dp[i - 1][j - 1] + triangle[i][j];
            }else{
                dp[i][j] = Math.min(dp[i - 1][j], dp[i - 1][j - 1]) + triangle[i][j];
            }
        }
    }
    return Math.min(...dp.pop());
};

console.log(minimumTotal([[-1],[2,3],[1,-1,-3]]));  // -1