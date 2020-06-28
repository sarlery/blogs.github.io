function trim(str){
    var reg = /(^[\s]+|[\s]+$)/;
    return str.replace(reg, str);
}

var res = trim("  hello world ");
console.log(res);