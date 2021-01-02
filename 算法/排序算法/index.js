/**
 *
 * @param {Array} array
 * @return {Array}
 */
function quickSort(array) {
    /**
     *
     * @param {number} left
     * @param {number} right
     */
    function sort(left, right) {
        let l = left, r = right, pivot = array[r];

        while(l < r){
            while(l < r && array[l] <= pivot)    l ++;
            array[r] = array[l];
            while(l < r && array[r] >= pivot)    r --;
            array[l] = array[r];
        }
        array[l] = pivot;
        sort(left, l - 1);
        sort(l + 1, right);
    }
    sort(0, array.length - 1);
    return array;
}

// test:
const arr = [2, 6, 4, 3, 1, 5, 4];
const result = quickSort(arr);
console.log(result);



