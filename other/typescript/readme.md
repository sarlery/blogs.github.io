# TypeScript 使用笔记

## 1. 泛型约束

比如下面的例子，如果想要获取到函数参数的 `length` 属性，但是 ts 会报错，因为泛型 `T` 中可能并没有 `length` 属性。  

```ts
function log<T>(value: T): T{
    console.log(value.length);
    return value;
}
```

#### 解决办法

可以定义一个拥有 `length` 属性的接口，让 `T` 继承这个接口：  

```ts
interface Length{
    length: number;
}

function log<T extends Length>(value: T): T{
    console.log(value.length);
    return value;
}
```

## 2. 类型保护

在 typescript 中，能够在特定的区块中保证变量属于某种确定的类型，可以在此区块中放心地引用此类型的属性，或者调用此类型地方法。  

常见的三个类型保护方式：  

#### 1. instanceof

这个操作符可以用来告诉 TS，这个实例来自于某个类，我可以安全的使用这个类中的方法。  

```ts
if(p instanceof Person) {
    p.sayName();
}
```

#### 2. in

`in` 操作符可以用来告诉 TS，这个属性存在于这个对象中，可以安全地使用这个对象中地属性。  

```ts
const obj = {
    a: 123,
    b: 'qwer',
    c: [1,2,3,4],
    logA(): number {
        return this.a;
    }
};

if('a' in obj) {
    obj.logA();
}

// obj 中没有 `d` 属性，此时 ts 会报错
if('d' in obj) {
    obj.logA();
}
```

#### 3. typeof

`typeof` 通常用于判断 ts 当中地内置基本类型，比如下面的例子，当 x 类型是 `string` 时，可以安全的使用 string 中的方法。  

```ts
if(typeof x === 'string') {
    return x.substring(1);
}
```

## 3. 交叉类型与联合类型  

交叉类型使用 `&` 连接，例如：  

```ts
interface A{
    a: number;
}

interface B{
    b: string;
}

type C = A & B;

// data 中的属性应是 A 和 B 地 ** 并集 **
const data: C = {
    a: 1,
    b: 'ok'
}
```

交叉类型适用于对象的混入，几个接口的并集。

联合类型使用 `|` 连接，例如：  

```ts
interface A{
    a: number;
    b: string;
}

interface B{
    b: string;
    c: boolean;
}

type C = A | B;

// data 要么是类型 A，要么是类型 B
const data: C = {
    b: '123',
    a: 123
}
```

## 4. type 和 interface 的区别

### 相同点：

#### 都可以定义对象类型和函数类型  

例如：  

```ts
interface log<T>{
    (value: T): T;
    // 接口还可以定义函数的静态属性
    age: number;
}

const fn: log<string> = (name) => {
    return 'My name is ' + name;
};
fn.age = 18;

// 使用 type 定义函数：
type Log<T> = (value: T) => T;
const f: Log<number> = (age: number) => age; 
```

#### 都允许拓展

`interface` 使用 `extends` 关键字实现交叉类型，例如：  

```ts
interface A{
    name: string;
}
interface B extends A{
    age: number;
}
const b: B = {
    name: 'Ming',
    age: 20
};
```

`interface` 也可以 `extends` `type` 定义的类型：  

```ts
type C = {
    gender: string;
};

interface D extends C{
    height: number;
}
```

### 不同点

`type` 与 `interface` 不同之处在于：`type` 表示 **类型别名**，给某个类型赋予另一个名称，可以给基本类型、联合类型、交叉类型、元组等 `起别名`。  

```ts
type S = string;
type StrOrNum = string | number;
```

`interface` 能够类型合并，而 `type` 不行，使用 `type` 重复声明类型 ts 会报错，例如：  

```ts
interface User{
    name: string;
}
interface User{
    name: string;
    age: number;
}
const user: User = {
    name: 'Ming',
    age: 21
}
```

## 5. 类型兼容性

当一个类型 `Y` 可以被赋值给另一个类型 `X` 时，我们可以说类型 `X`兼容类型 `Y`。  

通常情况下，结构之间的兼容性会是 **成员少的兼容成员多的**。例如下面的代码，类型 `A` 兼容 `B`，但 `B` 不兼容 `A`。  

```ts
interface A{
    name: string;
    age: number;
    gender: string;
}

interface B{
    name: string;
    age: number;
}

let user: A = {
    name: 'Ming',
    age: 21,
    gender: 'male'
};
// 这是允许的，user 可以赋值给 user2（user2 成员比 user 少）
let user2 = user;
```

函数之间的兼容性会是 **参数多的兼容参数少的**。

```ts
type Fn1 = (name: string, age: number) => void;

type Fn2 = (name: string) => number;

const fn1: Fn1 = (name, age) => {
    console.log(name, ':', age);
};
// 这是允许的
const fn2 = fn1;
```

## 6. keyof 索引类型

`keyof` 关键字可以让编译器就能够检查使用了动态属性名的代码。比如下面的函数，传入类型 `T` 和属性集合，返回 `T` 的这些属性对应值。  

```ts
function getValues<T, K extends keyof T>(obj: T, keys: K[]): T[K][] {
    return keys.map(key => obj[key]);
}

const obj = {
    name: 'Ming',
    age: 21,
    gender: 'male',
    height: 180
};

const result = getValues(obj, ['name', 'age']);
console.log(result);
```

使用 `ts-node` 运行上面代码，会打印出 `['Ming', 21]`。类型 `K` 继承了 `T` 接口的属性，`keyof T` 的结果为 `T` 上已知的公共属性名的联合（联合类型）。`T[K]` 是索引访问操作符。

## 7. TS 中实用的内置类型

### ReadOnly

它可以把一个接口变成只读的，例如：  

```ts
interface User{
    name: string;
    age: number;
}

type ReadOnlyUser = Readonly<User>;
```

### Partial

可以把接口的所有属性变成可选的，例如：  

```ts
interface User{
    name: string;
    age: 21
}
// PartailUser 接口中的属性将都是可选的
type PartailUser = Partial<User>;
```

`Partial` 类型的实现：  

```ts
type Partial<T> = {
    [P in keyof T]?: T[P];
};
```

### Pick

这个内置类型可以把接口中的属性抽离出来形成一个新的类型，例如：  

```ts
interface O{
    a: number;
    b: boolean;
    c: string;
}

type P = Pick<O, 'a' | 'c'>;

// 类型 P 就等于：
type P = {
    a: number;
    c: string;
}
```

它的实现如下：  

```ts
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
```

### ReturnType

这个类型可以推断函数返回值的类型，它的参数是一个函数类型。例如：  

```ts
type F = (name: string) => string;

// 类型 R 将是 string 类型
type R = ReturnType<F>;
```

### Record

这个内置类型与 `Pick` 类型有些相似，它的实现如下：  

```ts
type Record<K extends keyof any, T> = {
    [P in K]: T;
};
```

使用：  

```ts
interface O{
    a: number;
    b: boolean;
    c: string;
}

type P = Record<'x' | 'y', O>;

// P 将是下面的类型：

interface P{
    x: O;
    y: O;
};
```

### Exclude 和 NonNullable

`Exclude` 实现如下：  

```js
type Exclude<T, U> = T extends U ? never : T;
```

即：如果类型 `T` 继承自 `U`，那么返回的新类型将是 `never`，否则返回类型 `T`。比如下面的例子：  

```ts
interface A{
    a: number;
    b: null;
    c?: string;
}

interface B extends A{
    d: boolean;
}

// data 将是 A 类型
let data: Exclude<A, B>;

// result 将是 never 类型
let result: Exclude<B, A>;
```

与 `Exclude` 对应的是 `Extract` 类型，它与 `Exclude` 相反，其实现如下：  

```ts
type Extract<T, U> = T extends U ? T : never;
```

#### NonNullable

它的实现逻辑：  

```ts
type NonNullable<T> = T extends null | undefined ? never : T;
```

接收泛型 `T`，如果 `T` 继承自 `null` 和 `undefined` 的联合类型，那么返回 `never` 类型，否则返回类型 `T`。 `NonNullable` 会从 `T` 中排除 `null` 和 `undefined` 的联合类型。例如：  

```ts
// 类型 A 并不继承自 undefined | null 类型
type A = undefined | string | number | null;

// B 的类型将是 string | number （从 A 中排除了 undefined 和 null）
type B = NonNullable<A>;
```

`NonNullable` 也可以用 `Exclude` 实现：  

```ts
type NonNull<T> = Exclude<T, null | undefined>
```

TypeScript 中实现了许多实用的类型，更多类型内置声明可以参考官网介绍：[高级类型](https://www.tslang.cn/docs/handbook/advanced-types.html) 或者查看 ts 源码。  




## 8. 声明合并

在 TS 中有多个“声明合并”的特性。  

### 接口合并

```ts
interface A{
    name: string;
    age: number;
}

interface A{
    gender: string;
}
// 类型 A 将拥有三个属性
```

### 合并命名空间

如：  

```ts
namespace Animals {
    export class Zebra { }
}

namespace Animals {
    export interface Legged { numberOfLegs: number; }
    export class Dog { }
}
```

等同于：  

```ts
namespace Animals {
    export interface Legged { numberOfLegs: number; }

    export class Zebra { }
    export class Dog { }
}
```

> 命名空间可以与其它类型的声明进行合并。 只要命名空间的定义符合将要合并类型的定义。合并结果包含两者的声明类型。 TypeScript 使用这个功能去实现一些 JavaScript 里的设计模式。  

关于声明合并的内容可以参考 TS 中文文档：[声明合并](https://www.tslang.cn/docs/handbook/declaration-merging.html)  


