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
 * @param {JSON | ArrayBuffer | Blob} data
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
 * 展示缩略图
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

/**
 * 处理文件对象
 * @param {File} file
 */
function handleFiles(file){
    var formData = new FormData(),
        imgURL = window.URL.createObjectURL(file);
    createImage(imgURL);
    formData.append("name",file.name);
    // formData.append("fileData",file);
    uploadFile(formData);
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

dropBox.addEventListener("click",function(){
    if(fileIpt){
        fileIpt.click();
    }
},false);

/**
 * 阻制默认事件产生
 * @param {Event} e
 */
function drag(e) {
    e.stopPropagation();
    e.preventDefault();
}

/**
 * 处理 drop 事件
 * @param {Event} e
 */
function drop(e) {
    drag(e);

    var dt = e.dataTransfer,
        files = dt.files;
    handleFiles(files);
}

fileIpt.addEventListener("change",fileChange,false);

dropBox.addEventListener("dragenter", drag, false);
dropBox.addEventListener("dragover", drag, false);
dropBox.addEventListener("drop", drop, false);
