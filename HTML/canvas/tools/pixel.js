const imageProcessing = {

    /**
     * 传入图片像素对象，返回高斯模糊后的图片像素对象
     * @param {object} imgData 
     */
    gaussBlur: function (imgData) {
        var pixes = imgData.data;
        var width = imgData.width;
        var height = imgData.height;
        // 高斯模糊矩阵
        var gaussMatrix = [],
            gaussSum = 0,
            x, y,
            r, g, b, a,
            i, j, k, len;

        var radius = 10;
        var sigma = 5;

        a = 1 / (Math.sqrt(2 * Math.PI) * sigma);
        b = -1 / (2 * sigma * sigma);
        //生成高斯矩阵
        for (i = 0, x = -radius; x <= radius; x++, i++) {
            g = a * Math.exp(b * x * x);
            gaussMatrix[i] = g;
            gaussSum += g;

        }
        //归一化, 保证高斯矩阵的值在[0,1]之间
        for (i = 0, len = gaussMatrix.length; i < len; i++) {
            gaussMatrix[i] /= gaussSum;
        }
        //x 方向一维高斯运算
        for (y = 0; y < height; y++) {
            for (x = 0; x < width; x++) {
                r = g = b = a = 0;
                gaussSum = 0;
                for (j = -radius; j <= radius; j++) {
                    k = x + j;
                    if (k >= 0 && k < width) { //确保 k 没超出 x 的范围
                        //r,g,b,a 四个一组
                        i = (y * width + k) * 4;
                        r += pixes[i] * gaussMatrix[j + radius];
                        g += pixes[i + 1] * gaussMatrix[j + radius];
                        b += pixes[i + 2] * gaussMatrix[j + radius];
                        // a += pixes[i + 3] * gaussMatrix[j];
                        gaussSum += gaussMatrix[j + radius];
                    }
                }
                i = (y * width + x) * 4;
                // 除以 gaussSum 是为了消除处于边缘的像素, 高斯运算不足的问题
                // console.log(gaussSum)
                pixes[i] = r / gaussSum;
                pixes[i + 1] = g / gaussSum;
                pixes[i + 2] = b / gaussSum;
                // pixes[i + 3] = a ;
            }
        }
        //y 方向一维高斯运算
        for (x = 0; x < width; x++) {
            for (y = 0; y < height; y++) {
                r = g = b = a = 0;
                gaussSum = 0;
                for (j = -radius; j <= radius; j++) {
                    k = y + j;
                    if (k >= 0 && k < height) { //确保 k 没超出 y 的范围
                        i = (k * width + x) * 4;
                        r += pixes[i] * gaussMatrix[j + radius];
                        g += pixes[i + 1] * gaussMatrix[j + radius];
                        b += pixes[i + 2] * gaussMatrix[j + radius];
                        // a += pixes[i + 3] * gaussMatrix[j];
                        gaussSum += gaussMatrix[j + radius];
                    }
                }
                i = (y * width + x) * 4;
                pixes[i] = r / gaussSum;
                pixes[i + 1] = g / gaussSum;
                pixes[i + 2] = b / gaussSum;
            }
        }
        return imgData;
    },

    getXY(obj,x,y){
        var w = obj.width,
            data = obj.data,
            color = [];
        color[0] = data[4 * (y * w + x)];
        color[1] = data[4 * (y * w + x) + 1];
        color[2] = data[4 * (y * w + x) + 2];
        color[3] = data[4 * (y * w + x) + 3];
        return color;
    },

    setXY(obj,x,y,color){
        var w = obj.width,
            data = obj.data;
        data[4 * (y * w + x)] = color[0];
        data[4 * (y * w + x) + 1] = color[1];
        data[4 * (y * w + x) + 2] = color[2];
        data[4 * (y * w + x) + 3] = color[3];
    },

    mosaic(imageData){
        const num = 10;

        var stepW = imageData.width / num,
            stepH = imageData.height / num;

        for (let i = 0; i < stepH; i++) {
            for (let j = 0; j < stepW; j++) {
                var color = this.getXY(
                    imageData,
                    j * num + Math.floor(Math.random() * num),
                    i * num + Math.floor(Math.random() * num)
                );
                for (let k = 0; k < num; k++) {
                    for (let l = 0; l < num; l++) {
                        this.setXY(
                            imageData,
                            j * num + l,
                            i * num + k,
                            color
                        );
                    }
                }
            }
        }

        return imageData;
    },

    grayscale (imageData) {

        var data = imageData.data,
            len = data.length;

        for (var i = 0; i < len; i += 4) {
            var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg; // red
            data[i + 1] = avg; // green
            data[i + 2] = avg; // blue
        }
        return imageData;
    },

    deepBlack(imageData){
        var data = imageData.data,
            len = data.length;

        for (var i = 0; i < len; i += 4) {
            var avg = (data[i] + data[i + 1] + data[i + 2]) / 3,
                res = avg >= 128 ? 255 : 0;
            data[i] = res; // red
            data[i + 1] = res; // green
            data[i + 2] = res; // blue
        }
        return imageData;
    }

};
