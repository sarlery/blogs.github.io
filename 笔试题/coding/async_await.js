/**
 * 将 generator 函数变成自动执行
 * @param {Generator} generatorFunc
 */
function asyncToGenerator(generatorFunc) {
    return function() {
        const gen = generatorFunc.apply(this, arguments);

        return new Promise((resolve, reject) => {

            function step(key, arg) {
                let genResult;
                try {
                    genResult = gen[key](arg);
                } catch (error) {
                    return reject(error);
                }

                const { value, done } = genResult;
                if(done) {
                    return resolve(value);
                } else {
                    return Promise.resolve(value).then(
                        val => step('next', val),
                        err => step('throw', err)
                    );
                }
            }

            step('next');
        });
    }
}

function multiply(x, y) {
    return Promise.resolve(x * y);
}
async function add(a, b) {
    return a + b + await multiply(a, b);
}
function* add1(a, b) {
    const result = yield multiply(a, b);
    return a + b + result;
}

const result = asyncToGenerator(add1);
result().then(res => {
    console.log(res);
}, err => {
    console.log(err);
});

// const result = add(2, 4);
// result.then(res => {
//     console.log(res);
// });

function* gen(a, b) {
    let c = yield a + b;
    let d = yield c * a;
    let e = yield d * b;
    return e;
}

const g = gen(2, 3);
let r1 = g.next();
let r2 = g.next(r1.value);
let r3 = g.next(r2.value);
let r4 = g.next(r3.value);
// console.log(r1, r2, r3, r4);
