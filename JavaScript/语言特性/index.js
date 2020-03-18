var str = "abc_def_ghi";  // ---> abcDefGhi

function humpStyle(str){
  var reg = /([a-zA-Z]+)_+([a-zA-Z])([a-zA-Z]+)/g;
  var newStr = str.replace(reg, function(match, p1, p2, p3){
    var upperCase = p2.toLocaleUpperCase();
    return p1 + upperCase + p3;
  });

  return newStr;
} 

console.log(humpStyle(str));