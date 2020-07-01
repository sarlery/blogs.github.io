# 手动实现 Promise

`promise` 如今已经深度融入前端开发技术当中，很多模块内部都依赖 `promise`，它为传统的回调模式提供了很好的替代方案。  

`promise` 内部有三种状态：预备态（`pending`）、成功态（`fulfilled`）和失败态（`rejected`）。初始状态是 `pending`，当操作完成时会变成成功态，而操作出现异常而终止时它会变成失败状态（或拒绝态）。一旦 `promise` 被履行或者被拒绝，它就不可逆转，即不能从成功态再变回其他状态，状态之间不能再相互转换。此时的 promise 可以认为是完成状态（`settled`）。  

`then` 函数是 `promise` 中最常用的一个方法。例如：  

```js
let p = new promise((resolve, reject) => {
    resolve(123);
});
p.then(d => {
    console.log(d);
}, e => {
    console.log(e);
});
```

当执行上面代码后，将会履行成功态，执行 `then` 方法的第一个回调函数，打印出 `123`。  

`Promise` 构造函数接收一个 `exector` 函数，当构造实例时，这个函数会立即执行。下面一个初级版的 `promise` 实现。  

```js
const PENDING = 1;
const FULFILLED = 2;
const REJECTED = 3;

class Promise{
    constructor (exector) {
        // 初始状态是 等待态
        this.status = PENDING;
        // 成功时的值
        this.value = undefined;
        // 失败时的值
        this.reason = undefined;

        const resolve = (value)  =>{
            // 用户在调用 resolve 函数后，就要改变状态
            // 如果状态是初始态，才改变，因为状态之间不可逆转
            // resolve 函数不能调用多次，reject 函数也是一样
            if (this.status === PENDING) {
                this.status = FULFILLED;
                this.value = value;
            }
        }
        const reject = (reason) => {
            if (this.status === PENDING) {
                this.status = REJECTED;
                this.reason = reason;
            }
        }

        try {
            // 调用 exector 可能会出错
            exector(resolve, reject);
        } catch (error) {
            // 把异常传给 reject 失败函数
            reject(error);
        }
    }

    then (onFulfilled, onRejected) {
        // 当状态转变时，就调用传入的状态函数
        if (this.status === FULFILLED) {
            onFulfilled(this.value);
        }
        if (this.status === REJECTED) {
            onRejected(this.reason);
        }
    }
}
```
上面的实现过于简单，我们知道，实际当中的 `then` 函数非常强大，可以链式调用，当前的返回值可以作为下一个 `then` 的接收值，而且 promsie 主要是为了解决异步回调问题。比如下面的例子：  

```js
var fn = function (num) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // 大约1秒后把参数传给成功函数
            resolve(num);
        },1000);
    });
}
fn(1000).then(data => {
    return data + 111;  // 返回 1111
}).then(data => {       // data 是上一次 then 的返回值
    console.log('data === ',data);  // 1111
}, e => {
    console.log('error === ',e);
});
```
显然，我们刚刚实现的 promise 不能链式调用，也不能正确处理异步回调，我们的 `then` 方法是同步的代码，用户在异步的情况下使用 `resolve` 或者 `reject` 函数，在调用 `then` 方法时，`resolve` 或 `reject` 函数还没有执行（或者说定时器等异步函数还没有执行），`status` 就还没有改变，但 `then` 方法已经执行完了，这就导致没有接收到结果。  

```js
// 我们自己的 promise
var fn = function (num) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(num);
        },1000);
    });
}
// then 函数中的条件判断都没有命中
fn(1000).then(data => {
    console.log('data == ', data);
},e => {
    console.log('err == ',e);
});
```

## 处理异步

通过上面分析，了解到，调用 `then` 时，`this.status` 可能还是 `PENDING` 状态，说明是异步函数在使用 promise。    

我们可以使用两个数组，分别用来存储失败和成功的回调，当 `status` 变化时，值也会跟着变化（这两个变量都在 resolve 或 reject 函数中改变），这时就遍历数组，执行函数。代码如下：  

```js
class Promise{
    constructor (exector) {
        this.status = PENDING;
        this.value = undefined;
        this.reason = undefined;
        this.onResolvedCbs = [];
        this.onRejectedCbs = [];
        // 失败时的回调
        var reject = (reason) => {
            if(this.status === PENDING){
                this.status = REJECTED; // 状态变化了
                this.reason = reason;   // 值变化了
                // 执行 then 中的回调，这时回调函数的参数中就能拿到值了
                this.onRejectedCbs.forEach(fn => fn());
            }
        };
        var resolve = (value) => {
            if(this.status === PENDING){
                this.status = FULFILLED;    // 状态变化了
                this.value = value;         // 值变化了
                // 执行 then 中的回调，这时回调函数的参数中就能拿到值了
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
        if(this.status === FULFILLED){
            onFulfilled(this.value);
        }
        if(this.status === REJECTED){
            onRejected(this.value);
        }
        if(this.status === PENDING){
            // 异步，就先不执行函数，先把函数存储到数组中
            // 当 status 变化后，在遍历数组，执行函数
            this.onResolvedCbs.push(() => {
                onFulfilled(this.value);
            });
            this.onRejectedCbs.push(() => {
                onRejected(this.reason);
            });
        }
    }
}
```

## 链式调用

链式调用可以说是 Promise 的精华，有了链式调用，你的代码中基本就不会有回调地狱了！  

在 Promise 中，上一次 `then` 方法返回的值会作为下一次 `then` 方法的回调中的参数。`then` 方法返回的值有三种：  

1. 在成功回调或者失败回调中抛出异常，会走到下一次 `then` 的失败回调里；
2. 成功或失败返回的是还是一个 `promise`，那么会用这个 （返回的）promise 的状态作为结果；
3. 普通值。即除了上面两种之外的值，promise 会把这个值传递给外层的下一个 `then` 方法中。  

下面代码是第一种情况的演示：  

```js
var p = function(num){
    return new Promise(resolve => {
        // 这里如果是调用 reject
        // 会触发第一个 then 中的失败回调
        // 如果失败回调中抛出异常，错误会传递到第二个 then 方法的失败回调中
        resolve(num);
    });
}
p(4).then(n => {
    throw Error('出错了！' + n);
},e => {
    console.log('e: ', e);
}).then((d) => {
    console.log('d == ', d);
}, err => {     // 错误会走到这个失败回调中
    console.log('err == ', err);
});
```

下面的代码是情况2的例子，在 then 方法中返回 promise 实例。  

```js
var p = function(num){
    return new Promise((resolve, reject) => {
        resolve(num);
    });
}
p(4).then(n => {
    // then 内部又返回了 promise
    return new Promise((resolve, reject) => {
        resolve(n + 1);     // 调用成功的函数
        // 如果这里调用的 reject 函数，失败的状态会传递到下面 then 方法的失败回调中
    })
}).then((data) => {
    // 在这个 then 中可以接收到 resolve(n + 1) 的数据
    console.log('data === ', data);
},err => console.log('err: ', err));
```

甚至可以像下面这样多次返回 promise 实例：  

```js
var p = function(num){
    return new Promise((resolve, reject) => {
        resolve(num);
    });
}
p(4).then(n => {
    // 多层返回 promise 实例
    return new Promise((resolve, reject) => {
        resolve(n + 1);
    }).then(d => {
        return new Promise((resolve, reject) => {
            resolve(d + 2);
        }).then(d => {
            return new Promise((resolve, reject) => {
                resolve(d + 3);
            });
        });
    });
}).then((data) => {
    // 数据会传到这里，data === 10
    console.log('data === ', data);
}, err => {
    console.log('err: ', err);
});
```

通过上面的例子会发现，`then` 函数功能非常强大，无论返回多少层 promise 实例，成功的数据总是能传递到离它最近的 `then` 方法的成功回调中。如果把上面的代码修改成下面这样：  

```js
p(4).then(n => {    // n === 4
    return new Promise((resolve, reject) => {
        resolve(n + 1);
    }).then(d => {      // d === 5
        return new Promise((resolve, reject) => {
            resolve(d + 2);
        }).then(d => {      // d === 7
            return new Promise((resolve, reject) => {
                resolve(d + 3);
            });
        }).then(data1 => {      // data1 === 10
            // 这个 then 离 resolve(d + 3) 最近，因此会接收数据
            console.log('data1 === ', data1);   // 10
        });
    }).then(data2 => {      // undefined
        console.log('data2 === ', data2);
    })
}).then((data) => {     // undefined
    console.log('data === ', data);
}, err => {
    console.log('err: ', err);
});
```

上面代码看起来实在是有些丑陋，在实际工作当中估计也不会这么写，但这能反映出 `then` 方法的特点。错误处理也是这样，默认会先找离自己最近的失败回调，找不到就向下查找，找到后就执行。在失败中如果返回的是一个普通值，该值会传入下一个 `then` 方法的成功回调里。例如：  

```js
var p = function(num){
    return new Promise((resolve, reject) => {
        reject(num);    // 调用失败函数，num 是一个普通值
    });
}
p(4).then(n => {
    
}, e => {
    return e;   // 返回普通值
}).then(d => {  // d === 4
    console.log('d === ', d);
}, err => {
    console.log('err === ', err);
});
```

`then` 方法的实现原理：通过返回一个新的 promise 实例来实现链式调用（而不是返回当前的实例）。不能返回当前实例，因为一旦是状态转变，就不可逆转。比如上面的代码，失败回调中返回普通值，结果值会传递到下一个成功回调里，而不是失败回调里，如果 then 方法返回的是当前实例，状态已经是失败态，状态不可逆转，也就不能把失败态变成成功态。当返回的是新的 promsie 实例时，把普通值传入 `resolve` 中就可以做到状态转变。  

### 重写 then 方法

代码如下：  

```js
then (onFulfilled, onRejected) {
    // 两个参数必须是回调函数，不是函数时替换成函数
    // 这样可以实现这种效果：promise.then().then().then(d => console.log(d));
    // 即使中间的 then 函数没有传参，后面的 then 函数也可以获取到值，这被称为“值穿透”
    onFulfilled = typeof onFulfilled === 'function' ?
            onFulfilled : v => v;   // 默认是把参数（this.value）直接返回
        onRejected = typeof onRejected === 'function' ? 
            onRejected : err => { throw err };
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
    return promise2;    // 返回 promise 实例，实现链式调用
}
```

调用 `onFulfilled` 或者调用 `onRejected` 函数的地方都加上了定时器和 `try-catch` 语句，用定时器包裹是因为在 promise2 构造函数内部使用了 promise2 实例，在生成实例期间就想使用实例，显然是拿不到 promise2 实例的，这时就要使用定时器，在下一个事件循环时再运行里面的代码，这样就能拿到实例了。try-catch 语句很明显是为了捕获可能抛出的异常，有异常就传给 `reject` 函数。如果没有异常，就交给 `resolvePromise` 函数去处理（普通值或者 promise）。  

代码如下：  

```js
function resolvePromise(x, promise2, resolve, reject){
    if(x === promise2){     // x 不能与 promise2 相等，不然会造成死循环
        reject(new TypeError('TypeError: Chaining cycle detected for promise #<Promise>'));
    }
    let called;
    // 如果 x 是一个对象，或者是一个方法
    if((typeof x === 'object' && x !== null) || typeof x === 'function'){
        // 带有 then 方法的对象被称为 thenable
        try{        // 防止 then 取不到报错
            let then = x.then;  // 如果能获取到 then 方法，就认为 x 是一个 promise 实例
            if(typeof then === 'function'){
                // 执行 then 方法，将 this 指向 x
                then.call(x, y => {
                    if(called)  return;
                    called = true;
                    // y 也有可能是一个 promise，递归调用，直到获得普通值或抛出异常
                    // 这里之所以判断 called 是因为，called 可能会变成 true（至少递归了一次），
                    // called === true，说明 reject 执行了，就终止递归
                    resolvePromise(y, promise2, resolve, reject);
                }, err => {
                    if(called)  return;
                    called = true;
                    reject(err);
                });
            }else{      // 对象或者函数中没有 then 方法，就按照普通值处理
                resolve(x);
            }
        }catch(e){
            if(called)  return;
            called = true;
            reject(e);
        }
    }else{      // x 是一个普通值
        resolve(x);
    }
}
```

在上面代码中，多次对 `called` 变量做判断，这是为了防止多次调用，一旦失败就 reject 出去，不再递归调用。  

以上就实现了一个 Promise，如果要检测符不符合 Promise/A+ 规范，可以使用 npm 下载 promises-aplus-tests 包，写入一下代码：  

```js
// Promise 就是你自己封装的 Promise 类
Promise.defer = Promise.deferred = function () {
    let dfd = {};
    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd;
}
```

然后运行下面的代码：  

```
npx promises-aplus-tests promise.js
```

如果又不符合规范的地方，终端会输出错误信息。关于 Promise/A+ 规范可以参考这个网站：  [Promise/A+](https://promisesaplus.com/)

## 完善

以上基本就是 promise 的全部内容，至于 `catch`、`resolve`、`reject` 等方法都是在原有的基础上做的扩展或者封装，这些方法并不算是 promise 的核心。下面就一一实现这些方法。  

### catch 

`catch` 是 promise 实例上的方法，添加一个拒绝态的回调到当前 promise，然后返回一个新的 promise。实现如下：  

```js
catch(errCbs){
    return this.then(null, errCbs);
}
```

### resolve 与 reject

这两个方法是 Promise 的静态方法。`resolve` 返回一个 Promise 对象，这样就能将该值以 Promise 对象形式使用；`reject` 返回一个状态为失败的 Promise 对象，并将给定的失败信息传递给对应的处理方法。  

它们的实现如下：  

```js
static resolve(value){
    return new Promise((resolve, reject) => {
        resolve(value);
    });
}

static reject(reason){
    return new Promise((resolve, reject) => {
        reject(reason);
    });
}
```

`resolve` 函数比较特别，例如：  

```js
// resolve 函数可以嵌套，多层 resolve，会以最内层的值为准
//（最内层也可以是 reject，这样会走失败态）
Promise.resolve(
    Promise.resolve(
        Promise.resolve(1)
    )
).then(d => {   // d: 1
    console.log('d: ', d);
}, e => console.log('e == ', e));
```

这时就要改造一下 `constructor` 中的 `resolve` 函数，需要判断传入的 `value` 是不是一个 promise。  

```js
constructor(exector){
    var reject = (reason) => {
        // ...
    };
    var resolve = (value) => {
        if(value instanceof Promise){
            return value.then(resolve, reject);
        }
        // ...
    };
}
```

### finally

`finally` 是 promise 实例上的方法，它可以传入一个回调函数，无论成功还是失败这个回调都会去执行。finally 回调参数可以返回一个 promise，如果是成功的 promise，会采用上一次的结果，如果是失败的 promise，会采用这一次的失败结果，并把结果传入 catch 中（或 then 的第二个回调参数）。`finally` 最终也是返回新的 promise 实例，例如：  

```js
new Promise ((resolve, reject) => {
    resolve(1);     // 首次成功
}).finally(() => {
    return new Promise((resolve) => {
        resolve(100);   // 返回成功的 promise
    });
}).then(d => {      // d == 1
    // 采用上一次的结果（1），而不是 100
    console.log('d == ', d);
}).catch(err => {
    console.log('err', err);
});

// 失败情况：

new Promise ((resolve, reject) => {
    reject(1);      // 首次
}).finally(() => {
    return new Promise((resolve, reject) => {
        reject(100);    // 失败的 promise
    });
}).then(d => {
    console.log('d == ', d);
}).catch(err => {   // err 100
    console.log('err', err);
    // 采用当前的失败数据
});
```

`finally` 方法实现如下：  

```js
finally(cb){
    return this.then(val => {
        return Promise.resolve(cb()).then(() => val);
    }, err => {
        return Promise.resolve(cb()).then(() => { throw err });
    });
}
```

### all

all 是一个静态方法，接受一个迭代器，返回 promise 实例，此实例在迭代所有的 promise 都完成（resolved）或参数中不包含 promise 时回调完成（resolve）；如果参数中 promise 有一个失败（rejected），此实例回调失败（reject），失败的原因是第一个失败 promise 的结果。实现如下：  

```js
static all(iterable){
    return new Promise((resolve, reject) => {
        let orderIdx = 0;
        let resultArr = [];

        for(let i = 0;i < iterable.length;i ++){
            let value = iterable[i];
            this.resolve(value).then(res => {
                resultArr[i] = res;
                orderIdx ++;
                if(orderIdx === iterable.length){
                    resolve(resultArr);
                }
            },err => {
                reject(err);
            });
        }
    });
}
```

测试：  

```js
let p1 = Promise.resolve(1);
let p2 = Promise.reject(2);
let p3 = Promise.resolve(3);

Promise.all([p1,p2,p3,4]).then(result => {
    console.log('result: ', result);
},err => {      // err: 2
    console.log('err: ', err);
});
```

### race

`race` 也是一个静态方法，它也接受一个迭代器，返回一个 promise，一旦迭代器中的某个 promise 解决或拒绝，返回的 promise 就会解决或拒绝。  

实现：  

```js
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
```