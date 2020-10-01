# 20 题

## 1. 数组和链表的使用场景

### 数组

数组定义简单，访问方便。但是使用的内存空间是连续的。  

数组更适合在数据数量确定，即较少甚至不需要使用新增数据、删除数据操作的场景下使用。在数据对于位置敏感的场景下，比如需要高频率根据索引位置查找数据时，数组是一个很好的选择。  

### 链表

链表对数据的存储方式是按照顺序的存储，它不要求内存空间是连续的。  

当数据的元素个数不确定，且需要经常进行数据的新增和删除时，那么链表会比较适合。  

对于删除操作，数组在删除某个元素时，其他元素很可能需要移动位置让内存空间连续。链表不需要移动，它通过指针关联起各个元素。

## 2. 深拷贝解决循环引用问题

使用 `WeakMap` 保存数组或对象，在我们不使用某个对象时（比如手动赋值为 null），垃圾回收机制会自动帮我们回收。代码如下：  

```js
const isObject = (obj) => typeof obj === 'object' && obj !== null;
const isArray = (ary) => Array.isArray(ary);

function deepClone(target) {
    let map = new WeakMap();

    function clone(target) {
        if(isObject(target)) {      // 引用类型
            let result = isArray(target) ? [] : {};

            if(map.get(target)) {       // map 中有这个对象就直接返回
                return map.get(target);
            }
            // 没有这个对象就先存入，可能之后的遍历还会出现这个对象
            map.set(target, result);

            for(let key in target) {
                // 递归克隆
                result[key] = clone(target[key]);
            }
            return result;
        } else {
            return target;
        }
    }

    return clone(target);
}
```

## 3. 虚拟列表原理

## 4. LRU 算法

## 5. 发布订阅与观察者的区别

## 6. treeshaking 原理
