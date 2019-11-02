if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js');
}

function $(str){
    return document.querySelector(str);
}

const MSG = 'leaving messages';
const btn = $('.submit');
const msgList = $('ul.msg_list');
const textIpt = $('textarea');
let removeElems = null;

function createElem(elemStr){
    return document.createElement(elemStr);
}

function renderList(arr){
    for(let i = 0,len = arr.length;i < len;i ++){
        createList(arr[i]);
    }
}

function removeList(elem,index){
    msgList.removeChild(elem);
    const data = JSON.parse(localStorage.getItem(MSG));
    data.splice(index,1);
    localStorage.setItem(MSG,JSON.stringify(data));
}


function init(bool){
    const data = JSON.parse(localStorage.getItem(MSG));
    if (data && bool) {
        renderList(data);
    }

    removeElems = document.getElementsByClassName('removePoint');
    for (let i = 0, len = removeElems.length; i < len; i++) {
        removeElems[i].onclick = function () {
            while(!removeElems[i]) i = i - 1; 
            removeList(removeElems[i].parentNode, i);
        }
    }
}

function storeLocal(str){
    let data = JSON.parse(localStorage.getItem(MSG));
    
    if(data){
        data.push(str);
    }else{
        data = [];
        data.push(str);
    }
    localStorage.setItem(MSG,JSON.stringify(data));
}

function createList(str){
    var li = createElem('li');
    li.innerHTML = `${str}
        <span title="删除该条信息" class="removePoint">
            &#215;
        </span>
    `;
    msgList.appendChild(li);
}

btn.onclick = function(){
    var textValue = textIpt.value,
        reg = /\S+/g;
    textIpt.value = '';
    if(textValue){
        if(reg.test(textValue)){
            createList(textValue);
            storeLocal(textValue);
        }
    }

    init(false);
}

init(true);

