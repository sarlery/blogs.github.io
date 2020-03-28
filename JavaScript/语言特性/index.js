function ListNode(val) {
    this.val = val;
    this.next = null;
}
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function (l1, l2) {
    function add(value){
        var node;
        if(value > 9){
            node = new ListNode(value - 10);
            carry = 1;
        }else{
            node = new ListNode(value);
            carry = 0;
        }
        return node;
    }
    function fn(L){
        while(L){
            res = L.val + carry;
            node.next = add(res);
            node = node.next;
            L = L.next;
        }
    }
    var carry = 0;
    var v1 = l1.val;
    var v2 = l2.val;
    var res = v1 + v2;
    var listNode = add(res);
    
    var node = listNode;
    var l1Next = l1.next;
    var l2Next = l2.next;
    while(l1Next && l2Next){
        res = l1Next.val + l2Next.val + carry;
        node.next = add(res);
        node = node.next;
        l1Next = l1Next.next;
        l2Next = l2Next.next;
    }
    fn(l1Next);
    fn(l2Next);
    while(carry){
        node.next = new ListNode(carry);
        carry = 0;
    }
    return listNode;
};


var isPalindrome = function(x) {
    if(x <= 10){
        return false;
    }
    var num = x;
    var a = 1;
    var b = 10;
    var d = 0;
    var c = (num % b) / a;
    var reverse = c;
    while(b < x){
        reverse = reverse * 10 + d * 10;
        num = num - d * a;
        b *= 10;
        a *= 10;
        d = (num % b) / a;
    }
    console.log(reverse);
    reverse += Math.floor(x * 10 / b);
    if(reverse === x){
        return true;
    }
    return false;
};

let bool = isPalindrome(1001);
console.log(bool);





function find(ary, target) {
    var len = ary.length;
    var res = "";
    for (let i = 0; i < len; i++) {
        var a = target - ary[i];
        var idx = ary.indexOf(a);
        if (idx !== -1) {
            res = res + ary[i] + ' ' + a;
            break;
        }
    }
    return res;
}

// console.log(find([1,3,4,6,8], 10));

// 去除括号
function matchBracket(str) {
    var reg = /(\(\)|(\{\})|(\[\]))/g;
    var len = str.length;
    if (len % 2 !== 0) {
        return false;
    }
    var count = len / 2;
    newStr = str;
    while (count) {
        var newStr = newStr.replace(reg, "");
        count -= 1;
    }
    return newStr ? false : true;
}

// console.log(matchBracket("[(){}](){(((((((((((((((((((((((())))))))))))))))))))))))}"));

function fn(n) {
    var cache = [0, 1, 2];

    function _fn(n) {
        if (cache[n]) {
            return cache[n];
        }
        cache[n] = _fn(n - 1) + _fn(n - 2);
        return cache[n];
    }
    return _fn(n);
}

// console.log(fn(3));
