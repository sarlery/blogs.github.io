const events = require('events');
const net = require('net');
const colors = require('colors');

const channel = new events.EventEmitter();
channel.clients = {};
channel.subscriptions = {};

channel.on('join',function(id,client){
    this.clients[id] = client;
    this.subscriptions[id] = (senderId, message) => {
        if(id != senderId){
            // 不是本人 id 广播
            this.clients[id].write(message,'utf8');
        }
    }
    this.on('broadcast',this.subscriptions[id]);
});

channel.on('leave',function(id){
    channel.removeListener('broadcast',this.subscriptions[id]);
    channel.emit('broadcast',id,`${id} has left the chatroom.\n`);
});

channel.on('shutdown',function(){
    channel.emit('broadcast','','The server has shut down.\n');
    channel.removeAllListeners('broadcast');
});

// 开启服务
const server = net.createServer(client => {
    // client.remoteAddress 用字符串表示的远程 IP 地址；
    // client.remotePort 用数字表示的远程端口；
    const id = `${client.remoteAddress}: ${client.remotePort}`;
    // 将 id 和 socket 对象传给 join 事件回调函数
    channel.emit('join',id,client);

    var reg = /\n$/g;

    // 监听发送过来的数据
    client.on('data',data => {
        data = data.toString('utf8');
        if(data === 'shutdown\n'){
            // 如果是这个则房间消失
            channel.emit('shutdown');
        }

        if(reg.test(data)){
            // 将 id 和 数据广播出去
            channel.emit('broadcast', id, data);
        }
    });

    // 关闭时触发 leave 事件回调函数，将 id 传入
    client.on('close',() => {
        channel.emit('leave',id);
    });
});

server.listen(8888,() => {
    console.log('server is running: 127.0.0.1:8888');
});
