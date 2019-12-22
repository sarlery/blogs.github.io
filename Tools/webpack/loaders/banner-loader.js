const fs = require("fs");
const loaderUtils = require("loader-utils");
// schema-utils 是一个校验模块
const schemaUtils = require("schema-utils");

function loader(source){
    // 指定为 false 后，webpack 每次打包都不进行缓存
    // webpack 默认有缓存（有缓存是有好处的，可以节约时间）
    this.cacheable(false);
    var options = loaderUtils.getOptions(this);
    var cb = this.async();
    // 创建一个验证骨架
    var schema = {
        // 属性中的参数
        properties: {
            text: {
                type: "string",
            },
            filename: {
                type: 'string',
            }
        }
    }

    // 第三个参数表示不符合条件时报出的错误信息
    schemaUtils(schema, options, "banner-loader");

    if(options.filename){
        // 这个方法原理是这样的：
        // webpack 中可以指定 witch 配置为 true
        // 表示当需要打包的文件更改时，webpack会自动打包
        // 而 options.filename 中的文件更改后webpack并不会进行打包
        // 因此需要让 webpack 明白，该文件在修改后也会触发 witch 监听并自动打包
        this.addDependency(options.filename);
        // 读取文件
        fs.readFile(options.filename,"utf8",function(err,data){
            cb(err,`/** ${data} **/\r\n${source}`);
        });
    }else{
        // 指定的是text参数
        cb(null,`/** ${options.text} **/\r\n${source}`);
    }

    return source;
}

module.exports = loader;