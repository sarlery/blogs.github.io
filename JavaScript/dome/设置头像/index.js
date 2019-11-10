(function(){

    const mask = document.querySelector(".mask");
    const sctBox = mask.querySelector(".box");
    const closeBtn = mask.querySelector(".close");
    const fileIpt = document.getElementById("file-ipt");

    const imgBox = document.querySelector(".imgBox");
    const headerPic = document.querySelector("img.header-img");

    const edit = document.querySelector(".edit");
    const options = document.querySelector(".options");

    const dots = sctBox.children;

    dots[0].addEventListener('mousedown',function(e){
        let sx = sctBox.offsetLeft,
            sy = sctBox.offsetTop;

        let leftLimit = imgBox.offsetWidth - sctBox.clientWidth,
            topLimit = imgBox.offsetHeight - sctBox.clientHeight;

        sctBox.onmousemove = function(e){
            sctBox.style.left = e.offsetX + sx + 'px';
            sctBox.style.top = e.offsetY + sy + 'px';

            let disX = sx - e.offsetX,
                disY = sy - e.offsetY;
            
            if(disX >= leftLimit){
                disX = leftLimit;
            }else if(disX <= 0){
                disX = 0;
            }
    
            if(disY >= topLimit){
                disY = topLimit;
            }else if(disY <= 0){
                disY = 0;
            }

            sctBox.style.width = sctBox.offsetWidth + e.offsetX + 'px';
            sctBox.style.height = sctBox.offsetHeight + e.offsetY + 'px';
        }

        sctBox.addEventListener("mouseup",function(){
            sctBox.onmousemove = null;
        },false);
        
    },false);

    fileIpt.addEventListener("change",iptChange,false);

    function iptChange(){
        mask.style.display = "block";
        var file = this.files[0],
            imgUrl = URL.createObjectURL(file);

        const bigImg = new Image();
        bigImg.src = imgUrl;

        bigImg.classList.add("bigImg");

        var loading = document.createTextNode("Loading...");
        imgBox.insertBefore(loading,sctBox);
        imgBox.appendChild(bigImg);

        bigImg.onload = function(){
            imgBox.removeChild(loading);
            URL.revokeObjectURL(imgUrl);
            createShadowArea(this);
        }
    }

    function createShadowArea(img){
        const img_w = img.width;
        const img_h = img.height;

        if(img_w >= img_h){
            sctBox.style.width = img_h + 'px';
            sctBox.style.height = img_h + 'px';
            sctBox.style.top = '0px';
            sctBox.style.left = imgBox.offsetWidth / 2 - sctBox.offsetWidth / 2 + 'px';
        }else{
            sctBox.style.height = img_w + 'px';
            sctBox.style.width = img_w + 'px';
            sctBox.style.left = '0px';
            sctBox.style.top = imgBox.offsetHeight / 2 - sctBox.offsetHeight / 2 + 'px';
        }
    }

    function createNewFileIpt(){
        let fileIpt = document.getElementById("file-ipt");
        fileIpt.removeEventListener("change",iptChange,false);
        options.removeChild(fileIpt);
        var ipt = document.createElement("input");
        ipt.type = "file";
        ipt.accept = ".jpg,.jpeg,.png,.gif";
        ipt.name = "file";
        ipt.id = "file-ipt";
        ipt.style.display = "none";
        options.appendChild(ipt);
        ipt.addEventListener("change",iptChange,false);
    }

    document.addEventListener("click",function(e){
        if(e.target === edit || e.target === headerPic){
            options.style.display = options.style.display === "block" ? "none" : "block";
        }else{
            options.style.display = "none";
        }

        if(e.target === closeBtn){
            imgBox.removeChild(document.querySelector("img.bigImg"));
            mask.style.display = "none";
            
            createNewFileIpt();
        }
    },false);

    sctBox.onmousedown = function(e){
        let ox = e.offsetX,
            oy = e.offsetY;

        let leftLimit = imgBox.offsetWidth - sctBox.clientWidth,
            topLimit = imgBox.offsetHeight - sctBox.clientHeight;

        imgBox.onmousemove = function(e){
            let disX = e.offsetX - ox + sctBox.offsetLeft,
                disY = e.offsetY - oy + sctBox.offsetTop;
    
            if(disX >= leftLimit){
                disX = leftLimit;
            }else if(disX <= 0){
                disX = 0;
            }
    
            if(disY >= topLimit){
                disY = topLimit;
            }else if(disY <= 0){
                disY = 0;
            }

            sctBox.style.left = disX + 'px';
            sctBox.style.top = disY + 'px';
        }

        imgBox.onmouseup = function(){
            imgBox.onmousemove = null;
        }
    }

})();