/**
 * 数组深度扁平化
 * @param {Array} arr
 */
function flat(arr){
    if(!Array.isArray(arr)){
        return arr;
    }
    var result = [];
    (function fn(array){
        array.forEach(item => {
            if(Array.isArray(item)) fn(item);
            else result.push(item);
        })
    })(arr);

    return result;
}


/**
 * 深度拷贝对象或者数组
 * @param {Object} value
 */
function deepClone(data){

    function judge(val){
        var toString = Object.prototype.toString;
        switch(toString.call(val)){
            case '[object Object]':
                return 'object';
            case '[object Array]':
                return 'array';
        }
    }

    var result;

    switch(judge(data)){
        case 'array':
            result = [];
            break;
        case 'object':
            result = {};
            break;
        default: return data;
    }

    for(let k in data){
        var value = data[k];
        if(judge(value) === 'object'){
            result[k] = deepClone(value);
        }else if(judge(value) === 'array'){
            result[k] = deepClone(value);
        }else{
            result[k] = value;
        }
    }
    return result;
}


/**
 * 数组乱序（洗牌算法）
 * @param {Array} array
 */
function shuffle(array) {
    var result = [...array],
        len = array.length;

    for(let i = 0;i < len;i ++){
        var randomIdx = Math.floor(Math.random() * len);
        var temp = result[randomIdx];
        result[randomIdx] = result[i];
        result[i] = temp;
    }

    return result;
}

/**
 * ES6 数组去重
 * @param {Array} array
 */
var unique = function(array){
    return [...new Set(array)];
}

/**
 * 寻找数组中最大的值
 * @param {Array} array
 */
var getMaxItem = function (array) {
    return Math.max(...array);
}

/**
 * 寻找数组中最小的值
 * @param {Array} array
 */
var getMinItem = function (array) {
    return Math.min(...array);
}

/**
 * 防抖函数
 * @param {function} fn
 * @param {number} delay
 */
function bounduce(fn,delay){
    var timer = null;
    return function(){
        clearTimeout(timer);
        var self = this,
            args = arguments;
        timer = setTimeout(function(){
            fn.apply(self,args);
        },delay || 500);
    }
}

/**
 * 延迟函数
 * @param {number} delay
 */
var sleep = function(delay){
    return new Promise(resolve => {
        setTimeout(resolve,delay);
    });
}

Number.prototype.add = function(num){
    return this + num;
}

Number.prototype.minus = function(num){
    return this - num;
}

console.log((5.5).add(3.5).add(5.5).minus(3.5));


/**
 * Promise Ajax 请求
 * @param {string} url
 * @param {string} method
 * @param {Object} data
 * @param {Object} headers
 */
function ajax(url,method = 'GET',data = null,headers = {}){

    return new Promise((resolve,reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url);

        for (let p in headers) {
            xhr.setRequestHeader(p, headers[p]);
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                    resolve(xhr.responseText);
                }else{
                    reject(xhr.status);
                }
            }
        }
        xhr.send(data);
    });
}
