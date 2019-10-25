# HTML5 File API

在 HTML5 的 input 标签中，新增了一个 `type=file` 属性的表单控件。这个控件可以让我们能调出文件选择窗口然后读取这些文件的内容成为可能。  

```html
<input type="file" id="file-ipt" name="file" accept=".jpg,.jpeg,.gif,.png">
```

上面代码就是一个 file DOM。它支持选择以 .jpg、.jpeg、.gif、.png 后缀格式的图片。当选择好一个文件后 input 元素就会触发 change 事件。  
该元素不仅可以点击选择文件，还支持拖拽选取文件。当将文件拖拽到 input 元素上方并松手后也会触发 change 事件。  

通过文件 API，我们可以访问 FileList，包含了代表用户所选文件的对象 File。  

```js
const fileIpt = document.getElementById("file-ipt");
// change 事件触发：
fileIpt.onchange = function(){
    const files = fileIpt.files;    // 获取到 fileList
    for(let i = 0;i < files.length;i ++){
        console.log(files[i]);
    }
}
```

## file input 使用技巧
说实在的，file `<input />` 元素在页面展示的样子真不太好看。许多使用 file input 元素的 UI 组件是把这个元素隐藏掉了，然后通过一些技巧让文件上传组件变得漂亮起来。  

### 通过 click() 方法进行模拟

```html
<body>
    <input style="display: none;" type="file" id="file-ipt" name="file" accept=".jpg,.jpge,.gif,.png">
    <button class="btn">选择图片文件</button>


    <script>
        const fileIpt = document.querySelector('#file-ipt');
        const btn = document.querySelector(".btn");

        btn.addEventListener('click',function(){
            if(fileIpt){
                // 点击 button 后，相当于 fileIpt 被点击了
                fileIpt.click();
            }
        },false);

    </script>
</body>
```
上面代码运行后，点击 button 也会调出文件选择窗口。  

### 使用 label 元素
label 元素可以和一个 `<input>` 元素关联在一起。你需要给 `<input>` 一个 id 属性。而 `<label>` 需要一个 `for` 属性，其值和 input 的 id 一样。  

```html
<body>
    <input type="file" id="file-ipt" accept=".png,.jpg" />
    <label for="file-ipt">选择一张图片</label>
</body>
```
运行上面代码，当点击 label 中的文字后，就会弹出文件选取框。使用 label 可以不用定义或模拟 click 事件。  

下面是一个用 CSS 优化后的 file input 组件。
```html
<div class="wrapper">
    <label class="label-file" for="file-ipt">
        <span class="add">+</span>
        <span class="describe">Upload</span>
        <input style="display: none;" type="file" id="file-ipt" name="file" accept=".jpg,.jpge,.gif,.png">
    </label>
</div>
```

#### CSS 样式
```css
*{
    padding: 0;
    margin: 0;
}
.wrapper{
    width: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 100px auto;
}
.label-file{
    display: flex;
    flex-direction: column;
    width: 100px;
    height: 100px;
    border: 1.5px dashed #999999;
    color: #999999;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    border-radius: 6px;
}
.label-file:hover{
    border: 1.5px dashed #1890ff;
    transition: all 0.6s;
}
span.add{
    font-size: 40px;
}
span.describe{
    font-size: 16px;
}
.wrapper p{
    padding: 6px 0px;
}
```
#### JavaScript
```js
const fileIpt = document.getElementById("file-ipt");
const wrapper = document.querySelector(".wrapper");

fileIpt.addEventListener('change',function(){
    const file = fileIpt.files[0];
    let p = document.createElement("p"),
        name = file.name;
    p.innerText = name;
    wrapper.appendChild(p);
},false);
```

## 使用拖放来选取文件
file input 元素默认支持拖放。而使用拖放来选取文件时，不一定要使用 file input。只要创建一个元素接收drop事件即可。  

还是上面的 HTML+CSS 解构。不过要添加鼠标拖拽事件。
```js
const fileIpt = document.getElementById("file-ipt");
const wrapper = document.querySelector(".wrapper");
const dropBox = document.querySelector(".label-file");

// 主要是取消默认事件
function drag(e){
    e.stopPropagation();
    e.preventDefault();
}

function handleFiles(files){
    for(let i = 0;i < files.length;i ++){
        var p = document.createElement("p");
        p.innerText = files[i].name;
        wrapper.appendChild(p);
    }
    // 你也可以让 fileIpt 存入文件信息 
    fileIpt.files = files;
}

// 核心是这里
function drop(e){
    e.stopPropagation();
    e.preventDefault();

    // 鼠标放下后，drop 事件触发
    // 这时可以获得文件信息
    var dt = e.dataTransfer;
    var files = dt.files;

    handleFiles(files);
}

dropBox.addEventListener("dragenter",drag,false);
dropBox.addEventListener("dragover",drag,false);
dropBox.addEventListener("drop", drop, false);
```

## 展示图片预览图
可以使用 `URL.createObjectURL()` 方法来实现。参数是一个用于创建 URL 的 `File` 对象、`Blob` 对象或者 `MediaSource` 的对象。  
在上面代码的基础上，再添加以下代码：
```js
fileIpt.onchange = function(){
    const files = this.files;
    var ul = document.createElement("ul");
    for(let i = 0;i < files.length;i ++){
        var li = document.createElement("li");
        li.classList.add("imgWrapper");
        ul.appendChild(li);
        // 实例化一个图片
        var image = new Image(200);
        // 让图片的 url 指向创建的文件 url
        image.src = window.URL.createObjectURL(files[i]);

        image.onload = function() {
            window.URL.revokeObjectURL(this.src);
        }

        li.appendChild(image);
    }
    wrapper.appendChild(ul);
}
```
需要注意的是，当不再需要这些 URL 对象时，每个对象必须通过调用 `URL.revokeObjectURL(src)` 方法来释放。浏览器会在文档退出的时候自动释放它们，但是为了获得最佳性能和内存使用状况，你应该在安全的时机主动释放掉它们。  

### 使用 FileReader 创建预览图
这需要改写上面的 `fileIpt.onchange` 事件。 
```js
fileIpt.onchange = function(){
    const files = this.files;
    var ul = document.createElement("ul");
    for(let i = 0;i < files.length;i ++){
        var li = document.createElement("li");
        li.classList.add("imgWrapper");
        ul.appendChild(li);
        var image = new Image(200);

        li.appendChild(image);

        // 建立一个文件读取对象实例
        var reader = new FileReader();
        reader.onload = (function(aimg){
            return function(e){
                aimg.src = e.target.result;
            }
        })(image);

        // 将读取到的内容生成一个 url
        reader.readAsDataURL(files[i]);
    }
    wrapper.appendChild(ul);
}
```
`reader.readAsDataURL(files[i])` 方法可以读取指定的 Blob 中的内容。一旦完成，result（e.target.result）属性中将包含一个 **data: URL格式** 的Base64字符串以表示所读取文件的内容。

## 上传文件
使用 `FormData`对象或者 `FileReader`可以实现文件上传，或者使用 HTML5 提供的 `FormData` 来实现。下面一一介绍这三个方法。  
### 使用 FileReader 上传文件
在展示图片预览图部分以及使用过 `FileReader` API。对于上传文件，可以使用 `FileReader` API 中的一个方法来实现文件上传的目的 —— `readAsBinaryString(blob)` 或者 `readAsArrayBuffer(blob)`。`readAsDataURL(file)` 方法可以给文件生成一个 URL，而 `readAsBinaryString` 方法可以读取指定的Blob中的内容。一旦完成，result属性中将包含所读取文件的原始二进制数据。而 `readAsArrayBuffer(blob)`可以读取指定的 Blob 或 File 内容，同时 result 属性中将包含一个 ArrayBuffer 对象以表示所读取文件的数据。

```js
var reader = new FileReader();

reader.readAsArrayBuffer(blob);

reader.onload = function(e){
    // 获取读取的数据
    var data = e.target.result;
}
```

下面做一个文件上传的实例。  

HTML 骨架： 
```html
<body>
    <div class="wrapper">
        <!-- imgBoxs 存放上传图片（预览图）的容器 -->
        <div class="imgsBox">
            <!-- dropBox 选择文件的按钮 -->
            <div class="dropBox">
                <input type="file" id="file-ipt" name="file" />
                <div class="add">+</div>
                <div class="describe">Upload</div>
            </div>
        </div>
    </div>

    <script src="./01.js"></script>
</body>
```

JavaScript 代码：
```js
const imgsBox = document.querySelector(".imgsBox");
const dropBox = document.querySelector(".dropBox");
const fileIpt = document.querySelector("#file-ipt");

/**
 * Ajax 封装函数
 * @param {XMLHttpRequest} xhr
 * @param {string} method
 * @param {string} url
 * @param {Object} data
 * @param {JSON} headers
 */
function ajax(xhr,method = "GET",url,data = '',headers = {}){
    return new Promise((resolve,reject) => {
        xhr.open(method, url);
        for(let p in headers){
            xhr.setRequestHeader(p,headers[p]);
        }
        xhr.onreadystatechange = function () {
            if(xhr.readyState === 4){
                if(xhr.status === 200 || xhr.status === 304){
                    resolve(xhr.response);
                }else{
                    reject("Warning!",xhr.status);
                }
            }
        }
        xhr.send(data);
    });
}

/**
 * 上传文件
 * @param {JSON} data 
 */
function uploadFile(data){
    const xhr = new XMLHttpRequest();
    // 监听上传进度
    xhr.upload.addEventListener("progress", function (e) {
        if (e.lengthComputable){
            console.log((e.loaded * 100 / e.total).toFixed(2) + "%");
        }
    }, false);
    // 上传完毕后的事件函数
    xhr.upload.addEventListener("load",function(){
        console.log("上传完毕!");
    },false);
    // 接收响应数据
    var result = ajax(xhr, "POST", "/file.php", data);

    result.then((data) => console.log(data));
}

/**
 * 展示预览图
 * @param {string} imgURL
 */
function createImage(imgURL){
    var div = document.createElement("div"),
        box = document.createElement("div");
        img = document.createElement("img"),
    div.classList.add("imgWrapper");
    box.classList.add("imgBox");

    img.src = imgURL;
    box.appendChild(img);
    div.appendChild(box);

    img.onload = function(){
        if(img.height < img.width || img.height === img.width)
            img.style.height = "100%";
        else
            img.style.width = "100%";
    }
    imgsBox.insertBefore(div,dropBox);
}

/**
 * 处理文件对象
 * @param {File} file
 */
function handleFiles(file){
    var name = file.name,
        reader = new FileReader(),
        showImgReader = new FileReader();

    showImgReader.onload = function(e){
        createImage(e.target.result);
    }

    reader.onload = function(e){
        uploadFile(JSON.stringify({
            name,
            file: e.target.result,
        }));
    }
    reader.readAsBinaryString(file);
    showImgReader.readAsDataURL(file);
}

/**
 * file change 事件触发
 * @param {Event} e 
 */
function fileChange(e){
    var fileList = this.files || e.target.files;
    for(let i = 0;i < fileList.length;i ++){
        handleFiles(fileList[i]);
    }
}

fileIpt.addEventListener("change",fileChange,false);
```

CSS 样式：
```css
*{
    padding: 0;
    margin: 0;
}
div.wrapper{
    height: 500px;
    width: 500px;
    border: 1px solid #dddddd;
    margin: 100px auto;
    border-radius: 10px;
}
div.imgsBox{
    margin: 60px;
    width: 360px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: auto;
}
div.dropBox{
    height: 100px;
    width: 100px;
    border: 1.5px dashed #999999;
    border-radius: 6px;
    cursor: pointer;
}
div.dropBox:hover{
    border: 1.5px dashed #1890ff;
    transition: border .6s;
}
#file-ipt{
    display: none;
}
.dropBox .add{
    color: #999999;
    font-size: 50px;
    width: 100%;
    text-align: center;
}
.dropBox .describe{
    color: #999999;
    width: 100%;
    text-align: center;
}
.imgWrapper{
    height: 90px;
    width: 90px;
    padding: 8px;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    border-radius: 10px;
    position: relative;
    background-color: white;
    border: 1px solid #cccccc;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0px 10px 10px 0px;
}
.imgWrapper .imgBox{
    height: 100%;
    width: 100%;
    overflow: hidden;
    border-radius: 6px;
}
```

上面代码中，使用了 `FileReader` 处理文件数据，并发送 POST 请求，上传了 JSON 数据，数据包含文件名和文件本体数据。

使用 Node.js 做后端处理：
```js
const fs = require("fs");
const http = require("http");

http.createServer((req,res) => {
    if(req.url === "/file.php"){
        let data = [];
        // 监听请求数据
        req.on('data',(chunk) => {
            data.push(chunk);
        });
        req.on('end',function(){
            // 拿到数据
            var object = JSON.parse(Buffer.concat(data).toString());
            // 写入操作
            fs.writeFileSync(`./${object.name}`,object.file,{encoding: 'binary'});
            // 返回相应信息
            res.setHeader("Content-Type","text/plain");
            res.end('{"status": "seccess"}');
        });
    }
    // 路由处理
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
```

当然，也可以使用 `readAsArrayBuffer(file)` 方法去读取文件然后发送请求。需要注意的是，该方法会生成 `ArrayBuffer` 数据。而 `ArrayBuffer` 数据是不允许进行修改的。也就是说，你不能向上面一样使用 `upload(JSON.stringify({name,file}))` 去发送数据，因为使用了 `JSON.stringify` 方法操作了 `ArrayBuffer`数据。你只能直接进行数据发送：`upload(e.target.result)`。

Node.js 服务端接收 `ArrayBuffer` 数据时，只需 `Buffer.concat(data)` 然后进行文件写入即可。该方法不足的是，你无法一次发送数据就能获知发送文件的一些信息，比如文件后缀和文件名，不知道文件后缀就不太好生成正确的文件。当然，可以发送两波请求，一波是文件数据，一波是文件信息。  

### 模拟进度条
很多文件上传或下载场景中都有下载/上传进度信息，通常用一个进度条来描述。XMLHttpRequest 实例的 upload 对象中可以监听 `progress` 来监听文件上传/下载的进度。`load` 方法表示文件上传/下载完成。下面的代码会打印出文件上传时的上传进度。
```js
xhr.upload.addEventListener("progress",function(e){
    if (e.lengthComputable){
        /*
         * lengthComputable 它告诉进度是否可测量（布尔类型）。默认为 false
         * loaded     它表示已上传的工作量（数字类型）
         * total      它表示总的工作量数（数字类型）
        */
        console.log((e.loaded * 100 / e.total).toFixed(2) + "%");
    }
},false);
```

完整代码：
```js
/**
 * 创建一个元素
 * @param {string} tagName
 * @param {string} content
 * @param {string} className
 */
function createElem(tagName,content,className){
    const tag = document.createElement(tagName);
    tag.innerHTML = content || '';
    if(className)
        tag.classList.add(className);
    return tag;
}

/**
 * 将多个元素插入到一个元素中
 * @param {Element} parent
 * @param {Array <Element>} elems
 * number 值是 0 时，append 插入，值是 1 时，insertBefore 插入
 * @param {number} position
 * 当是 insertBefore 时，需要传入指定的元素
 * @param {Element} oldElem
 */
function appendElems(parent,elems,position,oldElem){
    if(position){
        elems.forEach(item => {
            parent.insertBefore(item,oldElem);
        });
    }else{
        elems.forEach(item => {
            parent.appendChild(item);
        });
    }
}

/**
 * 上传事件发生时的函数
 * @param {Event} e
 * @param {Object <Element>} elems
 */
function progressAnimation(e,elems){
    const { div,describe,progressNum,loadBox,loadBar } = elems;

    if (e.lengthComputable) {
        loadBar.style.width = "0px";
        imgsBox.insertBefore(div,dropBox);
        appendElems(div, [progressNum, loadBox, describe]);
        loadBox.appendChild(loadBar);

        describe.innerText = "Upload...";
        const bar_W = parseInt(window.getComputedStyle(loadBox,null).width);

        var num = (e.loaded * 100 / e.total).toFixed(2);
        if(num >= 90){
            loadBar.style.backgroundColor = "greenyellow";
        }
        loadBar.style.width = num * (bar_W / 100) + 'px';
        progressNum.innerText = num + "%";
    }
}

function loadAnimation(loadWrapper){
    loadWrapper.style.display = "none";
    loadWrapper.previousElementSibling.style.display = "flex";
}

/**
 * 上传文件
 * @param {JSON} data
 */
function uploadFile(data){
    const xhr = new XMLHttpRequest();
    var elems = {
        div: createElem("div", '', 'loadWrapper'),
        describe: createElem("span", '正在上传...', 'describe'),
        progressNum: createElem("span", '0%', ".progressNum"),
        loadBox: createElem("div", '', 'loadBox'),
        loadBar: createElem("div", '', 'loadBar')
    }
    xhr.upload.addEventListener("progress",function(e){
        progressAnimation.call(this,e,elems);
    },false);
    xhr.upload.addEventListener("load",function(){
        loadAnimation.call(this,elems.div);
    },false);
    var result = ajax(xhr, "POST", "/file.php", data);

    result.then((data) => console.log(data));
}

/**
 * 展示预览图
 * @param {string} imgURL
 */
function createImage(imgURL){
    var div = document.createElement("div"),
        box = document.createElement("div"),
        img = document.createElement("img");
    div.classList.add("imgWrapper");
    box.classList.add("imgBox");

    img.src = imgURL;
    box.appendChild(img);
    div.appendChild(box);

    img.onload = function(){
        if(img.height < img.width || img.height === img.width)
            img.style.height = "100%";
        else
            img.style.width = "100%";
    }
    imgsBox.insertBefore(div,dropBox);
    div.style.display = "none";
}
```

CSS 展示文件上传进度
```css
.loadWrapper{
    height: 100px;
    width: 100px;
    background: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px solid #cccccc;
    border-radius: 6px;
}
.loadWrapper .describe{
    color: #999999;
}
.loadWrapper .progressNum{
    color: orangered;
    font-weight: bold;
}
.loadWrapper .loadBox{
    width: 80px;
    height: 10px;
    border-radius: 5px;
    border: 1px solid #cccccc;
    margin: 6px 0px;
    box-sizing: border-box;
    overflow: hidden;
}
.loadWrapper .loadBox .loadBar{
    width: 0px;
    height: 20px;
    background: green;
}
```

### 使用 FormData 实现文件上传

`FormData` 是 HTML5 的一个 API。下面就是使用 `FormData` 进行提交表单的例子。
```html
<body>

    <form id="form" enctype="multipart/form-data" method="POST" action="/form.php">

        name: <input required class="name-ipt" name="name" type="text"><br />
        password: <input required class="psd-ipt" name="password" type="password"><br />
        <button class="submitBtn" type="submit">submit</button>

    </form>

    <script>
        const form = document.getElementById("form");
        const submitBtn = document.getElementsByClassName("submitBtn")[0];

        // 把 from 表单元素传给 FormData 类
        const formData = new FormData(form);

        function ajax(xhr, method = "GET", url, data = "", headers = {}) {
            return new Promise((resolve, reject) => {
                xhr.open(method, url);
                xhr.onreadystatechange = function () {
                    if (this.readyState === 4) {
                        if (this.status === 200 || this.status === 304) {
                            resolve(this.response);
                        }else{
                            reject("Warnning!",this.status);
                        }
                    }
                }
                for(let p in headers){
                    xhr.setRequestHeader(p,headers[p]);
                }
                xhr.send(data);
            });
        }

        submitBtn.addEventListener("click", async function (e) {

            const xhr = new XMLHttpRequest();
            var res = await ajax(
                xhr,
                "POST",
                form.action,
                // 发送的数据是得到的 FormData 实例 
                formData
            );
            console.log(res);
        }, false);

    </script>

</body>
```

`FormData` 实例是一个 Map。里面有 `append`、`delete`、`has` 等方法。

需要注意的是，使用 `FormData` 时，form 元素应增加一个属性：`enctype="multipart/form-data"`。不添加的话，生成的数据是 `key=value` 形式的数据，而且当有 file input 时，文件内容不会被上传。  

如果不使用 form 元素进行包裹，可以使用 `formData.append()` 方法进行添加数据。`append()`方法接收两个参数，第一个参数是数据，可以是一个字符串，也可以是 blob 对象，file 数据就属于 blob。第二个参数是可选的，表示数据的文件名，是一个字符串。
```js
const formData = new FormData();

const file = document.getElementById("file-ipt");

formData.append(file.files[0]);     // 添加数据
```
