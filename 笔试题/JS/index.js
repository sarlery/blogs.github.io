let obj = [
    { a: 1 },
    { a: 3 },
    { a: 6 },
    { a: 2 },
    { a: 4 }
];

obj.sort((x, y) => {
    return x.a - y.a;
});

console.log(obj);