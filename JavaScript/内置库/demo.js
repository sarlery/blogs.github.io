
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
function deepClone_1(data){

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
 * 深度克隆，解决循环引用
 * @param {Object} object
 * @param {WeakMap} wMap
 */
function deepClone(object, wMap = new WeakMap()) {
    var res = null;
    if (object === null || !typeof object === 'object') {
        return object;
    }
    if (Array.isArray(object)) {
        res = [];
    } else if (Object.prototype.toString.call(object) === "[object Object]") {
        res = {};
    }
    const obj = wMap.get(object);
    if (obj) {
        return obj;
    }
    wMap.set(object, res);
    for (let p in object) {
        if (typeof object[p] === "object") {
            res[p] = deepClone(object[p], wMap);
        } else {
            res[p] = object[p];
        }
    }
    return res;
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

/**
 * 输入一个形如 “2019/10/9” 或者 “2019-10-9” 的日期格式，判断这个日期是不是今天
 * @param {string} str
 */
function isToday_1(str){
    var s = str.replace(/\-/g,"/"),
        // 考虑到 IE 兼容性
        // 在 IE 中，toLocaleString() 的日期格式是这样的："xxxx年xx月xx日"
        nowDate = (new Date()).toLocaleString().replace(/年|月|日/g,"/");
    if(s === nowDate){
        return true;
    }
    return false;
}

/**
 * 输入一个形如 “2019/10/9” 或者 “2019-10-9” 的日期格式，判断这个日期是不是今天 的第二种方案
 * @param {string} str
 */
function isToday(str){
    var s = str.split("-");
    if(s.length === 1){
        s = str.split("/");
    }
    var now = new Date();
    return (
        Number(s[0]) === now.getFullYear() &&
        Number(s[1]) === now.getMonth() + 1 &&
        Number(s[2]) === now.getDate()
    );
}

/**
 * URL 解析，输入 URL，输出一个对象
 * @param {string} url
 */
function parseURL_1(url) {
    url = new URL(url);
    var res = {},
        search = decodeURIComponent(url.search.replace("?", ""));
    arr = search.split("&");
    arr.forEach(item => {
        var a = item.split("=");
        res[a[0]] = a[1];
    });
    return res;
}

/**
 * URL 解析， 输入 URL， 输出一个对象
 * @param {string} url
 */
function parseURL(url) {
    var reg = /\?((%?.*)\=(%?.*))&?/g;
    query = url.match(reg);
    if (query) {
        query = decodeURIComponent(query[0].replace("?", ""));
        var arr = query.split("&"),
            res = {};
        arr.forEach(item => {
            var a = item.split("=");
            res[a[0]] = a[1];
        });
        return res;
    }
    return null;
}

/**
 * 对象序列化
 * @param {Object} object
 */
function stringifyURL(object) {
    var str = "";
    for (let p in object) {
        str = str + p + "=" + object[p] + "&";
    }
    return str.replace(/&$/, "");
}
