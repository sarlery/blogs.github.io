## 1. vertical-align

## 2. CSS 通用字体

## 3. display:none 与 visibility:hidden

`display:none` 与 `visibility:hidden` 有什么区别？  

1. display:none 相当于元素没有了后代元素，在正常流中不占用任何空间，元素的真实尺寸会丢失；visibility:hidden 在正常流中还会占用空间，它更像给元素的 `opacity` 值设置成了 `0`。  

2. `display:none` 会导致浏览器重排（Reflow）和 重绘（Repain）；而 `visibility:hidden` 只会导致浏览器重绘。  

## 4. clip-path
