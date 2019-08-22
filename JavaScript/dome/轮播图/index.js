/**
 * 
 * @param {Object} config - the config is an object
 * 
 * @author WangMinghui
 * 
 */
function Carousel(config) {

    // 获得展示窗口的宽度
    if (!config.width || typeof config.width !== 'number') {
        throw new TypeError('The config.width must be a number,and it is not equal to zero');
    }
    this.width = config.width;
    // 定时器
    this.timer = null;

    // 动画过渡事件
    this.delay = config.delay || 6000;
    // 图片切换时的延时（延时可能是 0，就是没有过渡）
    this.transition = config.transition ?
        (typeof config.transition === 'number' ? config.transition : 0.6) :
        (config.transition === 0 ? 0 : 0.6);

    /**
     * 得到展示窗口容器元素
     * 尽量设置，因为使用 querySelector 时
     * 只会获取到第一个，而当页面有多个轮播图时
     * 可能会失控
     */
    const targetClient = config.target || document.querySelector('.carousel');

    // 得到图片容器元素 
    this.imgBox = targetClient.querySelector('.img-box');
    // 得到图片个数
    this.imgsLen = this.imgBox.children.length;

    this.init(targetClient);

}

/**
 * 
 * @param {Object} target - the target is a document Element
 */
Carousel.prototype.init = function (target) {

    const broadside = target.querySelectorAll('.broadside');
    const pointsBox = target.querySelector('.points-box');

    // 算出 imgBox 的长度
    this.imgBox.style.width = this.width * this.imgsLen + 'px';
    // 让 imgBox 的 left 初始值变为 -width，即：画面上展示的第一张图片
    this.imgBox.style.left = -this.width + 'px';

    // 这是运动到最右侧图片的 left 值（假如总宽度是 3600，则运动到最右侧时 left = -3000px）
    // 运动到最左侧时就是 0px
    this.leftLimit = -(this.width * (this.imgsLen - 1));
    // 这个是运动到最后一张图时，瞬间切换到第二张图片：
    this.firstBackTo = -this.width;
    // 当到达第一张图时，瞬间切换到倒数第二张图片：
    this.lastBackTo = this.leftLimit + this.width;

        // 以上都做完之后，则开始让 imgBox 动起来
    this.sport();
        // 鼠标拖拽时，会翻页
    this.slide(target);

    if (broadside.length) {
        // 有的话就为他们注册事件
        this.bindSideClick(broadside);
    };
    if (pointsBox && pointsBox.children.length) {
        this.pointsBox = pointsBox;
        // 这个是记录当前选中的是哪一个 point 
        this.selectedPointIndex = 0;
        // 默认让第一个元素是选中的状态
        pointsBox.children[0].classList.add('selected');
        // 有的话就注册事件
        this.bindPoints(pointsBox.children);
    };
}

Carousel.prototype.slide = function(target){

    const that = this;
    const imgHarf = that.width / 3;
    const imgBox = that.imgBox;

    var start = 0,
        end = 0,
        middle = 0,
        res = 0;
    var original = parseInt(imgBox.style.left);

    target.onmousedown = function(e){
        // e.stopPropagation();
        e.preventDefault();
        clearInterval(that.timer);
        start = e.offsetX;

        document.onmousemove = function (e) {
            middle = e.offsetX;
            res = middle - start;
            imgBox.style.left = parseInt(imgBox.style.left) + res + 'px';
            // console.log(imgBox.style.left,res);
            start = middle;
        }

        document.onmouseup = function () {
            document.onmousemove = null;
            end = parseInt(imgBox.style.left);

            imgBox.style.left = original + 'px';

            if (end - original >= imgHarf) {
                that.move(that,true);
                // that.timer = setInterval(that.move.bind(that, that, true), that.delay);
            } else if (end - original <= -(imgHarf)) {
                that.move(that,false);
                // that.timer = setInterval(that.move.bind(that, that, false), that.delay);
            } else {
                that.sport();
            }
            document.onmouseup = null;
        }
    }
}

Carousel.prototype.bindPoints = function (points) {
    const len = points.length;
    const {
        imgBox,
        width
    } = this;
    const that = this;
    for (let k = 0; k < len; k++) {
        points[k].onclick = function () {
            clearInterval(that.timer);
            points[that.selectedPointIndex].classList.remove('selected');
            points[k].classList.add('selected');
            imgBox.style.transition = 'none';
                /**
                 * 因为 第一张图是 -width，而 k 是从零开始的，因此要加一
                 */
            imgBox.style.left = -(k + 1) * width + 'px';
            that.selectedPointIndex = k;
                // 完事之后别忘了更新 selectedPointIndex，
                // 然后还要再次挂上计时器
            that.timer = setInterval(that.move.bind(that, that, true), that.delay);
        }
    }
}

Carousel.prototype.bindSideClick = function (elems) {
    const leftBtn = elems[0];
    const rightBtn = elems[1];
    const that = this;

    leftBtn.onclick = function () {
        clearInterval(that.timer);
        that.move.call(that, that, true);
    }
    rightBtn.onclick = function () {
        clearInterval(that.timer);
        that.move.call(that, that, false);
    };
}

Carousel.prototype.sport = function () {
    // 这里别忘了绑定 this，把 this 传进去，因为有一些参数需要用到
    this.timer = setInterval(this.move.bind(this, this, true), this.delay);
}

/**
 * 这个函数会接受一个布尔类型的 参数
 * @param {boolean} bool
 * 该参数用来判断是向左运动还是向右运动
 * 从而达到代码解耦的
 */
Carousel.prototype.move = function (that, bool = true) {
    clearInterval(that.timer);
    // 总之，这些值是会用到的，而且不会改变
    const {
        imgBox, // 图片容器
        firstBackTo, // 返回到第二张图片
        lastBackTo, // 返回到 倒数第二张图片
        leftLimit,
        width,
        transition,
        changePoint,  // 这个是展示 下部 point 的变化
        setTime, // 拆分出的用作延时的函数
    } = that;

    if (typeof that.selectedPointIndex === 'number') {
        changePoint(that,bool);
    }

    var temp = parseInt(imgBox.style.left);
    if (bool) {
        if (temp <= leftLimit + width) {
            // 如果运动到最后一张图时，瞬间切换到第二张图片：
            imgBox.style.left = leftLimit + 'px';
            temp = firstBackTo;
            setTime(imgBox, temp);
            imgBox.style.transition = `left ${transition}s ease`;
        } else {
            imgBox.style.left = temp - width + 'px';
            imgBox.style.transition = `left ${transition}s ease`;
        }
    } else {
        if (temp >= firstBackTo) {
            // 让图片移动到 第一张图片
            imgBox.style.left = '0px';
            temp = lastBackTo;
            setTime(imgBox, temp);
            imgBox.style.transition = `left ${transition}s ease`;
        } else {
            imgBox.style.left = temp + width + 'px';
            imgBox.style.transition = `left ${transition}s ease`;
        }
    }
    that.timer = setInterval(that.move.bind(that, that, true), that.delay);
}

Carousel.prototype.setTime = function (elem, temp) {
    var timeout = setTimeout(() => {
        elem.style.transition = 'none';
        elem.style.left = temp + 'px';
        clearTimeout(timeout);
    }, 600);
}


Carousel.prototype.changePoint = function(self,bool){
    var idx = self.selectedPointIndex;
    const { pointsBox } = self;     // 按钮容器
    pointsBox.children[idx].classList.remove('selected');
    // 判断是不是到了最后一个 point：
    if (bool) {
        if (idx === 3) {
            // 这里之所以等于 -1 是因为 下面还会有 ++ 的操作
            idx = -1;
        }
        pointsBox.children[++idx].classList.add('selected');
        self.selectedPointIndex = idx;

    } else {
        if (idx === 0) {
            idx = 4;
        }
        pointsBox.children[--idx].classList.add('selected');
        self.selectedPointIndex = idx;
    }
}















/**
 * 
 * 图片向左移动（默认）
 */
// Carousel.prototype.leftToMove = function(that){
//         // 这里使用了 ES6 解构的语法
//     const { imgBox, pointsBox,  firstBackTo, leftLimit, width, transition } = that;

//     // 判断有没有
//     if(typeof that.selectedPointIndex === 'number'){
//         pointsBox.children[that.selectedPointIndex].classList.remove('selected');

//         // 判断是不是到了最后一个 point：
//         if (that.selectedPointIndex === 3) {
//             // 这里之所以等于 -1 是因为 下面还会有 ++ 的操作
//             that.selectedPointIndex = -1;
//         }

//         pointsBox.children[++that.selectedPointIndex].classList.add('selected');
//     }

//     var temp =  parseInt(imgBox.style.left);
//     if(temp <= leftLimit + width){
//         // 如果运动到最后一张图时，瞬间切换到第二张图片：
//         imgBox.style.left = leftLimit + 'px';
//         temp = firstBackTo;

//         // 弄个定时器，让滚动到最后一张有滚动过渡
//         var timeout = setTimeout(() => {
//             imgBox.style.transition = 'none';
//             imgBox.style.left = temp + 'px';
//             clearTimeout(timeout);
//         },600);
//             // 这里不要忘了 让过渡时间变回来，因为不这样做当点击侧边按钮回退时，
//             // 是不会有过渡效果的
//         imgBox.style.transition = `left ${transition}s ease`;

//     }else{
//         imgBox.style.left = temp - width + 'px';
//         imgBox.style.transition = `left ${transition}s ease`;
//     }
// }

/**
 * 
 * 图片向右移动
 */
// Carousel.prototype.rightToMove = function(that){
//     const {
//         imgBox,
//         pointsBox,
//         firstBackTo,
//         lastBackTo,
//         width,
//         transition
//     } = that;

//     // 判断有没有
//     if (typeof that.selectedPointIndex === 'number') {
//         pointsBox.children[that.selectedPointIndex].classList.remove('selected');

//         // 判断是不是到了最后一个 point：
//         if (that.selectedPointIndex === 0) {
//             // 这里之所以等于 4 是因为 下面还会有 ++ 的操作
//             that.selectedPointIndex = 4;
//         }

//         pointsBox.children[-- that.selectedPointIndex].classList.add('selected');
//     }

//     var temp = parseInt(imgBox.style.left);
//     // 当是 第二张图片时
//     if(temp >= firstBackTo){
//         // 让图片移动到 第一张图片
//         imgBox.style.left = '0px';
//         temp = lastBackTo;
//         // 然后瞬间切换到倒数第二张图
//         // 计时器是为了让切换到第一张图时有过渡效果
//         var timeout = setTimeout(() => {
//             imgBox.style.transition = 'none';
//             imgBox.style.left = temp + 'px';
//             clearTimeout(timeout);
//         }, 600);
//         imgBox.style.transition = `left ${transition}s ease`;
//     }else{
//         imgBox.style.left = temp + width + 'px';
//         imgBox.style.transition = `left ${transition}s ease`;
//     }
// }