class Node {
    constructor(value){
        this.value = value;
        this.left = null;
        this.right = null;
    }
    preOrder(callback){     // 前序遍历
        callback(this.value);
        if(this.left !== null){
            this.left.preOrder(callback);
        }
        if(this.right !== null){
            this.right.preOrder(callback);
        }
    }
    endOrder(){
        if(this.left !== null){
            this.left.preOrder(callback);
        }
        if(this.right !== null){
            this.right.preOrder(callback);
        }
        callback(this.value);
    }
    centerOrder(){
        if(this.left !== null){
            this.left.preOrder(callback);
        }
        callback(this.value);
        if(this.right !== null){
            this.right.preOrder(callback);
        }
    }
}

class HuffmanTree {
    constructor(data){
        this.treeArr = [];
        this.createTreeAry(data);
        this.head = this.createHuffTree(this.treeArr);
    }
    createTreeAry(ary){
        ary.forEach(item => {
            this.treeArr.push(new Node(item));
        });
    }
    treeSort(){     // 排序
        this.treeArr.sort((a, b) => b.value - a.value);
    }
    createHuffTree(ary){
        while(ary.length > 1){
            this.treeSort();
            var endNode = ary.pop();
            var secToLastNode = ary.pop();
            var parent = new Node(endNode.value + secToLastNode.value);
            parent.left = endNode;
            parent.right = secToLastNode;
            ary.push(parent);
        }
        return ary[0];  // 返回根节点
    }
    print(type, callback){
        switch(type){
            case 1:     // 前序遍历
                this.treeArr[0] && this.treeArr[0].preOrder(callback);
                break;
            case 2:     // 中序遍历
                this.treeArr[0] && this.treeArr[0].centerOrder(callback);
                break;  
            case 3:     // 后序遍历
                this.treeArr[0] && this.treeArr[0].endOrder(callback);
                break;
            default: return;
        }
    }
}

// let ary = [13, 7, 8, 3, 29, 6, 1];

// let huff = new HuffmanTree(ary);

// huff.print(1,value => {
//     let span = document.createElement("span");
//     span.classList.add('node');
//     span.textContent = value;
//     document.body.appendChild(span);
// });

