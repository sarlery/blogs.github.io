// 二分查找算法
/**
 * 
 * @param {Array<T>} array 数组
 * @param {T} value 要查找的值
 * @returns {number} 找到的第一个索引
 */
function binarySearch(array, value){
    function search(array, value, left, right){
        if(left > right){       // 数组中没有 value 的情况
            return  -1;
        }
        var mid = Math.floor((left + right) / 2);
        if(array[mid] === value){
            // 如果中间值是 value，就要找一下它前面的元素是不是也是该值
            // 因为要找到第一个符合查找的值
            let idx = mid - 1;
            while(idx >= 0){
                if(array[idx] === value)    idx -= 1;
                else break;
            }
            return idx + 1;
        }
        if(array[mid] > value){
            return search(array, value, left, mid - 1);
        }
        if(array[mid] < value){
            return search(array, value, mid + 1, right);
        }
    }
    return search(array, value, 0, array.length - 1);
}

// 差值查找：适合数组是均匀分布的情况

function interpolationSearch(array, value){
    function search(array, value, left, right){
        if(left > right || value < array[0] || value > array[array.length - 1]){
            return -1;
        }
        let mid = Math.floor(left + (right - left) * (value - array[left]) / (array[right] - array[left]));
        var midVal = array[mid];
        if(midVal === value){
            return mid;
        }
        if(midVal > value){
            return search(array, value, mid + 1, right);
        }
        if(midVal < value){
            return search(array, value, left, mid - 1);
        }
    }

    return search(array, value, 0, array.length - 1);
}

// test:

var arr1 = [1,3,5,7,9,11,13,15,17];

// let idx = interpolationSearch(arr1, 7);
// console.log(idx);

// var arr = [2,2,4,5,6,6,8,11,11];

// let result = binarySearch(arr1, 17);


// 二分查找非递归形式
function binSearch(array, target){
    var left = 0,
        right = array.length - 1;

    while(left <= right){
        var mid = Math.floor((left + right) / 2);
        if(array[mid] === target)   return mid;
        if(array[mid] > target){
            right = mid - 1;
        }
        if(array[mid] < target){
            left = mid + 1;
        }
    }
    return -1;
}

const ary = [1,2];

console.log(binSearch(ary, 2));