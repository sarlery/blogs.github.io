// 转换 2-16 进制

/**
 * 
 * @param {number} number 原数字
 * @param {number} sys 转成多少进制数
 */
function transform(number, sys){
    let pos = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
    if(sys < 2 || sys > 16) return number;
    let stack = [];
    let value;
    while(number >= sys){
        value = number % sys;
        stack.push(value);
        number = Math.floor(number / sys);
    }
    var result = pos[number];
    while(stack.length){
        var item = stack.pop();
        result += pos[item];
    }
    return result;
}

console.log(transform(15, 16));