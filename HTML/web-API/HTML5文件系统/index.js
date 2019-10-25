const http = require("http");
const fs = require("fs");

const multiparty = require("multiparty");

http.createServer((req,res) => {
    if(req.url === "/"){
        res.setHeader("Content-Type","text/html");
        res.write(fs.readFileSync("./index.html", {
            encoding: 'utf8'
        }));
        res.end();
    }
    if(req.url === "/form.php"){

        const form = new multiparty.Form({
            uploadDir: './upload' // 指定文件存储目录
        });

        form.parse(req,(err,fields,files) => {
            if(err)
                console.log(err);
            else {
                for(let p in files){
                    var originalName = files[p][0].originalFilename,
                        pathName = files[p][0].path;
                    fs.rename(`./upload/${pathName}`, `./upload/${originalName}`, err => console.log(err));
                }
            }
        });

        form.on('close', () => { // 表单数据解析完成，触发close事件
            res.setHeader("Content-Type","application/json");
            res.write(JSON.stringify({status: 'success'}));
            res.end();
        });







        // let data = [];
        // req.on("data",(chunk) => {
        //     data.push(chunk);
        // });
        // req.on("end",() => {
        //     let d = Buffer.concat(data).toString();
        //     fs.writeFileSync("./form.txt",d,{encoding: 'utf8'});
        //     res.setHeader("Content-Type","application/json");
        //     res.end(JSON.stringify({'status': 'success'}));
        // });
    }
}).listen(8000,() => {
    console.log("Server is running: http://localhost:8000");
});
