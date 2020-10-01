# TypeScript 其他内容

## 1. 编写声明文件

在我们开发某个项目时，可能会有许多公共的类型，尤其是异步返回的接口数据，格式都很相似。这些常用的类型可以放到一个全局的声明文件中，这样我们在每次使用时就不用再声明或导入了。  

可以在项目根目录下建立一个 `typings` 目录，里面编写一个 `global.d.ts` 文件，它是全局的声明文件，在项目的其他地方都可以直接使用里面定义的类型。  

### 给 js 文件编写声明文件

只需在该 js 文件的同级目录下新建一个同名的 `.d.ts` 文件。例如：  

```ts
// aaa.js
export function aaa(a) {
    return String(a);
}

// aaa.d.ts
export declare type aaa = (a: number) => string;

// bbb.js 或者 bbb.ts
import { aaa } from './aaa';
// aaa 就会有 aaa 函数的声明提示
```

## 2. 在 React 中使用

## 3. 模块扩展

假如导入的其他 js 文件在 window 上挂在了内容，如何用 ts 进行声明？如下：  

```ts
interface Window{
    add<T>(a: T, b: T): string;
}

// 就可以在其他地方安全的调用 add 方法了
```

### 扩展模块

如何扩展第三方模块？例如给 `jquery` 扩展自己的方法。可以这样声明：  

```ts
declare module 'jquery' {
    export function myFunc(): void;
}

// 实现
import jquery from 'jquery';

jquery.myFunc = () => {};
```

## 4. 装饰器
