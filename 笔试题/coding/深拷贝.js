
function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}

function isBoradObj(obj) {
    return typeof obj === 'object' && obj !== null;
}

function isArray(ary) {
    return Array.isArray(ary);
}

function deepClone(target) {
    let map = new WeakMap();

    function clone(target) {
        if(isBoradObj(target)) {
            let result = isArray(target) ? [] : {};

            if(map.get(target)) {
                return map.get(target);
            }

            map.set(target, result);
            for(let key in target) {
                result[key] = clone(target[key]);
            }
            return result;
        } else {
            return target;
        }
    }

    return clone(target);
}

const aa = {};

const obj = {
    a: [1, 2, 3],
    b: {
        c: 'qwe',
        d: aa,
        e: {
            f: aa,
            g: ['a', 'b']
        }
    },
    d: 'hello'
};

const cloneObj = deepClone(obj);

console.log(cloneObj.b.e === obj.b.e);
console.log(cloneObj.b.e.g === obj.b.e.g);

console.log(cloneObj.b.d === cloneObj.b.e.f);
