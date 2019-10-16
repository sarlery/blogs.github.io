function add(a, b) {
    a = Number(a);
    b = Number(b);
    debugger;
    var c = a + b;
    return c;
}

function init(){
    let h1 = document.createElement("h1");
    h1.innerText = `数字是：${add("2","2")}`;
    document.body.appendChild(h1);
}

init();
