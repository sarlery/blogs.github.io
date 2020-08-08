// const Promise = require('./polyfill');

function loop(){
    Promise.resolve().then(loop);
}
loop();

// var p = function(num){
//     return new Promise((resolve, reject) => {
//         resolve(num);
//     });
// }
// p(4).then(n => {
//     // then 内部又返回了 promise
//     return new Promise((resolve, reject) => {
//         resolve(n + 1);     // 调用成功的函数
//         // 如果这里调用的 reject 函数，失败的状态会传递到下面 then 方法的失败回调中
//     })
// }).then((data) => {
//     // 在这个 then 中可以接收到 resolve(n + 1) 的数据
//     console.log('data === ', data);
// },err => console.log('err: ', err));

