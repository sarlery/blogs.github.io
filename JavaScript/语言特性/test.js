const Promise = require("./promise");

function test(param){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(param);
        },1000);
    });
}

var t = test(100);

t.then(n => console.log("n == ",n), e => console.log("e == ",e));