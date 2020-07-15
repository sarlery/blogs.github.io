const fs = require('fs');

const rs = fs.createReadStream('./index.html');

rs.on('data',(chunk) => {
    console.log(chunk);
});

rs.on('close',() => {
    console.log('读取完毕！');
});