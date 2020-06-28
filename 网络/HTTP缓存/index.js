const http = require('http');
const fs = require('fs');


const html = fs.readFileSync('./index.html', { encoding: 'utf8' });
const server = http.createServer((req, res) => {
    let url = req.url;
    let method = req.method.toLocaleLowerCase();
    if(method === "get"){
        if(url === "/" || url === "/index.html"){
            res.setHeader("content-type", "text/html");
            res.end(html);
        }else if(url === "/vary"){
            res.setHeader('Vary', "Accept-Language");
            res.setHeader('Content-Type', 'text/html');
            res.setHeader('Content-Language', 'en-US,en');
            // res.setHeader('Cache-Control', 'max-age=20');
            res.end('<h2>hello~~</h2>');
        }
    }
});

server.listen(4000, () => {
    console.log('Server is running: http://localhost:4000');
});