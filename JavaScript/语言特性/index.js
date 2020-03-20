function find(ary, target){
  var len = ary.length;
  var res = "";
  for(let i = 0;i < len;i ++){
    var a = target - ary[i];
    var idx = ary.indexOf(a);
    if(idx !== -1){
      res = res + ary[i] + ' ' + a;
      break;
    }
  }
  return res;
}

// console.log(find([1,3,4,6,8], 10));

// 去除括号
function matchBracket(str){
  var reg = /(\(\)|(\{\})|(\[\]))/g;
  var len = str.length;
  if(len % 2 !== 0){
    return false;
  }
  var count = len / 2;
  newStr = str;
  while(count){
    var newStr = newStr.replace(reg, "");
    count -= 1;
  }
  return newStr ? false : true;
}

// console.log(matchBracket("[(){}](){(((((((((((((((((((((((())))))))))))))))))))))))}"));

function fn(n){
  var cache = [0, 1, 2];
  function _fn(n){
    if(cache[n]){
      return cache[n];
    }
    cache[n] = _fn(n - 1) + _fn(n - 2);
    return cache[n];
  }
  return _fn(n);
}

// console.log(fn(3));
