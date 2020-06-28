// const Promise = require("./polyfill");

var p = function(num){
    return new Promise((resolve, reject) => {
        reject(num);
    });
}
p(4).then(n => {
    
}, e => {
    return e;
}).then(d => {
    console.log('d === ', d);
}, err => {
    console.log('err === ', err);
});