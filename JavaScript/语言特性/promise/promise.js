const resolvePromise = require('./util');

const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class Promise{
    constructor (exector) {
        this.status = PENDING;
        this.value = undefined;
        this.reason = undefined;

        this.onResolvedCbs = [];
        this.onRejectedCbs = [];

        var reject = (reason) => {
            if (this.status === PENDING) {
                this.status = REJECTED;
                this.reason = reason;
                this.onRejectedCbs.forEach(fn => fn());
            }
        }

        var resolve = (value)  => {
            if (value instanceof Promise) {
                return value.then(resolve, reject);
            }
            if (this.status === PENDING) {
                this.status = FULFILLED;
                this.value = value;
                this.onResolvedCbs.forEach(fn => fn());
            }
        }

        try {
            exector(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }

    static resolve (val) {
        return new Promise(resolve => {
            resolve(val);
        });
    }
    static reject (reason) {
        return new Promise ((resolve, reject) => {
            reject(reason);
        });
    }

    catch (errCbs) {
        return this.then(null, errCbs);
    }

    then (onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ?
            onFulfilled : v => v;
        onRejected = typeof onRejected === 'function' ?
            onRejected : err => { throw err };

        let promise2 = new Promise ((resolve, reject) => {
            if (this.status === FULFILLED) {
                setTimeout(() => {
                    try{
                        let x = onFulfilled(this.value);
                        resolvePromise(x, promise2, resolve, reject);
                    }catch(e){
                        reject(e);
                    }
                },0);
            }
            if (this.status === REJECTED) {
                setTimeout(() => {
                    try{
                        let x = onRejected(this.reason);
                        resolvePromise(x, promise2, resolve, reject);
                    }catch(e){
                        reject(e);
                    }
                }, 0);
            }
            if (this.status === PENDING) {
                this.onResolvedCbs.push(() => {
                    setTimeout(() => {
                        try{
                            let x = onFulfilled(this.value);
                            resolvePromise(x, promise2, resolve, reject);
                        }catch(e) {
                            reject(e);
                        }
                    }, 0);
                });
                this.onRejectedCbs.push(() => {
                    setTimeout(() => {
                        try{
                            let x = onRejected(this.reason);;
                            resolvePromise(x, promise2, resolve, reject);
                        }catch(e) {
                            reject(e);
                        }
                    }, 0);
                });
            }
        });
        return promise2;
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

// 测试命令： npx promises-aplus-tests promise.js
module.exports = Promise;