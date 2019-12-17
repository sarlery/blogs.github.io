# 从零搭建一个 webpack 脚手架工具

webpack 是一个现代 JavaScript 应用程序的静态模块打包器，已经成为前端开发不可获取的工具。特别是在开发大型项目时，项目太大，文件过多导致难以维护，或者是优化网络请求时，webpack 都是不可获取的利器。

从最基础的开始，使用的 webpack 版本是`^4.39.2`，搭建时会用到一下内容：  
1. 从单页面到多页面
2. 代码切片
3. 热更新
4. 热替换
5. CSS 分离
6. HTML 模板
7. babel 的使用
8. 支持 img、sass、jsx、css、typescript 等工具
9. webpack 一些插件的使用
10. postcss 的简单配置
11. 不同开发环境的配置
12. 配置 react 开发环境  

- [从零搭建一个 webpack 脚手架工具](#%e4%bb%8e%e9%9b%b6%e6%90%ad%e5%bb%ba%e4%b8%80%e4%b8%aa-webpack-%e8%84%9a%e6%89%8b%e6%9e%b6%e5%b7%a5%e5%85%b7)
  - [安装 webpack，设置程序打包命令](#%e5%ae%89%e8%a3%85-webpack%e8%ae%be%e7%bd%ae%e7%a8%8b%e5%ba%8f%e6%89%93%e5%8c%85%e5%91%bd%e4%bb%a4)
  - [entry 入口配置（必须的）](#entry-%e5%85%a5%e5%8f%a3%e9%85%8d%e7%bd%ae%e5%bf%85%e9%a1%bb%e7%9a%84)
  - [output 配置](#output-%e9%85%8d%e7%bd%ae)
    - [单页面](#%e5%8d%95%e9%a1%b5%e9%9d%a2)
    - [多页面](#%e5%a4%9a%e9%a1%b5%e9%9d%a2)
    - [publicPath](#publicpath)
  - [html-webpack-plugin 插件](#html-webpack-plugin-%e6%8f%92%e4%bb%b6)
    - [多个 HTML 页面的配置](#%e5%a4%9a%e4%b8%aa-html-%e9%a1%b5%e9%9d%a2%e7%9a%84%e9%85%8d%e7%bd%ae)
  - [mode 环境变量](#mode-%e7%8e%af%e5%a2%83%e5%8f%98%e9%87%8f)
  - [module 配置](#module-%e9%85%8d%e7%bd%ae)
    - [`style-loader` 和 `css-loader`](#style-loader-%e5%92%8c-css-loader)
    - [loader options](#loader-options)
    - [`sass-loader` 和 `less-loader`](#sass-loader-%e5%92%8c-less-loader)
    - [`html-loader`](#html-loader)
    - [`file-loader` 和 `url-loader`](#file-loader-%e5%92%8c-url-loader)
      - [file-loader 中的 options](#file-loader-%e4%b8%ad%e7%9a%84-options)
      - [`url-loader`](#url-loader)
      - [html-withimg-loader](#html-withimg-loader)
    - [`ts-loader`](#ts-loader)
    - [`babel-loader`](#babel-loader)
    - [eslint](#eslint)
    - [处理 react jsx 语法：`@babel/preset-react`](#%e5%a4%84%e7%90%86-react-jsx-%e8%af%ad%e6%b3%95babelpreset-react)
      - [处理 `.jsx` 的文件](#%e5%a4%84%e7%90%86-jsx-%e7%9a%84%e6%96%87%e4%bb%b6)
    - [`postcss-loader`](#postcss-loader)
      - [配置 PostCSS](#%e9%85%8d%e7%bd%ae-postcss)
      - [自动添加后缀 —— `autoprefixer`](#%e8%87%aa%e5%8a%a8%e6%b7%bb%e5%8a%a0%e5%90%8e%e7%bc%80--autoprefixer)
      - [`postcss-preset-env` 插件](#postcss-preset-env-%e6%8f%92%e4%bb%b6)
    - [暴露全局变量](#%e6%9a%b4%e9%9c%b2%e5%85%a8%e5%b1%80%e5%8f%98%e9%87%8f)
  - [resolve 配置项](#resolve-%e9%85%8d%e7%bd%ae%e9%a1%b9)
    - [1. `resolve.alias`](#1-resolvealias)
    - [`resolve.extensions`](#resolveextensions)
  - [devServer 配置项](#devserver-%e9%85%8d%e7%bd%ae%e9%a1%b9)
    - [配置 devServer](#%e9%85%8d%e7%bd%ae-devserver)
    - [配置命令](#%e9%85%8d%e7%bd%ae%e5%91%bd%e4%bb%a4)
    - [historyApiFallback 更具体的配置](#historyapifallback-%e6%9b%b4%e5%85%b7%e4%bd%93%e7%9a%84%e9%85%8d%e7%bd%ae)
    - [devServer 中 publicPath 的配置](#devserver-%e4%b8%ad-publicpath-%e7%9a%84%e9%85%8d%e7%bd%ae)
    - [开启模块热替换功能](#%e5%bc%80%e5%90%af%e6%a8%a1%e5%9d%97%e7%83%ad%e6%9b%bf%e6%8d%a2%e5%8a%9f%e8%83%bd)
      - [React 中使用热模块更替](#react-%e4%b8%ad%e4%bd%bf%e7%94%a8%e7%83%ad%e6%a8%a1%e5%9d%97%e6%9b%b4%e6%9b%bf)
  - [使用 watch 简化操作](#%e4%bd%bf%e7%94%a8-watch-%e7%ae%80%e5%8c%96%e6%93%8d%e4%bd%9c)
  - [webpack优化](#webpack%e4%bc%98%e5%8c%96)
    - [分离样式文件](#%e5%88%86%e7%a6%bb%e6%a0%b7%e5%bc%8f%e6%96%87%e4%bb%b6)
    - [代码分片](#%e4%bb%a3%e7%a0%81%e5%88%86%e7%89%87)
    - [`webpack-merge`](#webpack-merge)
  - [生产环境配置](#%e7%94%9f%e4%ba%a7%e7%8e%af%e5%a2%83%e9%85%8d%e7%bd%ae)
    - [压缩代码](#%e5%8e%8b%e7%bc%a9%e4%bb%a3%e7%a0%81)
      - [压缩 CSS](#%e5%8e%8b%e7%bc%a9-css)
  - [webpack 小插件](#webpack-%e5%b0%8f%e6%8f%92%e4%bb%b6)
    - [1. cleanWebpackPlugin](#1-cleanwebpackplugin)
    - [2. copyWebpackPlugin](#2-copywebpackplugin)
    - [3. webpack.DefinePlugin](#3-webpackdefineplugin)
    - [4. BannerPlugin](#4-bannerplugin)
  - [create-react-app 中配置多页应用](#create-react-app-%e4%b8%ad%e9%85%8d%e7%bd%ae%e5%a4%9a%e9%a1%b5%e5%ba%94%e7%94%a8)




首先，配置 webpack，大致的骨架是这样的，这是最基本的配置内容：
```js
{
    entry: "",      // 入口配置
    mode: 'development',    // 环境配置
    output: {},         // 打包输出配置
    module: {},        // loader 配置项
    plugins: [],        // 插件配置项
    devServer: {},      // 服务器配置
}
```
那么就开始一一进行配置。  

## 安装 webpack，设置程序打包命令
首先是安装： `yarn add webpack --dev` 或者 `npm install webpack --save-dev` 或者 `yarn add webpack -D` `npm i webpack -D` 
在开发环境安装。  
安装完时候，来到 package.json 文件，在 `scripts` 项中写入一下命令：
```shell
"build": "webpack"
```
当运行命令 `npm run build` 后，webpack 默认会在项目根目录下查找一个叫 `webpack.config.js` 的文件，然后进行打包。当文件名不想叫这个或者不想在根目录下创建这个文件时，可以在后面的 `--config` 字段之后写上文件的所在路径。例如：
```shell
"build" "webpack --config config/webpack.config.dev.js"
```
这样，当运行时，webpack 就从 `项目根路径/config/webpack.config.dev.js` 这个路径查找配置文件。  

> 在运行命令时，可能会提醒安装 `webpack-cli` 输入 `yes` 即可。  

## entry 入口配置（必须的）
entry 大致有四种写法，分别是字符串的形式、数组形式、函数形式和对象形式。代表的含义分别是：  

|形式|含义|举例|
|:---|:---|:-----|
字符串的形式|这种表示单个入口|例如：`entry: "path(__dirname,"../src/index.js")"`|
数组形式|这种也是表示单个入口|例如：`entry: "["./01.js","./index.js"]"`|
函数形式|可以是单入口也可以是多入口|该函数应该返回一个字符路径、数组或对象作为打包入口|
对象形式|这种表示多个入口|例如：`entry: {app: './src/app.js',vendors: './src/vendors.js'}`|   

> #### 注意!：第一种和第二中都表示单入口，但含义不同。使用数组的作用是将多个资源预先 **合并**，在打包的时候， webpack 会将数组的最后一项作为实际的入口路径。  
```js
modules.exports = {
    entry: ["babel-polyfill","./src/index.js"]
}
```
就相当于：
```js
// webpack.config.js
modules.exports = {
    entry: "./src/index.js"
}

// 在打包后的文件中，会包含数组中所有的路径对应的文件
import "babel-polyfill";    // 以及 ./src/index.js 文件
```

## output 配置
output 配置项很多，有两个是必须的：  
+ `path` 指定文件输出时的文件夹（不存在时会自动创建）；
+ `filename` 指定文件输出时文件的名字；  
### 单页面
```js
{
    entry: path.join(__dirname,"../src/index.js"),      // 入口配置
    output: {
        path: path.join(__dirname,"../build"),
        filename: "index.js"
    },         // 打包输出配置
}
```
运行后，就会在 build 文件夹下创建一个 index.js 的打包文件。
### 多页面
```js
{
    entry: {
        index: path.join(__dirname,"../src/index.js"),
        demo: path.join(__dirname,'../src/demo.js')
    },      // 入口配置
    output: {
        path: path.join(__dirname,"../build"),
        filename: "[name].js"
    },         // 打包输出配置
}
```
运行后，在 build 文件夹下就会多出两个文件。注意 output 中 filename 的文件名 —— `[name]` 这个 name 对应的就是 `entry` 对象的键。当然，也可以为 filename 指定别的字段，但也是要用 `[]` 包裹。可以指定的字段有：  
+ `[name]` 当前 chunk 的名字
+ `[hash]`  此次打包所有资源生成的 hash
+ `[id]`    指代当前 chunk 的 id
+ `[chunkhash]` 指代当前 chunk 内容的 hash
+ `[query]` 模块的 query，例如，文件名 ? 后面的字符串  

> 表中 `hash` 和 `chunkhash` 的作用：当下一次请求时，请求到的资源会被立刻下载新的版本，而不会用本地缓存。`query` 也有类似的效果，只是需要人为指定。  

### publicPath
`publicPath` 是 output 中的一个配置项，不是必须的。但是它是一个非常重要的配置项。  
与 `path` 属性不同，`publicPath` 用来指定资源的请求位置，而 `path` 是用来指定资源的输出位置（打包后文件的所在路径）。在 HTML 页面中，我们可能会通过 `<script>` 标签来加载 JS 代码，标签中的 `src` 路径就是一个请求路径（不光是 HTML 中的JS文件，也可能是CSS中的图片、字体等资源、HTML中的图片、CSS文件等）。publicPath 的作用就是指定这部分间接资源的请求位置。  
`publicPath` 有三种形式，分别是：  
1. 与 HTML 相关，在请求这些资源时会以当前页面 HTML 所在路径加上相对路径，构成实际请求的 URL。
2. Host 相关，若 publicPath 的值以 ‘/’开始，则代表此时 `publicPath` 是以当前页面的 hostname 为基础路径的。
3. CDN 相关，上面两种都是相对路径，而这个是 绝对路径。如：publicPath 为："https://www.example.com/"，代表当前路径是 CDN 相关。  
举个例子，当使用第一种形式时，当我们使用 `html-webpack-plugin` 插件动态生成一个 HTML，并打包到 build 文件夹后，JS 文件（指定的 entry）会自动插入到 HTML 中。当我们指定 `publicPath: '/'`，后就会变成：  

![](./img/publicPath-output.png)  
当没有指定 publicPath 时，默认是 `""`，即：  

![](./img/no-publicPath.png)  

而如果是 "/static" 是，HTML 引入的资源路径前都将有一个 "/static"。这个路径是相对于项目根路径的。

## html-webpack-plugin 插件
这是一个很实用的插件，在上面的例子中，都没有提到 html，而这个插件可以动态生成 html。下载: `npm install html-webpack-plugin -D` 或者 `yarn add npm install html-webpack-plugin -D`。
配置：
```js
const HtmlWebpackPlugin  = require('html-webpack-plugin');

{
    plugins: [
        new HtmlWebpackPlugin({
            // 以下都是可选的配置项：
            title: "hello world!",   // html 的 title 标签内容
            // html 模板路径
            template: path.join(__dirname,'../public/index.html'),
            // title favicon 路径
            favicon: path.join(__dirname,'../public/favicon.ico'),
            // 指定引入的 js 代码 插入到哪里（默认是body最底部，即：true）
            // 也可以指定字符串："body" 或 "head"
            inject: false,
            // 指定 打包输出后，文件的名字（不指定的话还是原来的名字）
            filename: "hello.html",
            // 还有许多配置，这是常用的几个

            // 压缩 HTML 代码
            minify: {
                // 删除标签属性值的双引号或单引号
                removeAttributeQuotes: true,
                // 将代码压缩成一行
                collapseWhitespace: true,
            },
            // 将引入的 js 文件添加上 hash 值（防止缓存）
            hash: true
        })
    ]
}
```
### 多个 HTML 页面的配置
有时候，想要配置多页面应用，这时就要多实例化几个这个插件。这时就可能会用到别的一个配置属性 —— `chunks`
```js
{
    entry: {
        index: path.join(__dirname,"../src/index.js"),
        demo: path.join(__dirname,'../src/demo.js')
    },      // 入口配置
    output: {
        path: path.join(__dirname,"../build"),
        filename: "[name].js"
    },         // 打包输出配置

    plugins: [
        new HtmlWebpackPlugin({
            chunks: ['index'],      // 指定 chunk 的名字（一般就是 entry 对象的键）
            // html 模板路径
            template: path.join(__dirname,'../public/index.html'),
            favicon: path.join(__dirname,'../public/favicon.ico'),
            inject: "body",
            filename: "index.html",
        }),

        new HtmlWebpackPlugin({
            chunks: ['demo'],
            // html 模板路径
            template: path.join(__dirname, '../public/demo.html'),
            favicon: path.join(__dirname, '../public/favicon.ico'),
            inject: "body",
            filename: "demo.html",
        }),
    ],        // 插件配置项
}
```

## mode 环境变量
mode 的选项一般是这两者其一：`development` 或 `production`，即：开发模式或生产模式。生产模式的代码一般是压缩过的。  
单纯的指定 mode 值，可能不能满足我们的需要，这时可以使用另一种办法来设置 mode 值。就是在 package.json 文件的 'scripts' 命令中传入参数。  
```js
// ....
"scripts": {
    "build": "cross-env NODE_ENV='development' webpack --config config/webpack.config.dev.js"
}
// ....
```
可以注意到，在之前的命令中，我们在前面又添加了一部分内容：`cross-env NODE_ENV='development` 这是给 Node.js 的全局变量 `process` 的 env 属性传入了一个值，前面 `cross-env` 是一个 npm 包，主要为了解决在 Windows 系统下不支持传值命令。  
这样，在 webpack 配置文件中，就可以接收到这个值：
```js
var mode = process.env.NODE_ENV;    // development
```
这样就可以根据传入的值，来对配置文件作进一步的改进：
```js
const mode = process.env.NODE_ENV;
const isDev = mode === 'development';

const config = {
    // 公共配置项，比如 loader、mode、entry 和 output 中相同的配置项
    mode: mode,
    entry: "xxx",
    // 等等
}

if(isDve){
    // 是开发模式时的配置，比如：
    config.devServer = {
        // 对 webpack-dev-server 的配置
    }
}else{
    // 是生产模式时的配置
}

// 最后导出：
module.exports = config;
```

## module 配置
这一部分比较多，主要是配置各种loader，比如 `css-loader`,`babel-loader`,`sass-loader`等等。而这些配置存在于 module.rules 这个配置项中。
所有的 loader 都是需要安装的。 通过 `npm install xxx-loader` 或 `yarn add xxx-loader` 的形式进行安装。
### `style-loader` 和 `css-loader` 
两者有很大不同，`css-loader` 的作用仅仅是处理 CSS 的各种加载语法，例如 `@import` 和 `url()` 等。而 `style-loader` 才是真正让样式起作用的 loader（会将 CSS 引入到 head 标签里的 style 标签中）。因此这两个一般配合使用：
```js
{
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader','css-loader']
            }
        ]
    }
}
```
还需要注意的是：**webpack打包时是按数组从后往前的顺序将资源交给loader处理的**，因此要把最后生效的放在前面。  

### loader options
有时候使用一个 loader 时，可能要对它进行一些配置，例如 `babel-loader` babel 的一些配置就可以写在 options 里，当然也可以建一个 `.babelrc` 文件进行配置。当一个 loader 需要配置时，它就不能在 use 属性里是个单纯的字符串了，而是一个对象。
```js
{
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [{
                    loader: 'style-loader',
                    options: {
                        // 将样式放到顶部
                        // 当 HTML 模板中也有 CSS 样式（通过 style 标签写的），你又不想被覆盖掉，可以将 引入的 CSS 放到最顶部防止原来的样式被覆盖。
                        insertAt: 'top',
                    }
                },{
                    // 对 css-loader 配置时，是个对象
                    loader: 'css-loader',
                    options: {
                        // css-loader 的配置项
                    }
                }]
            }
        ]
    }
}
```
> 需要注意的是，css 中还不能书写背景图片路径（例如：`background: url()`）。不然会报错。因为加载的不是样式，而是图片，在 webpack 中，想要加载图片，还需要使用 `file-loader`，之后会介绍。

### `sass-loader` 和 `less-loader`
`sass` 和 `less` 是 CSS 的预处理器，需要安装。而且最终会编译成 CSS，因此我们还需要 `style-loader` 和 `css-loader`。而且还要安装编译 Sass 的包：`node-sass`（不然会报错）。
```js
module: {
    rules: [
        {
            test: /\.(sass|scss)$/,
            use: ["style-loader", "css-loader","sass-loader"]
        },
        {
            test: /\.less$/,
            use: ["style-loader", "css-loader", "less-loader"]
        }
    ]
}
```

### `html-loader`
有了这个 loader，我们可以将一个 html 文件通过 JS 加载进来。比如这样：
```js
rules: [
    {
        test: /\.html$/,
        use: 'html-loader'
    }
]

// loader.html
<h1>Hello World!</h1>

// index.js
import html from './loader.html';
document.write(html);
```


### `file-loader` 和 `url-loader`
`file-loader` 用于打包文件类型的资源。比如 CSS 的背景图片和字体、HTML 的 img 标签中的 src 路径等。
```js
rules: [
    {
        test: /\.(png|jpg|gif)$/,
        use: "file-loader",
    }
]
```
这样就可以对 png、jpg、gif类型的图片文件进行打包，而且可以在 JS 中加载图片。  
#### file-loader 中的 options
主要有两个配置项：  
1. `name`，指定打包后文件的名字，默认是 hash 值加上文件后缀。也可以制定成：`[name].[ext]` 表示原来的名字和文件后缀。
2. `publicPath` 这里的 publicPath 与 output 中的 publicPath 一样，在这里指定后，会覆盖原有的 output.publicPath。  比如：
```js
rules: [
    {
        test: /\.(png|jpg|gif)/,
        use: {
            loader: "file-loader",
            options: {
                name: '[name].[ext]',
                publicPath: "",
            }
        }
    }
]
```
#### `url-loader`
与 `file-loader` 作用类似，唯一的不同是：`url-loader` 可以设置一个文件大小的阈（yù）值。当大于该阈值时与 file-loader 一样返回 publicPath，而小于阈值时则返回文件的 `base64` 形式编码。比如：
```js
{
    test: /\.(png|jpg|gif)$/,
    use: {
        loader: "url-loader",
        options: {
            // 当文件小于这个值时，使用 base64 编码形式
            // 大于该值时，使用 publicPath 
            // 这个属性在 file-loader 中是没有的。
            limit: 10240,
            name: '[name].[ext]',
            // 将所有的图片打包到 img 目录下
            outputPath: 'img/',
        }
    }
}
```

#### html-withimg-loader
当我们在 HTML 模板中有 img 标签是，img 标签的 src 的路径并不会被 webpack 转化，因此需要使用 `html-withimg-loader`，使用之前同样需要先下载。然后配置：  
```js
{
    rules: [
        test: /\.html/,
        use: 'html-withimg-loader'
    ]
}
```

### `ts-loader`
使用 `ts-loader` 可以让我们使用 typescript 来编写 js 代码。安装该 loader 后，还要安装 typescript。
```shell
yarn add ts-loader typescript
```
```js
rules: [
    {
        test: /\.ts$/,
        use: "ts-loader",
    }
]
```

### `babel-loader`
babel-loader 很重要，使用 babel-loader可以让我们写的 JS 代码更加兼容浏览器环境。配置 babel-loader 时需要下载好几个其他的包。`yarn add babel-loader @babel/core @babel/preset-env -D` 。这三个是最核心的模块。主要作用如下：  
+ `babel-loader` 它是 babel 与webpack协同工作的模块；
+ `@babel/core` babel 编译器的核心模块；
+ `@babel/preset-env` 它是官方推荐的预置器，可根据用户设置的目标环境自动添加所需的插件和补丁来编译 ES6+ 代码。  
具体配置如下：
```js 
rules: [
    {
        test: /\.js$/,
        // 不要编译 node_modules 下面的代码
        exclude: path.join(__dirname,'../node_modules'),
        use: {
            loader: "babel-loader",
            options: {
                // 当为 true 时，会启动缓存机制，
                // 在重复打包未改变过的模块时防止二次编译
                // 这样做可以加快打包速度
                "cacheDirectory": true,
            }
        }
    }
]
```
对于 options 其它部分，可以在项目根目录下新建一个 `.babelrc` 文件。.babelrc 文件相当于一个 json 文件。它的配置项大概是这样的：
```json
{
    "presets": [],
    "plugins": [],
}
```
比如要配置的一个内容：
```js
{   
    "presets": [
        ["@babel/env",      // 每一个 preset 就是数组的每一项
            // 当有的 preset 需要配置时，这一项将也是一个数组
            // 数组的第一项是 preset 名称，第二项是该 preset 的配置内容，是一个对象
            {   // @babel/preset-env 会将 ES6 module 转成 CommonJS 的形式
                // 将 mudules 设置成 false，可以禁止模块语句的转化
                // 而将 ES6 module 的语法交给 webpack 本身处理
                "mudules": false,
                // targets 可以指定兼容的各个环境的最低版本
                "targets": {
                    "edge": "17",
                    "firefox": "60",
                    "chrome": "67",
                    "safari": "11.1"
                }
            }
        ]
    ],
    "plugins": [
        // 语法转换（ES6转ES5）将常用到这个包
        // 在开发环境下载
        // 下载这个插件后还需要下载另一个包：@babel/runtime
        // @babel/runtime 需要下载到生产环境中（--save）。不需要配置
        "@babel/plugin-transform-runtime",
    ]
}
```
> env 的 targets 属性，可以配置的环境名称有：`chrome`，`opera`，`edge`，`firefox`，`safari`，`ie`，`ios`，`android`，`node`，`electron`。当然 targets 的值也可以是一个字符串，例如：`"targets": "> 0.25%, not dead"` 表示仅包含浏览器具有> 0.25％市场份额的用户所需的polyfill和代码转换。  

上面配置了 `@babel/plugin-transform-runtime` 插件，解决了语法问题（比如 Promise、async/await、迭代器），而 ES6 以及往上的 API 浏览器也不一定支持，比如字符串的 includes 方法，这时就需要另一个 babel 包：`@babel/polyfill`，下载：`yarn add @babel/polyfill`。这个包不需要配置到 babel 中，要使用这个包，就在文件中引入：`require('@babel/polyfill');`。  

### eslint
eslint 是 JS 语法的校验器，它提供了一个 loader：`eslint-loader`。使用之前需要先下载：`yarn add eslint eslint-loader`，配置如下：  
```js
{
    rules: [
        {
            test: /\.js$/,
            use: {
                laoder: 'eslint-loader',
            }
        }
    ]
}
```
设置好 loader 后，还要在项目根目录下建一个 `.eslintrc.json` 文件再进行其他配置。  

当然，也可以来到这个网址 [https://eslint.org/demo/](https://eslint.org/demo/)，下载默认的配置文件。下载好后把文件修改成 `.eslintrc.json` 名称（名称前有一个点），然后把该文件剪切到项目根目录下。  

需要注意的是，loader 的执行顺序是从右到左（对于一个规则，多个loader的情况，配置 .css laoder时，use 项中有多个 loader），从下到上（对于一个多个规则，比如同是处理 .js 文件的配置，写了好几个规则（test）），因此，eslint-loader 应该放在所有 .js 规则中的最后一个（先检验，再做别的事情）。
```js
{
    rules: [
        {
            test: /\.js$/,
            use: [
                loader: "babel-loader",
            ]
        },{
            test: /\.js$/,
            use: [
                loader: "eslint-loader",
            ]
        }
    ]
}
```

也可以使用 options 中的 enforce 配置项：
```js
{
    rules: [
        {
            test: /\.js$/,
            use: [
                loader: "eslint-loader",
                options: {
                    // 强制让这个 loader 最先执行
                    enforce: "pre"
                }
            ]
        },{
            test: /\.js$/,
            use: [
                loader: "babel-loader",
            ]
        }
    ]
}
```
`enforce` 默认值是 `normal`，除了 `pre` 和 `normal` 之外，还有 `post`，表示强制最后执行在 normal 之后执行这个loader。

### 处理 react jsx 语法：`@babel/preset-react`
下载: `yarn add @babel/preset-react -D`。当然，如果想使用 react，也要下载。在 `.babelrc` 的presets项中添加一个preset：
```json
{
    "presets": [
        ["@babel/env",
            {
                "modules": false,
                "targets": {
                    "ie": 9
                }
            }
        ],
        "@babel/react"
    ]
}
```

这个时候就可以愉快的使用 react 了！
#### 处理 `.jsx` 的文件
用 react 写的文件不光可以使用 `.js`后缀，也可以使用 `.jsx` 文件后缀。但想要使用，这需要配置，不然会报错。来到 webpack 配置文件，添加一个 loader 项：
```js
{
    test: /\.jsx$/,
    use: "babel-loader",
}
```
当然，也可以与 js 配置写在一起：
```js
test: /\.(js|jsx)$/,
use: {
    // ...
}
```

### `postcss-loader`
下载：`npm install postcss-loader`  
配置：
```js
// 不需要再次创建新的 loader 对象，应该在之前的 style-loader css-loader 之后直接添加 postcss-loader 即可
{
    test: /\.css$/,
    // 顺序很重要
    use: ['style-loader','css-loader','postcss-loader'],
}
```

需要注意的是：使用多个 loader 时，loader 的加载是有顺序的，loader 的加载是从右到左。因此，less-loader 或者 sass-loader 先执行，让代码先转成原生的CSS，然后使用 postcss-loader 优化CSS属性（比如添加属性后缀），然后是 css-loader 将CSS文件中 `import` 导入的文件添加进来，最后使用 style-loader 将 CSS 样式添加到 html 的 style 标签中。

#### 配置 PostCSS
这里需要创建一个文件 —— `postcss.config.js` 在项目根目录下。  
#### 自动添加后缀 —— `autoprefixer`
```js
const autoprefixer = require('autoprefixer');

module.exports = {
    plugins: [
        autoprefixer({
            // 需要支持的特性（这里添加了 grid 布局）
            grid: true,
            // 浏览器兼容
            overrideBrowserList: [
                '>1%',  // 浏览器份额 大于 1% 的。
                'last 3 versions',  // 兼容最后三个版本
                'android 4.2',
                'ie 8'
            ],
        })
    ]
};
```
#### `postcss-preset-env` 插件
这个插件可以让我们在应用中使用最新的 CSS 语法特性。同样需要下载: `yarn add postcss-preset-env`。使用：
```js
// postcss.config.js

const autoprefixer = require('autoprefixer');
const postcssPresetEnv = require('postcss-preset-env');

module.exports = {
    plugins: [
        autoprefixer({
            grid: true,
            overrideBrowserList: [
                '>1%',
                'last 3 versions',
                'android 4.2',
                'ie 8'
            ],
        }),

        postcssPresetEnv({
            state: 3,
            features: {
                'color-mod-function': {
                    unresolved: 'warn'
                },
                browsers: 'last 2 versions'
            }
        })
    ]
};
```

配置完有关 CSS loader 后，还有一个问题，我们不想将 CSS 都插入到 style 标签中，如果 CSS 样式代码很多，会导致生成的 HTML 文件很大，我们希望使用 `<link>` 标签引入打包后的 CSS 文件（将 CSS 单独提取出来），这时候就要使用一个插件：`mini-css-extract-plugin`。  

下载：`yarn add mini-css-extract-plugin -D`。  

配置：  
```js
// webpack.config.dev.js
let MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    // ....

    plugins: [
        new MiniCssExtractPlugin({
            // 抽离的样式叫什么名字（会生成在 css 文件夹下）
            filename: "css/main.css",
        });
    ],

    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    // 将 style-loader 替换掉（不再将 css 样式放在 style 标签中）
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            }
        ]
    }
}
```

### 暴露全局变量
在 webapck 中使用 jquery 时，可以这么引入：  
```js
import $ from 'jquery';
```
但是这个 `$` 变量并不在全局下（window）。如果我们想要将改变量暴露到全局中，需要使用 `expose-loader`。  

下载：`yarn add expose-loader`。将 jquery 模块暴露出来：
```js
import $ from "expose-loader?$!jquery";
```
`?$!` 中的 `$` 就是指被暴露的变量名（`expose-loader` `?` `!` 是固定格式）。

当然，如果不想这么写，也可以在 rules 中进行配置：  
```js
{
    rules: [
        test: require('jquery'),
        use: 'expose-loader?$'
    ]
}
```
配置好后，使用jQuery时，还需要进行引入：`import $ from 'jquery'`。如果不想每次都引入（或说不用引入），可以使用一个插件：`provide-plugin`。使用时不需要下载，webpack 自带，然后在 plugins 配置项中配置：
```js
{
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery'
        })
    ]
}
```

如果你在 HTML 中引入了第三方模块使用 script 标签，但在开发中如果再使用 `import $ from 'jquery'`，webpack 就会多打包一次。为了不让 webpack 这样做，可以添加一个配置: 
```js
module.exports = {
    plugins: [],
    // ...
    externals: {
        jquery: 'jQuery'
    }
}
```

## resolve 配置项
这是一个可选的配置项，配置 `resolve` 用来设置模块如何被解析。几个常见的配置项：  
### 1. `resolve.alias`
这个属性是给路径添加别名的，当使用 `import` 或者 `require` 去引用别的模块时，文件路径可能会比较长，这个时候就可以使用 `alias` 来简化路径。也可以在给定对象的键后的末尾添加 $，以表示精准匹配。比如：
```js
// 在 webpack 中配置 resolve.alias
module.exports = {
    // ....
    resolve: {
        alias: {
            xyz$: path.resolve(__dirname, 'path/to/file.js'),
            xyz: path.resolve(__dirname, 'path/to/file.js')
        }
    }
    // ....
}

// 引用：index.js
import App1 from 'xyz';     // 精准匹配，会解析到 path/to/file.js 中的 js 文件
import App2 from 'xyz/index.js';  // 非精准匹配，匹配 path/to/file.js/index.js 中的内容 
```
### `resolve.extensions`
这个配置项设置后会自动解析确定的扩展。默认值为 `extensions: ['.wasm', '.mjs', '.js', '.json']`。还可以做更改，比如 添加 jsx 文件：
```js
{
    resolve: {
        // 顺序的是从左到右，假如引入的文件不带后缀，
        // 会先找 .wasm 的文件，没找到会接着找 .mjs 的文件，
        // 以此类推
        extensions: ['.wasm', '.mjs', '.js', '.json','.jsx']
    }
}
```
resolve 配置项还有许多，上面两个应该是比较常用的。其他的可以参看官网：[webpack中文文档](https://webpack.docschina.org/configuration/resolve/) 或 [webpack英文文档](https://webpack.js.org/configuration/resolve/)  


## devServer 配置项
配置 devServer 之前需要先下载 `webpack-dev-server`: `yarn add webpack-dev-server -D`。  
下载好之后，就可以在 webpack 配置项中去配置 webpack-dev-server 啦。  
### 配置 devServer
devServer 的配置项很多，这里只对使用最多的做一下介绍。devserver 的配置应该是在开发环境下进行的。下面是一个简单的配置内容：
```js
if(isDev){      // 如果是开发环境
    config.devServer = {
        // 设置 host（默认就是 localhost）
        // 如果你希望服务器外部可访问
        // 可以这样指定：127.0.0.1
        // 即：通过 IP 地址的形式
        host: "localhost",
        // 设置端口号
        port: "8888",
        // 告诉服务器从哪个目录中提供内容
        // 默认它会查找 index.html 文件作为页面根路径展示
        contentBase: path.join(__dirname,"../build"),
        // 这个publicPath代表静态资源的路径（打包后的静态资源路径）
        publicPath: '/build/',
        // 当设置成 true时，任意的 404 响应都可能需要被替代为 index.html
        historyApiFallback: true,
        // 是否开启 模块热替换功能
        hot: true,
        // 是否让浏览器自动打开（默认是 false）
        open: true,
        // 被作为索引文件的文件名。
        // 默认是 index.html，可以通过这个来做更改
        index: 'demo.html',

        // 使用代理服务器
        proxy: {
            '/api': {
                // 当请求 /api 的路径时，就是用 target 代理服务器
                target: "http://loaclhost:3000",
                // 重写路径
                pathRewrite: {
                    '/api': ''
                }
            }
        }
    }
}
```
有时候我们不想使用代理，只是想单纯的模拟数据。就可以使用 webpack 给我们提供的一个 `before` 函数：
```js
{
    devServer: {
        // app 参数就是 express 框架的 express 实例
        before(app){
            app.get('/api',(req,res) => {
                // to do something...
            })
        }
    }
}
```

第三种方式，就是使用 webpack 的端口（服务端和 webpack（前端） 是一个端口）在服务端需要下载一个中间件：`webpack-dev-middleware`。
```shell
yarn add webpack-dev-middleware -D 
```
然后服务端写入以下代码：
```js
const express = require("express");
const webpack = require("webpack");
const webpackMiddleware = require("webpack-dev-middleware");

// 引入写好的 webpack 配置文件
let config = require("./webpack.config.js");
let compiler = webpack(config);

// 绑定中间件
app.use(webpackMiddleware(compiler));
```

### 配置命令
来到 package.json 文件中，再添加一条命令，叫做 `start`，写下下面的内容：
```json
{
    "script": {
        "build": "cross-env NODE_ENV='development' webpack --config config/webpack.config.dev.js",
        "start": "cross-env NODE_ENV=development webpack-dev-server --config config/webpack.config.dev.js"
    }
}
```
然后运行 `npm start` 就会自动打开浏览器，跳转到我们指定的 `localhost:8888` 端口。
> 有一点需要注意，在开发环境不要设置 publicPath，因为 开发环境下 devServer 执行打包的内容是在内存里的，如果设置了 publicPath 保存后页面反而不会有刷新。应在生产环境再用 publicPath。还有一点就是，每次修改配置项都要重新运行命令，这是很费时的一件事，如何在更新配置文件后不用再次重启服务呢？这在下面会说到。
### historyApiFallback 更具体的配置
通过传入一个对象，比如使用 rewrites 这个选项，可进一步地控制。
```js
{
    devServer: {
        historyApiFallback: {
            // 是个数组
            rewrites: [
                // b=表示 以 “/” 请求的页面，会返回 这个路径下的 html 文件
                { from: /^\/$/, to: '/views/landing.html' },
                { from: /^\/subpage/, to: '/views/subpage.html' },
                // 别的则会返回 404 页面
                { from: /./, to: '/views/404.html' }
            ]
        }
    }
}
```
### devServer 中 publicPath 的配置
devServer 中的 publicPath 与 output 中的并不同。devServer 中的 publicPath 指的是 webpack-dev-server 的静态资源服务路径。假如我们打包的内容在 build 文件夹下，则 publicPath 应是 `/build/`，这里有个技巧，output 中指定的打包路径，比如：`path: path.join(__dirname,'../build')` 那么 devServer 的 publicPath 一般就是 join方法中的那个 `build`。如果指定别的路径，很可能就会访问不到资源。

### 开启模块热替换功能
开启这个功能可以让我们修改文件并保持后，页面不会出现刷新的情况，页面中的内容是被动态更替了！这样减少了页面重新绘制的时间。在 devServer 中单纯的让 hot = true 是没有作用的，还需要一个 webpack 插件。这个插件是 webpack 内置的插件，不需要下载。具体配置步骤如下：
```js
/**
 * 来到 webpack 配置文件
 * 引入 热更替插件
*/
const webpack = require('webpack');
// 来到 devServer 选项
{  
    devServer: {
        hot: true
    },
    // 添加 plugin
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ]
}
```
配置好 webpack 之后，还需要在入口程序处检测 module.hot 是否存在（这个对象是在 webpack 打包后自动加入的）。  
假如我们的程序入口文件是 index.js，可以这么来写：
```js
// index.js
if(module.hot){
    // 调用 accept 方法开启热更替
    module.hot.accept();
}
```
上面步骤做完后，就可以使用 热更替了。如果有多个页面，则应为每个页面的入口作检验。  
#### React 中使用热模块更替
在 React 中，index.js 常常做程序的入口，而 App.js 往往需要 index.js 的导入。`module.hot.accept` 方法可以接收两个参数，一个是路径字符串或者数组，另一个是回调函数。在 index.js 中可以这么来写：
```js
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App.jsx';

function render(){
    ReactDOM.render(
        <App />,
        document.getElementById('root')
    )
}

render();

if (module.hot) {
    console.log(module.hot);
    // 当第一个参数是数组时
    // 表示 有多个路径需要热模块更替
    // 回调用于在模块更新后触发的函数
    module.hot.accept('./App.jsx',() => {
        render();
    });
}
```
React 自己来提供了一个官方的热更替模块 —— `react-hot-loader`。使用它时需要下载: `npm install react-hot-loader`。使用时也需要配置。  
- 首先需要配置 webpack 文件：
```js
// 更改 entry：
{
    entry: ['react-hot-loader/patch', '../src/index.js'],
}
```
- 然后来到 `.babelrc` 文件，添加一个 plugin：
```js
{
    "plugins": ["react-hot-loader/babel"]
}
```
- 来到 index.js 文件处，你就可以直接把原来判断 module.hot 的内容给删掉了。而且 webpack 配置文件也不需要再引入 热更新插件（恢复没有热更新配置时的样子，但是 hot 项不要变成 false）。  
- 来到 App.js 文件，更改内容：
```js
import { hot } from 'react-hot-loader';
function App(){
    // ....
}

// 最后这样导出：
export default hot(module)(App);
```
还没完，还应该重新下载一个包：`yarn add @hot-loader/react-dom` 这个包和 `react-dom` 一样，只是它有热替换功能。下载之后，在 webpack resolve 配置项中写入：
```js
alias: {
    // 这样，你在引入 react-dom 时，就会引入这个包
    'react-dom': '@hot-loader/react-dom'
}
```
最后，重启服务，热更替模块就可以用了。使用 react-hot-loader 的好处就是，可以避免 React 组件的不必要渲染。  

## 使用 watch 简化操作
当代码一变化，就会自动打包。
```js
// webpack.config.dev.js

module.exports = {
    watch: true,    // 开启监听
    watchOptions: {
        poll: 1000, // 每秒打包一次
        // 防抖，一直输入代码，停止输入 500 毫秒后再打包。
        aggreateTimeout: 500,
        // 不需要进行监控的文件或目录
        ignored: /node_modules/ 
    }
}
```

## webpack优化
配置了那么多，优化处理一点也没有，特别是导出的文件只有一个，这样会让文件非常大，这时候就需要切片处理以及分离文件。  
### 分离样式文件
在面前的配置中，css 样式是通过附加 style 标签的方式引入样式的。在生产环境下我们希望将样式存于 CSS 文件中，文件更有利于客户端进行缓存。  
这时就可以使用 webpack 提供的一个插件 —— `mini-css-extract-plugin`，使用这个插件需要先进行下载：`yarn add mini-css-extract-plugin -D`。
```js
// 来到 webpack 配置文件的 module.rules 配置项，修改 css-loader 内容：
module: {
    rules: {
        test: /\.(le|sa|sc|c)ss$/,
        use: [{
                // 这里就不再使用 style-loader 了
                // 而是使用这个插件 
                loader: MiniCssExtractPlugin.loader,
                options: {},
            },
            "css-loader",
            "postcss-loader",
            "less-loader",
            "sass-loader"
        ]
    }
},
plugins: [
    new MiniCssExtractPlugin({
        filename: 'static/css/[name].css',
        chunkFilename: 'static/css/[id].css'
    })
]
```
### 代码分片
在 js 文件中，常常会引入第三方模块，比如 React、Vue等。而且一个多个文件可能都要引入，导致一个 js 文件会很大。我们可以使用插件给第三方的模块和业务中不常更新的模块创建一个入口。这里就要再添加一个配置项 —— `optimization.SplitChunks`。webpack 会根据你选择的 mode 来执行不同的优化，不过所有的优化还是可以手动配置和重写。优化配置大部分都在 `optimization` 这个配置项中。  
默认情况下，optimization 的配置是这样的：
```js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
};
```
在上面默认项中，有一个 `chunks` 属性，他有三个选项：async（默认）、initial、all。async只提取异步chunk，initial则只针对入口chunk生效，而 all 表示两种模式都开启。`minChunks` 表示该模块被 n 个入口同时引用才会进行提取，比如在写 React 程序时，React 模块会被经常引入，这时候就有必要进行提取一些，当然也可以设置成 `Infinity` 表示所有模块都不会被提取；`name` 字段默认是 true，表示 `SplitChunks` 可以根据 `cacheGroups` 和作用范围自动为新生成的 `chunk` 命名，并以 `automaticNameDelimiter` 的值的形式进行分隔。如：vendors~a~b~c.js 的意思就是 `cacheGroups` 为 `vendors` 并且该 chunk 是由 a、b、c 三个入口 chunk 所产生的。
> `cacheGroupts` 可以理解为分离 chunks 时的规则。默认情况下有两种规则 —— vendors 和 default。vendors 用于提取所有 node_modules 中符合条件的模块，default 则作用于被多次引用的模块。
下面代码更改了 chunks 属性值，将它设置成 all，这意味着即使在异步和非异步块之间也可以共享块。
```js 
module.exports = {
    // ...

    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 30000,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            name: true,
            cacheGroups: {
                vendors: {
                    // 第三方模块 打包出 vendors.js 文件
                    name: 'vendors',
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                default: {
                    // 自己的模块 导出成 commons.js 文件名
                    name: 'commons',
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }
    },
}
```
在 output 配置项中添加 `chunkFilename` 字段，就会导出异步加载的模块，实现程序代码与工具模块的分离。
```js
{
    output: {
        chunkFilename: "[name].js"
    }
}
```
> 在开发阶段，如果给 html-webpack-plugin 定义了 chunk ，改变 splitChunks 属性后，别忘了添加 chunks: `chunks: ["vendors","commons","index"]`。（先后顺序也很重要！）
对于 html-webpack-plugin 中的 chunks 不用指定，它会自动按顺序添加 `<script>` 标签（这时就是引入多个 `script` 标签了）。
### `webpack-merge`
使用 `webpack-merge` 插件可以让不同环境的 webpack 配置分别写在不同的文件上。在配置 webpack 时可以将开发环境和生产环节相同的配置项提取出来，写在一个单独的文件中，这样做可以更好的管理配置。
```js
// 提取出 webpack-base文件
module.exports = {
    // ....
}

// webpack-config-dev.js 文件
const merge = require('webpack-merge');
const webpackBase = require('./webpack-config-base');
// 合并：
module.exports = merge(webpackBase,{
    // 开发环境配置
    // 如果配置相同项时
    // base 中的配置项会被覆盖
});

// webpack-config-prod.js 文件
const merge = require('webpack-merge');
const webpackBase = require('./webpack-config-base');
// 合并：
module.exports = merge(webpackBase,{
    // 开发环境配置
    // 如果配置相同项时
    // base 中的配置项会被覆盖
});
```

## 生产环境配置
在生产环境主要是让代码压缩，而 webpack 打包压缩后的代码基本不具有可读性，如果此时代码抛出错误是很难找到原因的。因此在生产环境还应该有线上问题追查的方法，这个方法在 webpack 中可以配置生成代码对应的 `source map`。
```js
module.exports = {
    devtool: 'source-map',
}
```
`devtool` 还有几个配置值：`eval-source-map`，这个表示不会产生单独的文件（集成在打包后的文件中），但是可以显示行和列（代码有异常时）；`cheap-module-source-map` 不会产生列，但是会产生一个 source-map；`cheap-module-eval-source-map` 配置不会生成 source-map 文件，集成在打包后的文件中，不会产生列。

如果想让 css或sass 也生成 map，需要在loader的options中指定：
```js
{
    module:{
        rules: [
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    options: {
                        // 将该属性值设为 true
                        sourceMap: true
                    },
                    "css-loader",
                    "postcss-loader"
                ]
            }
        ]
    }
}
```
### 压缩代码
当指定了 `mode: production`后 ，webpack 会自动压缩。当然也可以自己来指定：
```js
module.exports = {
    optimization: {
        // 指定该项后，代码会被压缩
        minimiza: true,
    }
}
```
除了这个还可以使用插件进行压缩，`terser-webpack-plugin`，使用时需要先下载。  
该插件提供了几个配置项：  

![](./img/terser.png)  

下面是一个配置的例子：
```js
module.exports = webpackMerge(webpackBase,{
    mode: 'production',
    devtool: 'source-map',
    optimization: {
        minimizer: [
            new TerserPlugin({
                parallel: true,
                sourceMap: true,
                exclude: /\/excludes/,
            }),
        ]
    }
});
```
#### 压缩 CSS
压缩 CSS 的前提是将 css 提取出来，比如使用 mini-css-extract-plugin 插件进行提取。而压缩 CSS 需要使用别的插件 —— `optimize-css-assets-webpack-plugin`。也需要先下载。配置如下：
```js
module.exports = {
    optimization: {
        minimizer: [
            new OptimizeCssAssetsPlugin({
                // 压缩处理器，默认为 cssnano
                cssProcessor:require('cssnano'),
                // 压缩处理器的配置
                cssProcessorOptions: {
                    discardComments: { removeAll: true },
                    // 是否展示 log
                    canPrint: true
                }
            }),
        ]
    }
}
```
需要注意的是，使用 OptimizeCssAssetsPlugin 插件压缩 CSS 文件后，JS 文件压缩就会失效。这时候就需要使用 JS 压缩插件：`UglifyJsPlugin`。  

下载：`yarn add uglify-js-plugin -D`。  

在 `optimization` 的 `minimizer` 配置项中配置：  
```js
{
    minimizer: [
        new UglifyJsPlugin({
            // 是否需要缓存（是）
            cache: true,
            // 是否是并发打包（是）
            parallel: true,
            // 是否生成源码映射（是）
            sourceMap: true
        }),
        new OptimizeCssAssetsPlugin({
            // ...
        })
    ]
}
```

## webpack 小插件 
### 1. cleanWebpackPlugin
该插件需要下载，功能是每次新的打包完成后，旧的打包目录会自动被删除。该插件需要传入一个参数，你要删除的路径，要删除多个目录可以传入一个数组。  

### 2. copyWebpackPlugin
该插件需要下载。功能是将没有指定为入口的目录中的文件拷贝到打包后的目录中。  
格式：
```js
new CopyWebpackPlugin([
    {from: '要拷贝的目录',to: '拷贝到哪里'}
])
```
### 3. webpack.DefinePlugin
该插件是 webpack 自带的插件（不需要下载）。用它可以自定义环境变量。
```js
{
    plugin: [
        new webpack.DefinePlugin({
            // DEV 变量就是一个环境变量
            DEV: JSON.stringify('dev'),
            PRODUCTION: JSON.stringify('production')
        }),
    ]
}
```
一般不使用这种方式配置环境变量。

### 4. BannerPlugin
该插件是 webpack 自带的，有一个字符串参数，表示版权说明。
```js
{
    plugins: [
        new webpack.BannerPlugin("make 2019 by xxx"),
    ]
}
```

## create-react-app 中配置多页应用
