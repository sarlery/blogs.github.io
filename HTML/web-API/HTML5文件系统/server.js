const fs = require("fs");
const http = require("http");

http.createServer((req,res) => {
    if(req.url === "/file.php"){
        let data = [];

        req.on('data',(chunk) => {
            data.push(chunk);
        });
        req.on('end',function(){
            var object = Buffer.concat(data).toString();
            fs.writeFileSync("./01.txt",object);
            // fs.writeFileSync(`./${object.name}`,object.file,{encoding: 'binary'});
            res.setHeader("Content-Type","text/plain");
            res.end('{"status": "seccess"}');
        });
    }
    if(req.url === "/"){
        res.writeHead(200,{
            "Content-Type": "text/html"
        });
        res.end(fs.readFileSync("./01.html",{encoding: "utf8"}));
    }

    if(req.url === "/01.js"){
        res.writeHead(200,{
            "Content-Type": "text/javascript",
        });
        res.end(fs.readFileSync('./01.js',{encoding: 'utf8'}));
    }
}).listen(4000,() => {
    console.log("server is running: http://localhost:4000");
});
