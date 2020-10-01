/**
 * 节流，将一个函数的调用频率限制在一定阈值内
 * 比如 1s 之内只触发 3次回调函数
 * 案例：动画执行频率
 * @param {Funciton} fn 回调函数
 * @param {number} delay 延迟时间
 */
function throttle(fn, delay, first = true) {
    let timer;
    // 要不要首次触发回调函数
    let isFirst = !!first || false;

    return function(...args) {
        let that = this;

        if(isFirst) {
            fn.apply(that, args);
            return isFirst = false;
        }
        if(timer) return false;
        timer = setTimeout(function() {
            clearTimeout(timer);
            timer = null;
            fn.apply(that, args);
        }, delay || 400);
    }
}


/**
 * 防抖，在规定的时间内只触发一次回调
 * 用于防护用户的不必要的频繁操作
 * 比如该频率点击按钮、改变浏览器窗口大小
 * @param {Function} fn
 * @param {number} delay
 */
function debounce(fn, delay) {
    let timer = null;

    return function(...args) {
        let self = this;
        clearTimeout(timer);

        timer = setTimeout(function() {
            fn.apply(self, args);
        }, delay || 500);
    }
}
