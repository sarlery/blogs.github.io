var subsets = function(nums) {
    var len = nums.length;
    var res = [];
    var tmpPath = [];

    function fn(tmp, idx){
        res.push(tmp);
        for(let i = idx;i < len;i ++){
            tmpPath.push(nums[i]);
            fn(tmpPath.slice(), i + 1);
            tmpPath.pop();
        }
    }
    fn(tmpPath, 0);
    return res;
};

console.log(subsets([1, 2, 3]));