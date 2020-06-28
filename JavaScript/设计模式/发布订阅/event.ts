class EventEmitter{
    // 维护两个事件函数对象，一个存放 on 绑定的事件
    // 一个存放 once 绑定的事件
    event: {
        [eventName: string]: Function[];
    }
    onceEvent: {
        [eventName: string]: Function[];
    }

    constructor(){
        this.event = {};
        this.onceEvent = {};
    }
    _bind(type: string, eventName: string, listener: Function, flag = false): EventEmitter{
        const event = type === "on" ? this.event : this.onceEvent;
        const fnAry = event[eventName];
        if(!fnAry){
            event[eventName] = [listener];
        }else{
            if(!fnAry.includes(listener)){
                flag ? event[eventName].unshift(listener)
                    : event[eventName].push(listener);
            }
        }
        return this;
    }
    // 绑定某个事件函数
    on(eventName: string, listener: Function, flag = false): EventEmitter{
        return this._bind('on', eventName, listener, flag);
    }
    // 绑定某个事件函数，函数触发一次后就会被销毁
    once(eventName: string, listener: Function, flag = false): EventEmitter{
        return this._bind('once', eventName, listener, flag);
    }
    // 事件发射器 用来触发事件，第二个参数是传给被触发函数的参数
    emit(eventName: string, ...args: any[]): boolean{
        // 先触发 on 中的函数，再触发 once 中的函数
        const onEventFn = this.event[eventName];
        const onceEventFn = this.onceEvent[eventName];
        let flag = false;
        if(onEventFn){
            flag = true;
            this.perform(onEventFn, ...args);
        }
        if(onceEventFn){
            flag = true;
            this.perform(onceEventFn, ...args);
            // 执行完成后，别忘了销毁该事件监听
            delete this.onceEvent[eventName];
        }
        return flag;
    }
    perform(fnAry: Function[], ...args: any[]){
        fnAry.forEach(fn => {
            if(typeof fn === "function")
                fn.apply(this, args);
        });
    }
    // 移除某个事件函数，需要具备函数名称
    removeEventListener(eventName: string, listener: Function): EventEmitter{
        let onEventFn = this.event[eventName];
        let onceEventFn = this.onceEvent[eventName];
        if(onEventFn){
            this.event[eventName] = onEventFn.filter(fn => fn !== listener);
        }
        if(onceEventFn){
            this.onceEvent[eventName] = onceEventFn.filter(fn => fn !== listener);
        }
        return this;
    }
    removeAllListener(eventName: string): EventEmitter{
        delete this.event[eventName];
        delete this.onceEvent[eventName];
        return this;
    }
    // 添加某个事件函数，与 on 函数功能相同
    addEventListener(eventName: string, listener: Function, flag = false): EventEmitter{
        return this.on(eventName, listener, flag);
    }
    prependListener(eventName: string, listener: Function): EventEmitter{
        return this.on(eventName, listener, true);
    }
    prependOnceListener(eventName: string, listener: Function): EventEmitter{
        return this.once(eventName, listener, true);
    }
}