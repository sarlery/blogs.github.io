const http = require('http');
const fs = require('fs');


const server = http.createServer((req, res) => {
    const home = fs.readFileSync("./test.html", { encoding: 'utf8' });
    let url = req.url;
    let method = req.method.toLocaleLowerCase();

    if(method === 'get'){
        if(url === '/' || url === "/test.html"){
            res.setHeader('content-type', 'text/html');
            res.write(home);
            res.end();
        }
    }
    
})
server.listen(7000, () => {
    console.log('Server is running: http://localhost:7000');
});