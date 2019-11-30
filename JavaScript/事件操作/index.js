const { readFile } = require("fs");
const EventEmitter = require("events");

class EE extends EventEmitter{};

const yy = new EE();

yy.on('event',() => {
    console.log("yy-event");
});

setTimeout(() => {
    console.log('0 毫秒 setTimeout 执行');
},0);

setTimeout(() => {
    console.log('100 毫秒 setTimeout 执行');
},100);

setTimeout(() => {
    console.log('200 毫秒 setTimeout 执行');
},200);

readFile('./index.html','utf-8',data => {
    console.log("文件 1 读取完成！");
});

readFile('./任务队列.md','utf-8',data => {
    console.log("文件 2 读取完成！");
});

setImmediate(() => {
    console.log("immediate 回调执行");
});

process.nextTick(() => {
    console.log("process.nextTick 回调执行！");
});

Promise.resolve().then(() => {
    yy.emit("event");

    process.nextTick(() => {
        console.log("process.nextTick 第二次执行");
    });

    console.log("Promise 的第一次回调执行");
}).then(() => {
    console.log("Promise 的第二次执行");
});