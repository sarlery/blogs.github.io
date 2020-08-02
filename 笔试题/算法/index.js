// 字符串出现的不重复最长长度
function maxStrLen(str){
    let map = new Map,
        count = 0,
        result = 0,
        prevIdx = 0;
    for(let i = 0;i < str.length;i ++){
        if(!map.has(str[i])){
            count += 1;
        }else{
            let idx = map.get(str[i]);
            let temp = idx, item;
            count = i - idx;
            while(idx >= prevIdx){
                item = map.get(str[idx]);
                if(item <= idx) map.delete(str[idx]);
                idx -= 1;
            }
            prevIdx = temp;
        }
        result = Math.max(result, count);
        map.set(str[i], i);
        console.log(map);
    }
    return result;
}
var str = 'abba';
// console.log(maxStrLen(str));    // 4

