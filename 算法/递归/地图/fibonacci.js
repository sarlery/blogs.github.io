// 输入一个数字，看看这个数字是不是斐波那契数列的一项
// 是就返回索引值，不是返回 -1

function findIdx(num){
    if(num === 1)   return 0;
    var idx = 2, 
        first = 1,
        second = 1,
        third = 0;
    while(true){
        third = first + second;
        if(third === num)   return idx;
        if(third > num)     return -1;
        first = second;
        second = third;
        idx += 1;
    }
}

function fib(n){
    if(n === 0 || n === 1){
        return 1;
    }
    return fib(n - 1) + fib(n - 2);
}

function fibonacci(n){
    if(n === 1)     return 1;
    var first = 1, second = 1,third = 0;
    while(-- n){
        third = first + second;
        first = second;
        second = third;
    }
    return third;
}

// console.log(fibonacci(10), fib(10), fib2(10));

function fib2(n){  
    var arr = [1, 1];
    for(let i = 2;i <= n;i ++){
        arr[i] = arr[i - 1] + arr[i - 2];
    }
    return arr;
}

console.log(fib2(20));