const array = [
    {name: 'x',age: 18},
    {name: 'y',age: 20},
    {name: 'z',age: 19}
];

var key = 'name';

function remove(){
    var bool = false;
    for(let p of array){
        console.log(p);
        if(key in p){
            bool = true;
        }
    }
    return bool;
}

console.log(remove());
