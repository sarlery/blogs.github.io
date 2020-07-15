class HuffNode {
    /**
     * 创建二叉树节点
     * @param {number} value 字符的 ASCII 码值
     * @param {number} weight 权重（字符出现次数）
     */
    constructor(value, weight) {
        this.value = value;
        this.weight = weight;
        this.left = null;
        this.right = null;
    }

    preOrder(callback) {
        callback(this.value, this.weight);
        if (this.left !== null) {
            this.left.preOrder(callback);
        }
        if (this.right !== null) {
            this.right.preOrder(callback);
        }
    }
}

/**
 * 首先，遍历传入的预编码内容
 * 遍历内容，统计各个字符出现的次数（用 Map 统计和存储）
 * 然后遍历 Map，生成二叉树节点，把节点存入数组
 * 对数组排序，生成 Huffman 树
 */
class HuffCode {
    /**
     * 接受字符串数据
     * @param {string} content 
     */
    constructor(content) {
        let map = this.statistic(content);
        let arr = this.createAry(map);
        this.head = this.createTree(arr);
        this.codingTable = this.getCodingTable(this.head);    // 压缩编码表
        this.decodingTable = this.getDecodeTable();     // 解压缩编码表
        this.codeLen = 0;       // 压缩后的二进制字符串位数
        this.encodeData = [];       // 压缩后的二进制数据
    }
    // 统计字符个数
    statistic(content) {
        var map = new Map();
        for (let i = 0; i < content.length; i++) {
            let count = map.get(content[i]);
            count ? map.set(content[i], ++count) : map.set(content[i], 1);
        }
        return map;
    }
    sort(ary) {
        ary.sort((a, b) => b.weight - a.weight);
    }
    createAry(map) {
        var arr = [];
        for (let key of map) {
            arr.push(new HuffNode(key[0].charCodeAt(), key[1]));
        }
        return arr;
    }
    createTree(arr) {
        while (arr.length > 1) {
            this.sort(arr);
            var c1 = arr.pop();
            var c2 = arr.pop();
            // 父节点是没有内容的，只有权重
            var p = new HuffNode(null, c1.weight + c2.weight);
            p.left = c1;
            p.right = c2;
            arr.push(p);
        }
        return arr[0];
    }
    getCodingTable(rootNode) {
        let codeMap = new Map();
        if (rootNode === null) {
            return;
        }
        this.createHuffCodes(rootNode.left, "0", "", codeMap);
        this.createHuffCodes(rootNode.right, "1", "", codeMap);
        return codeMap;
    }
    /**
     * 生成霍夫曼编码二进制字符串
     * @param {HuffNode} rootNode 根节点
     * @param {string} code 0/1
     * @param {Array} codeStr 生成的二进制字符串
     */
    createHuffCodes(rootNode, code, codeStr, codeMap) {
        // 把传入的 code 拼接成字符串（字符串不是引用类型）
        // 每次传过来的 codeStr 相当于一个新的变量
        codeStr += code;
        if (rootNode !== null) {
            // 如果是非叶子节点（叶子节点都是有值的节点），
            if (rootNode.value === null) {
                // 向左递归
                this.createHuffCodes(rootNode.left, "0", codeStr, codeMap);
                // 向右递归
                this.createHuffCodes(rootNode.right, "1", codeStr, codeMap);
            } else {
                // 当是叶子节点时，就把收集到的 codeStr 放入 Map 中
                codeMap.set(rootNode.value, codeStr);
            }
        }
    }

    /**
     * 编码
     * @param {Buffer} buf 传入的数据流
     */
    encode(content) {
        var charStr = "";
        for (let i = 0; i < content.length; i++) {
            charStr += this.codingTable.get(content[i]);
        }
        this.codeLen = charStr.length;      // 编码长度
        // console.log(charStr, charStr.length);
        var len = charStr.length;
        // charStr 不一定是 8 的倍数
        var size = len % 8 === 0 ? len / 8 : Math.ceil(len / 8);
        var charCodeAry = new Int8Array(size); // Int8Array 必须是固定长度
        var idx = 0;
        // 把生成的 charStr 每八位放入数组中
        for (let i = 0; i < charStr.length; i += 8) {
            if (i + 8 > charStr.length) { // 如果长度不是 8 的倍数时，截取剩下的位
                charCodeAry[idx++] = '0b' + charStr.substring(i);
            } else { // 截取八位二进制字符串，转成数字
                charCodeAry[idx++] = '0b' + charStr.substring(i, i + 8);
            }
        }
        this.encodeData = charCodeAry;
        return charCodeAry;
    }

    // 解码 
    decode() {
        // 首先根据编码后的数组，生成编码时的字符串
        var codeStr = "";
        var encodeData = this.encodeData;
        var size = encodeData.length - 1;
        for (let i = 0; i < size; i++) {
            codeStr += signed(encodeData[i], 8);
        }
        // 看看 encodeData 最后一位是不是正数
        // 如果是正数，并且编码长度是 8 的倍数，说明刚刚好
        // 如果是正数，但编码长度不是 8 的倍数，只需在前面加一个符号位即可
        if(this.codeLen){
            if(this.codeLen % 8 === 0){
                codeStr += signed(encodeData[size], 8);
            }else{
                codeStr += (encodeData[size]).toString(2);
            }
        }else{
            throw new Error("解码失败，请先进行编码~");
        }

        // 拿到原始的编码字符串后，还原出原始内容
        // 首先需要把 编码表变成译码表，方法：把 Map 的 K-V 调换一下即可
        var decodeTable = this.decodingTable;
        // 拿到译码表之后，开始译码
        var content = '';
        var codeElm = '';
        for(let i = 0;i < codeStr.length;i ++){
            codeElm += codeStr[i];
            let value = decodeTable.get(codeElm);
            if(value){
                // 如果找到了在译码表中
                codeElm = '';
                content += String.fromCharCode(value);
            }
        }
        return content;
    }
    getDecodeTable(){
        var table = new Map();
        for(let ary of this.codingTable){
            table.set(ary[1], ary[0]);
        }
        return table;
    }
    print(callback) {
        if (this.head) {
            // callback && this.head.preOrder(callback);
            return this.head;
        }
    }
}

// 根据十进制整数，返回它的指定位数的二进制数
function signed (number, len = 32){
    let maxPossible = 2 ** (len - 1) - 1;
    let minPossible = -(2 ** (len - 1));
    let binaryString = "";
    let currentValue = 0;

    if (number < 0) {
        binaryString += 1;
        currentValue = minPossible;
    } else {
        binaryString += 0;
    }

    for (let j = len - 1; j > 0; j--) {
        let val = 2 ** (j - 1);
        if (currentValue + val <= number) {
            binaryString += "1";
            currentValue += val;
        } else {
            binaryString += "0";
        }
    }
    return binaryString;
};

// let h = new HuffCode("Hello world!");
