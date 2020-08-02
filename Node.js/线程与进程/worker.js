// process.on('message',function(m, server){
//     if(m === 'server'){
//         server.on('connection', function(socket){
//             socket.end('handled by child\n');
//         });
//     }
// });


var http = require('http');

var server = http.createServer(function(req, res){
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('handled by child, pid is ' + process.pid + '\n');
});

var worker;
process.on('message', function(m, tcp){
    if(m === 'server'){
        worker = tcp;
        worker.on('connection', function(socket){
            socket.emit('connection', socket);
        });
    }
});

process.on('uncaughtException', function(){
    // 停止接收新的连接
    worker.close(function(){
        process.send({ act: 'suicide' });
        // 所有已有连接断开后，退出进程
        process.exit(1);    
    });
});