const color = require('colors');

color.setTheme({
    err: 'red',
    ok: 'green',
    warn: 'yellow'
});

console.log("TypeError: xxxx".err);
console.log("OK,this is right!: xxxx".ok);
console.log("Warn!You'd better not do that.: xxxx".warn);