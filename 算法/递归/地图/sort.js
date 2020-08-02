function exchange(array, left, right){
    var temp = array[left];
    array[left] = array[right];
    array[right] = temp;
}

// 冒泡排序
function bubbleSort(array){
    let len = array.length;
    for(let i = 0;i < len;i ++){
        for(let j = 0;j < len - i;j ++){
            if(array[j] > array[j + 1]){
                exchange(array, j, j + 1);
            }
        }
    }
    return array;
}

// test:
var arr = [2,7,4,1,5,3,1,4,6];
// console.log(bubbleSort(arr));


// 选择排序（选择出最小的排到数组前面）
function selectSort(array){
    var len = array.length, minIdx;
    for(let i = 0;i < len - 1;i ++){
        minIdx = i;
        for(let j = i + 1;j < len;j ++){
            if(array[minIdx] > array[j]){
                minIdx = j;
            }
        }
        if(minIdx !== i)    exchange(array, minIdx, i);
    }
    return array;
}

// console.log(selectSort(arr));


// 插入排序（以数组第一项为参照，比第一项小的值往左推移）
function insertSort(array){
    var len = array.length, temp;
    for(let i = 1;i < len;i ++){
        temp = array[i];
        var j = i;
        while(j > 0 && array[j - 1] > temp){
            array[j] = array[j - 1];
            j -= 1;
        }
        array[j] = temp;
    }
    return array;
}

// console.log(insertSort([2,7,4,1,5,3,1,4,6]));

// 快速排序

function quickSort(array){
    function sort(array, left, right){
        if(left >= right)   return;
        var pivot = array[right];
        var l = left, r = right;
        while(l < r){
            while(l < r && array[l] <= pivot)   l ++;
            array[r] = array[l];
            while(r > l && array[r] >= pivot)   r --;
            array[l] = array[r];
        }
        array[l] = pivot;
        sort(array, left, l - 1);
        sort(array, l + 1, right);
    }
    sort(array, 0, array.length - 1);
    return array;
}

const ary = [6,3,5,2,7,1,4,6];

// console.log(quickSort(ary));


function mergeSort(array){
    var len = array.length;
    if(len > 1){
        const mid = Math.floor(len / 2);
        const left = mergeSort(array.slice(0, mid));
        const right = mergeSort(array.slice(mid, len));
        array = merge(left, right);
    }
    function merge(l, r){
        let i = 0,j = 0;
        const result = [];
        while(i < l.length && j < r.lenght){
            result.push(
                l[i] < r[j] ? l[i ++] : r[j ++]
            );
        }
        return result.concat(i < l.length ? l.slice(i) : r.slice(j));
    }
    return array;
}