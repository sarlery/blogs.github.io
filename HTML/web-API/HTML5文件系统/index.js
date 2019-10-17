const http = require("http");
const fs = require("fs");

http.createServer((req,res) => {
    if(req.url === "/"){
        res.setHeader("Content-Type","text/html");
        res.write(fs.readFileSync("./index.html", {
            encoding: 'utf8'
        }));
        res.end();
    }
    if(req.url === "/form.php"){
        let data = [];
        req.on("data",(chunk) => {
            data.push(chunk);
        });
        req.on("end",() => {
            let d = Buffer.concat(data).toString();
            fs.writeFileSync("./form.txt",d,{encoding: 'utf8'});
            res.setHeader("Content-Type","application/json");
            res.end(JSON.stringify({'status': 'success'}));
        });
    }
}).listen(8000,() => {
    console.log("Server is running: http://localhost:8000");
});
