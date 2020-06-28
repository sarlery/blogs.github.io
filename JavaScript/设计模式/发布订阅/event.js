var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var EventEmitter = /** @class */ (function () {
    function EventEmitter() {
        this.event = {};
        this.onceEvent = {};
    }
    // 绑定某个事件函数
    EventEmitter.prototype.on = function (eventName, listener, flag) {
        if (flag === void 0) { flag = false; }
        var event = this.event;
        var fnAry = event[eventName];
        if (!fnAry) {
            event[eventName] = [listener];
        }
        else {
            if (!fnAry.includes(listener)) {
                flag ? event[eventName].unshift(listener)
                    : event[eventName].push(listener);
            }
        }
        return this;
    };
    // 绑定某个事件函数，函数触发一次后就会被销毁
    EventEmitter.prototype.once = function (eventName, listener, flag) {
        if (flag === void 0) { flag = false; }
        var event = this.onceEvent;
        var fnAry = event[eventName];
        if (!fnAry) {
            event[eventName] = [listener];
        }
        else {
            if (!fnAry.includes(listener)) {
                flag ? event[eventName].unshift(listener)
                    : event[eventName].push(listener);
            }
        }
        return this;
    };
    // 事件发射器 用来触发事件，第二个参数是传给被触发函数的参数
    EventEmitter.prototype.emit = function (eventName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        // 先触发 on 中的函数，再触发 once 中的函数
        var onEventFn = this.event[eventName];
        var onceEventFn = this.onceEvent[eventName];
        var flag = false;
        if (onEventFn) {
            flag = true;
            this.perform.apply(this, __spreadArrays([onEventFn], args));
        }
        if (onceEventFn) {
            flag = true;
            this.perform.apply(this, __spreadArrays([onceEventFn], args));
            // 执行完成后，别忘了销毁该事件监听
            delete this.onceEvent[eventName];
        }
        return flag;
    };
    EventEmitter.prototype.perform = function (fnAry) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        fnAry.forEach(function (fn) {
            fn.apply(_this, args);
        });
    };
    // 移除某个事件函数，需要具备函数名称
    EventEmitter.prototype.removeEventListener = function (eventName, listener) {
        var onEventFn = this.event[eventName];
        var onceEventFn = this.onceEvent[eventName];
        if (onEventFn) {
            this.event[eventName] = onEventFn.filter(function (fn) { return fn !== listener; });
        }
        if (onceEventFn) {
            this.onceEvent[eventName] = onceEventFn.filter(function (fn) { return fn !== listener; });
        }
        return this;
    };
    EventEmitter.prototype.removeAllListener = function (eventName) {
        delete this.event[eventName];
        delete this.onceEvent[eventName];
        return this;
    };
    // 添加某个事件函数，与 on 函数功能相同
    EventEmitter.prototype.addEventListener = function (eventName, listener, flag) {
        if (flag === void 0) { flag = false; }
        return this.on(eventName, listener, flag);
    };
    EventEmitter.prototype.prependListener = function (eventName, listener) {
        return this.on(eventName, listener, true);
    };
    EventEmitter.prototype.prependOnceListener = function (eventName, listener) {
        return this.once(eventName, listener, true);
    };
    return EventEmitter;
}());

module.exports = EventEmitter;