// 实现一个 Promise
class Promise{

    constructor(executor){
        this.state = "pending";
        // 成功的信息
        this.successResult = undefined;
        // 失败的信息
        this.failResult = undefined;
        // 存储成功的函数数组
        this.resolveFnCbs = [];
        this.rejectFnCbs = [];

        const resolve = (value) => {
            this.state = "fulfilled";
            this.successResult = value;
            // 调用 resolve 时就执行数组当中的所有函数
            this.resolveFnCbs.forEach(fn => fn());
        };
        const reject = (value) => {
            this.state = "rejected";
            this.failResult = value;
            // 调用 reject 后就执行数组当中的所有函数
            this.rejectFnCbs.forEach(fn => fn());
        }
        // 将两个静态方法传入
        executor(resolve, reject);
    }

    then(resolveFn, rejectFn){
        if(this.state === "fulfilled"){
            // 成功
            resolveFn(this.successResult);
        }
        if(this.state === "rejected"){
            // 失败
            rejectFn(this.failResult);
        }
        // state 是 pending 时，就把函数放入数组当中
        this.resolveFnCbs.push(() => resolveFn(this.successResult));
        this.rejectFnCbs.push(() => rejectFn(this.failResult));
    }
}

module.exports = Promise;