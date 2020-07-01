const PENDING = 1;
const FULFILLED = 2;
const REJECTED = 3;

class Promise {

    static resolve(val) {
        return new Promise((resolve, reject) => {
            resolve(val);
        });
    }
    static reject(reason) {
        return new Promise((resolve, reject) => {
            reject(reason);
        });
    }

    static all(iterable) {
        return new Promise((resolve, reject) => {
            let orderIdx = 0;
            let resultArr = [];

            for (let i = 0; i < iterable.length; i++) {
                let value = iterable[i];
                this.resolve(value).then(res => {
                    resultArr[i] = res;
                    orderIdx++;
                    if (orderIdx === iterable.length) {
                        resolve(resultArr);
                    }
                }, err => {
                    reject(err);
                });
            }
        });
    }

    static race(iterable) {
        if(!Array.isArray(iterable)){
            throw TypeError(`${iterable} is not an array`);
        }
        let Constructor = this;
        return new Constructor((resolve, reject) => {
            for(let i = 0;i < iterable.length;i ++){
                Constructor.resolve(iterable[i]).then(resolve,reject);
            }
        });
    }

    constructor(exector) {
        this.status = PENDING;
        this.value = undefined;
        this.reason = undefined;
        // this.onResolvedCbs = [];
        // this.onRejectedCbs = [];
        this.onResolvedCbs = undefined;
        this.onRejectedCbs = undefined;

        var reject = (reason) => {
            if (this.status === PENDING) {
                this.status = REJECTED;
                this.reason = reason;
                // this.onRejectedCbs.forEach(fn => fn());
                this.onRejectedCbs();
            }
        };
        var resolve = (value) => {
            if (value instanceof Promise) {
                return value.then(resolve, reject);
            }
            if (this.status === PENDING) {
                this.status = FULFILLED;
                this.value = value;
                // this.onResolvedCbs.forEach(fn => fn());
                this.onResolvedCbs();
            }
        };

        try {
            exector(resolve, reject);
        } catch (e) {
            reject(e);
        }
    }

    catch (errCbs) {
        return this.then(null, errCbs);
    } 
    
    finally(cb) {
        return this.then(v => {
            return Promise.resolve(cb()).then(() => v);
        }, err => {
            return Promise.resolve(cb()).then(() => {
                throw err
            });
        });
    }

    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ?
            onFulfilled : v => v;
        onRejected = typeof onRejected === 'function' ?
            onRejected : err => {
                throw err
            };
        let promise2 = new Promise((resolve, reject) => {
            /**
             * 根据 onFulfilled 回调执行后的返回值来判断是调用 resolve 还是 reject
             * onFulfilled 回调可能返回 promise，可能抛出异常，也可能返回的是一个普通值
             */
            if (this.status === FULFILLED) {
                setTimeout(() => {
                    try { // 加 try-catch 是因为 onFulfilled 回调可能抛出异常
                        let x = onFulfilled(this.value);
                        resolvePromise(x, promise2, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            }
            if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason);
                        resolvePromise(x, promise2, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            }
            if (this.status === PENDING) {
                // 异步，就先不执行函数，先把函数存储到数组中
                // 当 status 变化后，在遍历数组，执行函数
                this.onResolvedCbs = (() => {
                    setTimeout(() => {
                        try { // 加 try-catch 是因为 onFulfilled 回调可能抛出异常
                            let x = onFulfilled(this.value);
                            resolvePromise(x, promise2, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    }, 0);
                });
                this.onRejectedCbs = (() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason);
                            resolvePromise(x, promise2, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    }, 0);
                });
            }
        });
        return promise2;
    }
}

function resolvePromise(x, promise2, resolve, reject) {
    if (x === promise2) {
        reject(new TypeError('TypeError: Chaining cycle detected for promise #<Promise>'));
    }
    let called;
    if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
        try {
            let then = x.then;
            if (typeof then === 'function') {
                then.call(x, y => {
                    // console.log('y === ', y);
                    if (called) return;
                    called = true;
                    resolvePromise(y, promise2, resolve, reject);
                }, err => {
                    if (called) return;
                    called = true;
                    reject(err);
                });
            } else {
                resolve(x);
            }
        } catch (e) {
            if (called) return;
            called = true;
            reject(e);
        }
    } else {
        resolve(x);
    }
}

Promise.defer = Promise.deferred = function () {
    let dfd = {};
    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd;
}

module.exports = Promise;
