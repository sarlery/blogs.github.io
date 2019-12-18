// async function fn(a,...b){
//     return a + b.reduce((pre,cur) => {
//         return pre + cur;
//     });
// }

// function * func(){
//     yield "OK!";
//     var res = yield fn(1,2,3,4,5);

//     return res;
// } 

import webpackJpg from "./webpack.png";

let img = new Image();

img.src = webpackJpg;

img.onload = function(){
    alert(img.src);
}

document.body.appendChild(img);

/**
 * 发布-订阅模式
 */
class Event{
    constructor(){
        this.events = {};
        this.onceEvents = {};
    }
    on(type,fn){
        this.events[type] = fn;
    }
    emit(type,...args){
        if(this.events[type]){
            return this.events[type].apply(this,args);
        }
        var res = this.onceEvents[type].apply(this,args);
        delete this.onceEvents[type];
        return res;
    }
    once(type,fn){
        this.onceEvents[type] = fn;
    }
    remove(type){
        delete this.events[type];
    }
};