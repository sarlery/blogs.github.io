const http = require('http');
const fs = require('fs');

const comments = [];

const server = http.createServer((req, res) => {
    const indexHtml = fs.readFileSync('./index.html', { encoding: 'utf8' });
    let url = req.url;
    let method = req.method.toLocaleLowerCase();
    let cookie = req.headers.cookie;
    if(!cookie){
        res.setHeader('set-cookie', `id=${Math.round(Math.random() * 11)}; httponly; session; SameSite=Lax`);
    }
    if(method === "get"){
        if(url === "/" || url === "/index.html"){
            res.setHeader('content-type', 'text/html');
            res.end(indexHtml);
        }
        if(url === "/getComments"){
            res.setHeader('cotent-type', 'application/json');
            res.end(JSON.stringify({
                data: comments
            }));
        }
    }else if(method === "post"){
        if(url === "/comments"){
            let data = "";
            req.on('data', (chunk) => {
                data += chunk;
            });
            req.on('end',() => {
                const message = data.split("=");
                console.log("message === ", decodeURIComponent(message), "cookie === ", req.headers.cookie);
                if(message[1])
                    comments.push(decodeURIComponent(message[1]));
                res.writeHead(301,{     // 重定向到首页
                    'Location': '/',
                    'Content-Type': 'application/json'
                }).end(JSON.stringify({
                    msg: message[1],
                    code: 1
                }));
            });
        }
    }
});


server.listen(6001, () => {
    console.log("Server is running: http://localhost:6001");
});