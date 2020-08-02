const cp = require('child_process');
const cpus = require('os').cpus();

var server = require('net').createServer();

server.listen(1337);

var workers = {};
var createWorker = function(){
    var worker = cp.fork('./worker.js');

    // 退出时重新启动新的进程
    worker.on('exit', function(){
        console.log(`Worker ${worker.pid} exited`);
        delete workers[worker.pid];
        createWorker();
    });
    worker.on('message', (msg) => {
        if(msg.act === 'suicide'){
            createWorker();
        }
    });
    // 句柄发送
    worker.send('server', server);
    workers[worker.pid] = worker;
    console.log('Create worker. pid: ', worker.pid);
};

for(let i = 0;i < cpus.length;i ++){
    createWorker();
}

// 进程自己退出时，让所有的子进程退出
process.on('exit', function(){
    for(var pid in workers){
        workers[pid].kill();
    }
});