const imgBox = document.querySelector(".imgBox");
const fileIpt = document.getElementById("file-ipt");

const invertBtn = document.querySelector(".invertBtn");
const grayscaleBtn = document.querySelector(".grayscaleBtn");
const ancientBtn = document.querySelector(".ancientBtn");

const showView = document.querySelector(".showView");

fileIpt.onchange = function(){
    // 把获得的图片文件生成预览图（原图）
    createImg(this.files[0]);
}

/**
 * 图片预览
 * @param {File} file
 */
function createImg(file){

    var oldFile = imgBox.children;

    if(oldFile.length)
        imgBox.removeChild(oldFile[0]);

    var image = new Image(),
        reader = new FileReader(),
        box_W = imgBox.clientWidth,
        box_H = imgBox.clientHeight;

    image.onload = function(){
        if(image.width >= image.height)
            image.style.height = box_H + 'px';
        else
            image.style.width = box_W + 'px';

        initCanvas(this);
    }

    reader.readAsDataURL(file);
    reader.onload = function(e){
        image.src = e.target.result;
    }
    imgBox.appendChild(image);
}

/**
 *
 * @param {Image} img
 */
function initStyle(img){
    const myCvs = document.getElementById("myCvs");
    if (myCvs) {
        showView.removeChild(myCvs);
    }

    const cvs = document.createElement("canvas");
    cvs.id = "myCvs";
    showView.appendChild(cvs);
    const ctx = cvs.getContext("2d");

    cvs.height = 400;
    cvs.width = 400;

    if (img.width >= img.height) {
        ctx.scale(img.width / 400, 1);
        ctx.drawImage(img, 0, 0, cvs.width, cvs.height);
    } else {
        ctx.scale(1, img.height / 400);
        ctx.drawImage(img, 0, 0, cvs.width, cvs.height);
    }
    return {cvs,ctx};
}

/**
 * canvas 初始化
 * @param {Image} img
 */
function initCanvas(img){

    const {cvs, ctx} = initStyle(img);

    var imageData = ctx.getImageData(0, 0, cvs.width, cvs.height),
        data = imageData.data,
        len = data.length;

    /**
     * 色彩反转
     */
    function invert() {

        for (var i = 0; i < len; i += 4) {
            data[i] = 255 - data[i]; // red
            data[i + 1] = 255 - data[i + 1]; // green
            data[i + 2] = 255 - data[i + 2]; // blue
        }
        ctx.putImageData(imageData, 0, 0);
    }

    /**
     * 黑白照片
     */
    function grayscale() {

        for (var i = 0; i < len; i += 4) {
            var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg; // red
            data[i + 1] = avg; // green
            data[i + 2] = avg; // blue
        }
        ctx.putImageData(imageData, 0, 0);
    }

    /**
     * 复古样式
     */
    function ancient(){
        for(let i = 0;i < len;i += 4){
            let r = data[i],
                g = data[i + 1],
                b = data[i + 2];
            data[i] = r * 0.39 + g * 0.76 + b * 0.18;
            data[i + 1] = r * 0.35 + g * 0.68 + b * 0.16;
            data[i + 2] = r * 0.27 + g * 0.35 + b * 0.13;
        }

        ctx.putImageData(imageData,0,0);
    }

    /**
     * 红色蒙版
     */
    function redMask(){
        for(let i = 0;i < len;i += 4){
            let sum = 0;
            for(let j = 0;j < 3;j ++){
                sum += data[i + j];
            }
            var avg = sum / 3;
            data[i] = avg;      // 红色是平均值
            // 绿色和蓝色都设为零
            data[i + 1] = data[i + 2] = 0;
        }
        ctx.putImageData(imageData, 0, 0);
    }

    /**
     * 亮度处理
     * @param {Event} e
     * @param {number} degree
     */
    function brightness(e,degree){
        for(let i = 0;i < len;i += 4){
            data[i] = data[i] + degree >= 255 ? data[i] : data[i] + degree;
            data[i + 1] = data[i + 1] + degree >= 255 ? data[i + 1] : data[i + 1] + degree;
            data[i + 2] = data[i + 2] + degree >= 255 ? data[i + 2] : data[i + 2] + degree;
        }
        ctx.putImageData(imageData,0,0);
    }

    /**
     * 透明度处理
     * @param {Event} e
     * @param {number} n - number 应该在 0 ~ 1 之间
     */
    function pellucidity(e,n){
        for(let i = 0;i < len;i += 4){
            data[i + 3] *= n;
        }
        ctx.putImageData(imageData, 0, 0);
    }

    /**
     * 得到随机的颜色
     * @param {ImageData} obj 
     * @param {number} x 
     * @param {number} y 
     */
    function getXY(obj,x,y){
        var w = obj.width,
            data = obj.data,
            color = [];
        color[0] = data[4 * (y * w + x)];
        color[1] = data[4 * (y * w + x) + 1];
        color[2] = data[4 * (y * w + x) + 2];
        color[3] = data[4 * (y * w + x) + 3];
        return color;
    }

    /**
     * 设置颜色
     * @param {ImageData} obj 
     * @param {number} x 
     * @param {number} y 
     * @param {Array} color 
     */
    function setXY(obj,x,y,color){
        var w = obj.width,
            data = obj.data;
        data[4 * (y * w + x)] = color[0];
        data[4 * (y * w + x) + 1] = color[1];
        data[4 * (y * w + x) + 2] = color[2];
        data[4 * (y * w + x) + 3] = color[3];
    }

    /**
     * 马赛克效果
     * @param {Event} e 
     * @param {number} num 
     */
    function mosaic(e,num){
        var stepW = cvs.width / num,
            stepH = cvs.height / num;

        debugger;
        
        for(let i = 0;i < stepH;i ++){
            for(let j = 0;j < stepW;j ++){
                var color = getXY(
                    imageData,
                    j * num + Math.floor(Math.random() * num),
                    i * num + Math.floor(Math.random() * num)
                )
                for(let k = 0;k < num;k ++){
                    for(let l = 0;l < num;l ++){
                        setXY(
                            imageData,
                            j * num + l,
                            i * num + k,
                            color
                        )
                    }
                }
            }
        }
        ctx.putImageData(imageData,0,0);
    }

    document.querySelector(".aboriginal").addEventListener('click',function(){
        createImg(fileIpt.files[0]);
    },false);   

    invertBtn.addEventListener("click", invert, false);
    grayscaleBtn.addEventListener("click", grayscale, false);
    ancientBtn.addEventListener('click',ancient,false);
    document.querySelector(".redMaskBtn").addEventListener("click",redMask,false);

    document.querySelector(".brightnessBtn").addEventListener("click", function(e){
        brightness.call(this,e,-50);
    }, false);

    document.querySelector(".pellucidityBtn").addEventListener("click", function (e) {
        pellucidity.call(this,e,0.2);
    },false);

    document.querySelector(".mosaicBtn").addEventListener('click',function(e){
        mosaic.call(this,e,6);
    },false);
}

