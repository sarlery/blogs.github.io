/**
 * @param {number[]} nums
 * @return {number}
 */
var rob = function(nums) {
    function fn(nums, n){
        // 如果只有一间房子，那么就必须偷它
        // 如果有两家房子，也只能偷一家，偷价值最高的一家
        // 如果有 n 家房子，可以偷第一家或第二家或第三家...
        // 但，第 n 家和第 n-1 家只能投一个
        // 如果偷第 n 家，那么第 n-1 家就不能再偷...
        // 如果偷第 n-1 家，那么第 n-2 家就不能再偷...

        if(n === 0){
            return nums[0];
        }
        let s1 = fn(nums, n - 2) + nums[n];
        let s2 = fn(nums, n - 1);
        return Math.max(s1, s2);
    }
    return fn(nums, nums.length - 1);
};