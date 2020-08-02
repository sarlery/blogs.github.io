/**
 * @param {string} s
 * @return {number}
 */
var numDecodings = function(s) {
    var fromCode = String.fromCharCode, table = {};
    for(let i = 1;i <= 26;i ++){
        table[i] = fromCode(64 + i);
    }

    function fn(s){
        var len = s.length;
        if(len === 1 && table[s]){
            return 1;
        }
        for(let i = 0;i < len;i ++){
            
        }
    }
};