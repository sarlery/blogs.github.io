/**
 * Fn = min(cost[n] + F(n - 1), cost[n] + F(n - 2))
 * dp[i] = min(cost[i] + dp(i - 1), cost[i] + dp[i - 2])
 * 
 * @param {number[]} cost
 * @return {number}
 */
var minCostClimbingStairs = function(cost) {
    var len = cost.length;
    return fn(len - 1);
    function fn(n){
        if(n <= 1){
            return cost[n];
        }else{
            return Math.min(cost[n] + fn(n - 1), cost[n] + fn(n - 2));
        }
    }
};

// test
var cost = [10, 15, 20];
console.log(minCostClimbingStairs(cost));