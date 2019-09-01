// import io from 'socket.io';
// const ipt = document.querySelector('#ipt-msg');
// const submit = document.querySelector('.submit');
// const msgBox = document.querySelector('.msgBox');
// const title = document.querySelector('.title');

// var nickName = window.prompt("请输入一个昵称：");
// while (!nickName.replace(/\s/g, '') || nickName.length >= 12) {
//     alert("昵称长度不能长于12，也不能只有空白哦~")
//     nickName = window.prompt("请输入一个昵称：");
// }
// var id = +new Date();

// title.innerText = "欢迎：" + nickName;

// submit.onclick = function () {
//     const value = ipt.value;
//     if (value) {
//         groupSending(value);
//         // createBubble(value);
//         ipt.value = "";
//     }
// }

// function groupSending(value) {
//     const socket = io('http://localhost');

//     socket.emit('message', JSON.stringify({
//         id,
//         nickName,
//         msg: value
//     }));
//     socket.on('message', function (data) {
//         console.log(data);
//     })
// }

// function createBubble(value) {
//     var bubble = document.createElement('span');
//     bubble.innerText = value;
//     bubble.classList.add('bubble');
//     msgBox.appendChild(bubble);
// }
