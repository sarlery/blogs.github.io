/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isSubsequence = function(s, t) {
    var size = s.length;
    var count = 1, nowIdx = 0;
    for(let i = 0;i < t.length;i ++){
        if(t[i] === s[nowIdx]){
            // count += 1;
            nowIdx += 1;
        }
    }
    return nowIdx === size;
};

// test
var s = "abc",  t = "ahcbgd";

var res = isSubsequence(s, t);

console.log(res);
