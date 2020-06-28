const PENDING = 0;
const FULFILLED = 1;
const REJECTED = 2;

class Promise{
    constructor (exector) {
        this.status = PENDING;
        this.value = undefined;
        this.reason = undefined;
        this.onResolvedCbs = [];
        this.onRejectedCbs = [];

        var reject = (reason) => {
            if(this.status === PENDING){
                this.status = REJECTED;
                this.reason = reason;
                this.onRejectedCbs.forEach(fn => fn());
            }
        };
        var resolve = (value) => {
            if(this.status === PENDING){
                this.status = FULFILLED;
                this.value = value;
                this.onResolvedCbs.forEach(fn => fn());
            }
        };

        try{
            exector(resolve, reject);
        }catch(e){
            reject(e);
        }
    }

    then (onFulfilled, onRejected) {
        let promise2 = new Promise((resolve, reject) => {
            /**
             * 根据 onFulfilled 回调执行后的返回值来判断是调用 resolve 还是 reject
             * onFulfilled 回调可能返回 promise，可能抛出异常，也可能返回的是一个普通值
             */
            if(this.status === FULFILLED){
                setTimeout(() => {
                    try{        // 加 try-catch 是因为 onFulfilled 回调可能抛出异常
                        let x = onFulfilled(this.value);
                        resolvePromise(x, promise2, resolve, reject);
                    }catch(e){
                        reject(e);
                    }
                },0);
            }
            if(this.status === REJECTED){
                setTimeout(() => {
                    try{
                        let x = onRejected(this.reason);
                        resolvePromise(x, promise2, resolve, reject);
                    }catch(e){
                        reject(e);
                    }
                },0);
            }
            if(this.status === PENDING){
                // 异步，就先不执行函数，先把函数存储到数组中
                // 当 status 变化后，在遍历数组，执行函数
                this.onResolvedCbs.push(() => {
                    setTimeout(() => {
                        try{        // 加 try-catch 是因为 onFulfilled 回调可能抛出异常
                            let x = onFulfilled(this.value);
                            resolvePromise(x, promise2, resolve, reject);
                        }catch(e){
                            reject(e);
                        }
                    },0);
                });
                this.onRejectedCbs.push(() => {
                    setTimeout(() => {
                        try{
                            let x = onRejected(this.reason);
                            resolvePromise(x, promise2, resolve, reject);
                        }catch(e){
                            reject(e);
                        }
                    },0);
                });
            }
        });
        return promise2;
    }
}

module.exports = Promise;