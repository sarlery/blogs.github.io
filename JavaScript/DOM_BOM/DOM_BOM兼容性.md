# DOM、BOM一些兼容性问题
汇集了许多关于DOM和BOM的兼容性问题，主要是关于 IE 浏览器的，考虑到浏览器迭代，这里主要列出了 IE8 以及之后的浏览器版本。  
IE8 浏览器在 2008年推出，距现在（2019）已有11年之久，已经是很老的一款浏览器了。但是在一些项目中，可能仍需要考虑到兼容性，如果兼容到 IE8 已经是很兼容了，毕竟该浏览器也几乎没多少市场份额了。多是一些机构或政府部门在使用。 而有些兼容性问题也可能是其它浏览器之间的差异，比如 Chrome 和 FireFox 对于鼠标滚轮事件对象的滚轮方向判断方式不同，Chrome使用 wheelDelta，而FireFox 则采用 detail 做判断。下面将一一说明或做补充实现来尽量弥补浏览器之间的差异。其实大部分就是为了兼容 IE 早期浏览器。  

## DOM 部分
DOM 即：文档对象模型，其中定义了许多操作 HTML 文档内容的 API，在早期的浏览器中，特别是 IE，有些API是不支持的，或者API的名称或功能和标准不太一样，这样就造成了差异。  
### DOM 选择器的差异
#### `getElementById` 和 `getElementsByName`  
在低于 IE8 版本（不包括 IE8）的浏览器中，这两个选择器匹配的元素的 ID/name 值是不区分大小写的！而且这两个方法不仅能匹配到有ID值的元素，还能匹配到name属性的元素（互通！），比如：页面上有两个元素，一个元素有 ID属性，值为"main"，而另一个元素有name属性，这个属性的值也是"main"，这样调用`ById` 的方法可能会匹配到 "name=main" 的元素，同样的`ByName` 的方法也可能匹配到"id=main"的元素。  
因此，如果要兼容 IE8 版本以下的浏览器，最好小心使用，不要将同样的字符串同时用作 `name` 或 `id`。  

#### `getElementsByClassName()` 
这个属性除了 **IE8 以及更早的版本没有实现外，所有浏览器都实现了**。 而 IE8 支持 `querySelectorAll()` 和 `querySelector()` 方法，可以使用它来代替使用 `getElementsByClassName()` 方法。  

#### 选取子类和兄弟元素
这里主要是四个属性，分别是：  
+ `firstElementChild` 获取元素的第一个子元素；
+ `lastElementChild` 获取元素的最后一个子元素；
+ `nextElementSibling` 获取这个元素的下一个兄弟元素；
+ `previousElementSibling`获取这个元素的上一个兄弟元素；  

上面四个方法在 IE 中并没有实现（IE 8 及其以下版本）。  
我们可以自己实现一下这四个属性。  

先实现一下后两个属性  
`element._nextElementSibling()` 返回元素的下一个兄弟元素，如果没有则返回 `null` :
```js
Element.prototype._nextElementSibling = function(){
    if('firstElementChild' in Element.prototype) 
        return this.firstElementChild;
    var node = this.nextSibling;
    while(node){
        if(node.nodeType === 1){
            return node;
        }else{
            node = node.nextSibling;
        }
    }
    return null;
}
```
上面代码中 `in` 运算符在 IE8 及其以上版本是支持的，可以使用，`node.nextSibling` 和 `node.nodeType` 属性在 IE8 上也是支持的，前者表示获取一个结点（是结点，而非元素结点）的下一个兄弟节点（而不一定是元素节点）；后者是指获取一个结点的结点类型，当 nodeType === 1时，表示该结点是一个元素结点。不同的结点它的节点类型也不相同：  

![](./img/nodeType.png)  

需要注意的是，在支持的浏览器中，`nextElementSibling` 是只读的，因此可以使用 `Object.defineProperty` 方法改造一下，这个方法 IE8 也是支持的。  
```js
if(!("nextElementSibling" in Element.prototype)){
    Object.defineProperty(Element.prototype, "nextElementSibling", {
        get: function(){        // 只有 get 方法，没有 set
            var node = this.nextSibling;
            while(node && 1 !== node.nodeType)
                node = node.nextSibling;
            return node;
        }
    });
}
```

接着实现 `previousElementSibling` ：
```js
if(!("previousElementSibling" in Element.prototype)){
    Object.defineProperty(Element.prototype, "previousElementSibling", {
        get: function(){        // 只有 get 方法，没有 set
            // 这里使用的是 previousSibling 方法
            var node = this.previousSibling;
            while(node && 1 !== node.nodeType)
                node = node.previousSibling;
            return node;
        }
    });
}
```

实现前两个方法  
`firstElementChild` —— 返回元素的第一个子元素。没有找到则返回 `null`
```js
if (!("firstElementChild" in Element.prototype)) {
    Object.defineProperty(Element.prototype, "firstElementChild", {
        get: function () { // 只有 get 方法，没有 set
            var node = this.childNodes,
                len = node.length;
            for(var i = 0;i < len;i ++){
                if(node[i].nodeType === 1){
                    return node[i];
                }
            }
            return null;
        }
    });
}
```
这里使用了 `node.childNodes` 方法，这个方法返回这个结点中的所有子结点（不光有元素节点）。然后从第一个子结点开始遍历，找到第一个子元素节点。  
同样的，`lastElementChild` 只需要将循环从 len - 1 开始遍历就会得到最后一个子元素结点：
```js
if (!("lastElementChild" in Element.prototype)) {
    Object.defineProperty(Element.prototype, "lastElementChild", {
        get: function () { // 只有 get 方法，没有 set
            var node = this.childNodes,
                len = node.length;
            for(var i = len - 1;i >= 0;i --){
                if(node[i].nodeType === 1){
                    return node[i];
                }
            }
            return null;
        }
    });
}
```

### `textContent`