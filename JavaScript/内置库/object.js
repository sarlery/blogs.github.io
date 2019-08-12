
var obj = {
    a: 1,
    b: "2",
    e: function(){
        console.log(obj.a);
    },
    c: [obj.a,obj.b]
}

console.log(obj.c);