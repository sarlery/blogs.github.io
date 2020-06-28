module.exports = function resolvePromise (x, promise2, resolve, reject) {
    if (x === promise2) {
        reject(new TypeError('chaining cycle detected for promise #<promise>'));
    }
    let called;
    if((typeof x === 'object' && x !== null) || typeof x === 'function') {
        try{
            let then = x.then;
            if (typeof then === 'function') {
                then.call(x, y => {
                    if(called)  return;
                    called = true;
                    resolvePromise(y, promise2, resolve, reject);
                },r => {
                    if(called)  return;
                    called = true;
                    reject(r);
                });
            }else{
                resolve(x);
            }
        }catch(e){
            if(called)  return;
            called = true;
            reject(e);
        }
    }else{
        // 普通值，直接 resolve
        resolve(x);
    }
}