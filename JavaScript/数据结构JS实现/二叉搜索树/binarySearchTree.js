class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
    // 中序遍历
    inorderTraversal(root, callback) {
        if (root) {
            this.inorderTraversal(root.left, callback);
            callback(root.value);
            this.inorderTraversal(root.right, callback);
        }
    }
    // 前序遍历
    preorderTraversal(root, callback) {
        if (root) {
            callback(root.value);
            this.preorderTraversal(root.left, callback);
            this.preorderTraversal(root.right, callback);
        }
    }
    // 后序遍历
    postorderTraversal(root, callback) {
        if (root) {
            this.postorderTraversal(root.left, callback);
            this.postorderTraversal(root.right, callback);
            callback(root.value);
        }
    }
}

/**
 * 二叉搜索树的实现
 */
class BinarySearchTree {
    constructor(...values) {
        this.init(values);
    }
    init(nodes) {
        if (Array.isArray(nodes) && nodes.length) {
            nodes.forEach(node => {
                this.insert(node);
            });
        }
    }
    judge(node, root) {
        if (node < root.value) {
            if (root.left) {
                this.judge(node, root.left);
            } else {
                root.left = new Node(node);
            }
        } else if (node < root.value) {
            if (root.right) {
                this.judge(node, root.right);
            } else {
                root.right = new Node(node);
            }
        } else {
            return void 0;
        }
    }
    insert(node) {
        !this.root ? this.root = new Node(node) : this.judge(node, this.root);
    }
    search(node, root = this.root) {
        if (!root) {
            return false;
        }
        if (node === root.value) {
            return true;
        } else if (node < root.value) {
            return this.search(node, root.left);
        } else {
            return this.search(node, root.right);
        }
    }
    // 寻找最小的节点
    findMinNode(node = this.root) {
        if (!node) {
            return null;
        }
        while (node && node.left) {
            node = node.left;
        }
        return node.value;
    }
    remove(node){
        this.root = this.__remove(node, this.root);
    }
    __remove(item, rootNode) {
        if (!rootNode) return null;
        if (item > rootNode.data) {
            rootNode.rightNode = remove(item, rootNode.rightNode);
            return rootNode;
        } else if (item < rootNode.data) {
            rootNode.leftNode = remove(item, rootNode.leftNode);
            return rootNode;
        } else { // 遍历到了要删除的结点，删除的是根节点
            // 开始判断这个结点的位置情况：
            if (!rootNode.leftNode && !rootNode.rightNode) {
                rootNode = null;
                return rootNode;
            }
            // 只有一个子结点：
            else if (rootNode.leftNode && !rootNode.rightNode) {
                return rootNode.leftNode;
            } else if (rootNode.rightNode && !rootNode.leftNode) {
                return rootNode.rightNode;
            } else { // 两个子树都有时

                // 这里找到 右子树中最小的结点
                var minNode = findMinNode(rootNode);
                rootNode.data = minNode.data;
                // 值交换之后，要删除的就变成了 minNode 结点
                rootNode.rightNode = remove(rootNode.rightNode, minNode.data);
                return rootNode;

            }
        }
    }
}

/**
 * 层次遍历
 * @param {Node} tree 
 *      1
 *     / \
 *    2   3
 *   / \   \
 *  4   5   6
 * 
 * res: 
 *  [   
 *      [1]
 *      [1, 3]
 *      [4, 5, 6]
 * ]
 */
function traversal(tree){
    var queue = [];
    var result = [];
    if(tree){
        queue.push(tree);
    }
    while(queue.length){
        var level = [];
        var len = queue.length;
        for(let i = 0;i < len;i ++){
            var item = queue.shift();
            level.push(item.value);
            if(item.left)   queue.push(item.left);
            if(item.right)  queue.push(item.right);
        }
        result.push(level);
    }
    return result;
}

// test
// var result = traversal(tree);
// console.log(result);


// 对称二叉树
const tree = {
    value: 1,
    left: {
        value: 2,
        left: {
            value: 2,
            left: null,
            right: null
        },
        right: {
            value: 2,
            left: null,
            right: null
        }
    },
    right: {
        value: 2,
        // left: null,
        left: {
            value: null,
            left: null,
            right: null,
        },
        right: {
            value: 2,
            left: null,
            right: null
        }
    }
}

const tree2 = {
    value: 1,
    left: {
        value: 2,
        left: {
            value: 2,
            left: null,
            right: null,
        },
        right: null
    },
    right: {
        value: 2,
        left: {
            value: 2,
            left: null,
            right: null,
        },
        right: null
    }
}

// leetCode 101 对称二叉树
// https://leetcode-cn.com/problems/symmetric-tree/
var isSymmetric = function(root) {
    const check = (p, q) => {
        if(!p && !q)    return true;
        if(!p || !q)    return false;
        return p.val === q.val && check(p.right, q.left) && check(p.left, q.right);
    }
    return check(root, root);
};

var result = isSymmetric(tree);
console.log(result);