const untils = {

    /**
     * 鼠标移动时，获取鼠标相对于目标元素的位置
     * @param {Element} elem 
     */
    captureMouse: function(elem){
        var mouse = {x: 0,y: 0};
        elem.addEventListener('mosuemove',function(e){
            var x,y;
            if(event.pageX || event.pageY){
                x = event.pageX;
                y = event.pageY;
            }else{
                x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                y = event.clientY + document.body.scrollTo + document.documentElement.scrollTop;
            }
            x -= elem.offsetLeft;
            y -= elem.offsetTop;

            mouse.x = x;
            mouse.y = y;
        },false);

        return mouse;
    },
    
    /**
     * 触摸屏幕时，获取鼠标相对于被触摸元素的相对位置
     * @param {Element} elem 
     */
    captureTouch: function(elem){
        var touch = {
            x: null,
            y: null,
            // 判断手指有没有触摸到屏幕上
            isPressed: false
        };

        elem.addEventListener("touchstart",function(event){
            touch.isPressed = true;
        },false);

        elem.addEventListener('touchend',function(event){
            touch.isPressed = false;
            touch.x = null;
            touch.y = null;
        },false);

        elem.addEventListener('touchmove',function(e){
            var x,y,
                touch_event = e.touches[0];     // first touch
            
                if(touch_event.pageX || touch_event.pageY){
                    x = touch_event.pageX;
                    y = touch_event.pageY;
                }else{
                    x = touch_event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                    y = touch_event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
                }

                x -= offsetLeft;
                y -= offsetTop;

                touch.x = x;
                touch.y = y;
        },false);
        return touch;
    }
}