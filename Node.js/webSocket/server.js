const Koa = require('koa');
const fs = require('fs');
const Router = require('koa-router');
const path = require('path');

const app = new Koa();
const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);
const router = new Router();

io.on("connection",function(socket){
    socket.on("first",function(data){
        var nickName = JSON.parse(data).nickName;
        socket.name = nickName;
        io.sockets.emit("joined", nickName);
    });
    socket.on("message",function(data){
        io.sockets.emit("getMessage", data);
    });
    socket.on("disconnect",() => {
        io.sockets.emit('disconnect',socket.name);
    })
});

router.get('/',async (ctx,next) => {
    ctx.response.type = "text/html";
    ctx.response.body = fs.readFileSync('./index.html',{encoding: 'utf8'});
}).get('/index.min.css',async (ctx,next) => {
    ctx.response.type = "text/css";
    ctx.response.body = fs.readFileSync('./index.min.css',{encoding: 'utf8'});
})

app.use(router.routes())
    .use(router.allowedMethods())

server.listen(8888,() => {
    console.log("Server is running: http://localhost:8888");
});
