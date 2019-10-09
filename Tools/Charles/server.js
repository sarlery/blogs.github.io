const request = require('request');
const fs = require('fs');
const url = "https://is-hl.snssdk.com/api/news/feed/v88/?st_time=237";

request(url,(err,res,body) => {
    if(!err && res.statusCode === 200){
        fs.writeFileSync('./news.json',body,{encoding: "utf8"});
    }
});
