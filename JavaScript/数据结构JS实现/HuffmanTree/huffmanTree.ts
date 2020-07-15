class HuffNode<T = Number>{
    value: T;
    left: null | HuffNode<T>;
    right: null | HuffNode<T>;
    constructor(value: T){
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

class HuffmanTree<P = Number>{
    treeArr: Array<HuffNode<P>>;
    constructor(data: P[]){
        this.treeArr = [];
        this.createTree(data);
    }
    createTree(ary: P[]){
        ary.forEach(item => {
            this.treeArr.push(new HuffNode<P>(item));
        });
        this.treeSort(this.treeArr);
    }
    treeSort(ary: HuffNode<P>[]){
        ary.sort((a, b) => a.value - b.value)
    }
}