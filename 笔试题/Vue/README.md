# Vue 学习笔记

## 1. 自定义事件

Vue 实例内部已经实现发布订阅功能，直接用即可。当任意的两个组件想要通信时，可以利用自定义事件做到。  

加入 A 组件想给 B 组件传送数据。A 组件可以这么写：  

```jsx
<template>
    <h2 @mouseenter="change('Hello!')">组件A</h2>
</template>

<script>
import event from '../event';

export default {
  name: 'A',
  methods: {
    change(msg){
      // 传送数据，myEvent 是自定义事件的事件名称，msg 是数据
      event.$emit('myEvent', msg);
    }
  }
}
</script>
```

B 组件：  

```jsx
<template>
  <h1>组件 B</h1>
</template>

<script>
import event from "../event";
export default {
  name: 'B',
  methods: {
    //   事件函数
    handler(data){
      console.log(data);
    }
  },
  props: {
    msg: String
  },
  mounted(){
    //   组件挂载后，注册事件
    event.$on('myEvent', this.handler);
  },
  beforeDestroy(){
    //   组件卸载时解除事件
    event.$off('myEvent', this.handler);
  }
}
</script>
```

`event` 对象如下：  

```js
import Vue from "vue";
export default new Vue;
```

### 父子组件通信

子组件想要获取到父组件的状态，可以在 `props` 中获取，子组件调用父组件的方法时可以使用 `$emit` 的形式，也可以使用 `props` 的方式。例如：  

```vue
<template>
  <div>
    <button @click="toggle">Click</button>
  </div>
</template>

<script>

export default {
  name: 'B',
  props: {
    add: Function,
    isShow: Boolean,
  },
  methods: {
    toggle(){
      // add 是传入的 props 方法
      this.$props.add(2);
      // 调用父组件传入的自定义事件
      this.$emit('toggle');
    }
  }
}
</script>
```

这个例子中，子组件 B 的按钮点击时组件 A 会展示与隐藏来回的切换。

父组件如下：  

```vue
<template>
  <div id="app">
    <A v-if="isShow" :num="num" />
    <B @toggle="toggle" :add="add" />
  </div>
</template>
```

需要注意的：`@toggle` 的写法应使用 `this.$emit` 的方式调用；`:add` 的方式会把数据挂载到 `props` 上。`@` 的方式相当于自定义事件。对于 `props` 上的方法，有时并没必要使用 `this.$props` 来获取，在 JSX 中直接使用即可。  

```vue
<template>
  <button @click="add(2)">Click +2</button>
</template>
```

## 2. 自定义 v-model
以双向绑定输入框为例。App 组件是父组件，A 和 B 都是其子组件，A 组件负责输入内容，B 组件负责展示输入的内容。JSX 如下：  

```vue
<template>
  <div id="app">
    <B :msg="msg"/>
    <!-- msg 是双向绑定的数据 -->
    <A title="A --> 组件A" v-model="msg" />
  </div>
</template>
```

B 组件接收的 msg 是 App 组件的数据，msg 由 A 组件输入的内容提供。v-model 用于双向绑定，尤其是表单中很方便使用。这里为 `A` 组件进行双向绑定。A 组件的内容如下：  

```vue
<template>
  <input type="text" 
    :value="val"
    @input="$emit('change',$event.target.value)"
  />
</template>

<script>
export default {
  name: 'A',
  props: {
    val: String     // val 对应于父组件中的 msg
  },  // modle 是用于双向绑定的特殊对象
  model: {
    // prop 的值应与 props 中的 val 和 JSX 中的 :value 中的 val 名称一样
    prop: 'val',
    // 双向绑定时的事件函数，当有一方数据变化时这个函数就会触发
    event: 'change'
  }
}
</script>
```

## 3. 作用域插槽
插槽是为了能让父组件往子组件里插入一些东西。比如：  

```jsx
<template>
    <div id="app">
        <A title="组件A"><!-- 组件 A 里可以嵌套 JSX -->
        <B :msg="msg"/>
            <!-- v-slot 是具名插槽，v-slot:desc 也可以简写成 #desc -->
            <template v-slot:desc>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab, possimus modi repudiandae nulla soluta quisquam voluptas qui cupiditate laudantium doloribus porro dicta necessitatibus quibusdam distinctio mollitia quod libero numquam doloremque?</p>
            </template>
        </A>
    </div>
</template>
```

然后是组件 A，如下：  

```jsx
<template>
    <div>
        <!-- solt 中间的内容是默认值，当 A 组件中不传入 JSX 时，会展示这里面的内容 -->
        <slot>OK!</slot>
        <hr />
        <h2>{{ title }}</h2>
        <!-- name 对应于上面的 template v-slot 值 -->
        <slot name="desc"></slot>
    </div>
</template>

<script>
export default {
    name: 'A',
    props: {
        title: String
    }
}
</script>
```

插槽除了上面的用法之外，还由一种“作用域插槽”（slot-scope）。这种插槽父组件可以获取子组件 slot 中的一些数据。例如：  

```jsx
<template>
    <div id="app">
        <A title="组件A">
            <!-- 作用域插槽使用 slot-scope 属性定义 -->
            <template slot-scope="slotProps">
                <!-- 将获取到的插槽数据传递给 B 组件 -->
                <B :msg="slotProps.slotData"/>
            </template>
        </A>
    </div>
</template>
```

A 组件：  

```jsx
<template>
    <div>
        <!-- 定义插槽 -->
        <slot :slotData="msg"></slot>
        <hr />
        <h2>{{ title }}</h2>
    </div>
</template>
<script>
export default {
    name: 'A',
    props: {
        title: String
    },
    data () {
        return {
            msg: '你好！'
        }
    }
}
</script>
```

## 4. $nextTick
Vue 在更新 DOM 时是异步执行的。数据改变后，DOM 不会立即渲染，想要拿到更新后的 DOM 或它的状态做点什么，这是不容易做到的。比如下面的例子，每次点击按钮都会增加列表元素，添加后我们想要获取到添加后的列表长度。

```jsx
<template>
  <div id="app">
    <ul ref="ul">
      <li v-for="(item, index) in list" :key="index">{{ item }}</li>
    </ul>
    <button @click="add">add item</button>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    add(){
        this.list.push('🍌');
        this.list.push('🍊');
        // 获取列表个数
        console.log(this.$refs.ul.children.length);
    }
  },
  data() {
    return {
      list: ['🍎']
    }
  }
}
</script>
```

当点击后，控制台打印的列表长度总是上一次的。如果要打印这一次的长度，可以使用 `$nextTick` 方法。它会在 DOM 渲染之后触发。如下：  

```js
add(){
    this.list.push('🍌');
    this.list.push('🍊');
    this.$nextTick(() => {
        console.log(this.$refs.ul.children.length);
    });
}
```

> 在 Vue 中，因为是异步渲染，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更。对于多次数据变更，只会被推入到队列中一次。这样可以避免不必要的计算和 DOM 操作。

## 5. keep-alive

`keep-alive` 可以缓存组件。例如一些频繁切换的组件或者不需要重新渲染的场景。比如一些很复杂的组件，当重新渲染时可能会影响用户体验，这时就可以选择把这个组件缓存下来。  

```jsx
<keep-alive>
    <A v-if="isShow" />
</keep-alive>
```

keep-alive 有两个属性：`exclude` 和 `include`。这两个属性会有条件地缓存。值可以用逗号分隔字符串、正则表达式或一个数组来表示。设置后会匹配首先检查组件自身的 name 选项，如果 name 选项不可用，则匹配它的父组件 `components` 选项的键值。匿名组件不能被匹配。例如：  

```vue
<keep-alive :include="['a', 'b']">
  <component :is="view"></component>
</keep-alive>
```

当组件在 `<keep-alive>` 内被切换，它的 `activated` 和 `deactivated` 这两个生命周期钩子函数将会被对应执行。生命周期触发顺序：  

- 初次进入时：created -> mounted -> activated；退出后触发 deactivated；
- 再次进入：会触发 `activated`；事件挂载的方法等，只执行一次的放在 `mounted` 中；组件每次进去执行的方法放在 `activated` 中；  

> `<keep-alive>` 用在其一个直属的子组件被开关的情形。如果在其中有 `v-for` 则不会工作。

## 6. 动态组件

动态组件书写格式：  

```jsx
<component :is="view" />
```

根据 `is` 的值动态渲染组件。component 主要用于动态渲染，组件类型不确定的场景当中。  

例如：  

```jsx
<template>
  <div id="app">
    <!-- 渲染变量 b 对应的组件名 -->
    <component :is="b" />
    <!-- 渲染变量 a 对应的组件名 --> 
    <component :is="a" />
  </div>
</template>

<script>
import A from './components/A';
import B from './components/B';
export default {
  name: 'App',
  components: {
    A,
    B
  },
  data(){
    return {
      a: 'A',   // a 对应于 A 组件
      b: 'B'    // b 对应于 B 组件
    }
  }
}
</script>
```

动态组件可以与 keep-alive 配合，优化渲染。

## 7. 异步组件

异步组件是优化页面性能的重要手段，比如点击某个按钮，这个组件会展示，这时才发起网络请求获取该组件。这种方式被称为“按需加载”。在组件的 components 属性中定义。书写如下：  

```jsx
components: {
    LazyComponent: () => import('./LazyComponent'),
}
```

## 8. mixin

多个组件有相同的逻辑时，可以使用 `mixin` 将公共的部分抽离出来，复用代码。  

`mixin` 中的代码与 Vue 中 script 中的一样，例如：  

```js
export default {
  methods: {
    add (step) {
      this.number += step
    }
  },
  data () {
    return {
      number: 1
    }
  },
  mounted () {
    console.log('mixin mounted');
  }
}
```

可以有方法、计算属性、生命周期等。使用时引入即可：  

```js
import A from './components/A';
import B from './components/B';
import mixin from './mixin';  // 引入 mixin
export default {
  name: 'App',
  mixins: [mixin],  // 注册 mixin
  components: {
    A,
    B
  },
  data () {
    return {
      msg: 'The number is: '
    };
  }
}
```

这样 App 组件就可以使用 mixin 中的数据或者方法。  

```jsx
<template>
  <div id="app">
    <A :add="add" />
    <B :msg="msg" :number="number" />
  </div>
</template>
```

### mixin 的不足

1. 变量来源不明确，比如上面的代码，`add` 函数和 `number` 变量我们并没有显示的导入，这就导致可能不太明白这两个数据是怎么来的，用途是什么；  
2. 导入多个 mixin 可能会有冲突，数据可能被覆盖；
3. mixin 和组件可能出现多对多的关系，这就会导致复杂度提高，不利于维护。

## 9. 事件  

- 如何传入 event 对象？  

在 Vue 中绑定的事件监听函数是很智能的。绑定的是函数执行，Vue 会把传入的实参传入到我们定义的函数中。例如：  

```jsx
<button @click="add(2)">click</button>
// ... 

{
  method: {
    add (step) {
      this.num += step;
    }
  }
}
```

当传入的只是一个函数时（并没有执行），Vue 默认会把 event 对象传入。  

```jsx
<button @click="add">click</button>
// ... 

{
  method: {
    add (event) {
      console.log(event);
      this.num += step;
    }
  }
}
```

如果要显式的传入 event 对象，可以这么做：  

```jsx
<button @click="add(2, $event)">click</button>
```

`$event` 是 Vue 内置的事件对象。在 Vue 中的 event 对象是原生的事件对象。并且事件被挂载到当前的元素上。可以通过下面的方式验证：  

```js
console.log(event.currentTarget);
```

`currentTarget` 总是绑定事件的那个元素。而 `e.target` 是当前触发事件的元素。

## 10. 修饰符

Vue 内部实现了许多修饰符，比如事件修饰符。如下：  

```jsx
<button @click.stop="handle">Click</button>
```

`@click.stop` 会阻止事件冒泡。除此之外还有一些可能常用的修饰符：  

- `@click.capture` 使用事件捕获模式；
- `@submit.prevent` 提交事件触发时不再重载页面；
- `@click.stop.prevent` 不冒泡也不重载页面；
- `@click.self` 只有当 `event.target` 是当前元素（绑定click事件的元素）是才触发（这样的话，当点击该元素的子元素时，只会触发子元素绑定的事件；当点击该元素时，子元素也不会触发事件，这与阻止冒泡相似，只是阻止冒泡在子元素上设置）。  

除此之外，还有按键修饰符。例如：  

- `@click.ctrl`  当鼠标点击并且按下 `ctrl` 键时才会触发事件（Alt 或者 shift 也一起按下时也会触发事件）；
- `@click.ctrl.exact` 当点击数据并且按下 `ctrl` 的按键时才触发事件（当 alt 或者 shift 按键也被一起按下时，不会触发事件）；
- `@click.exact` 除了系统修饰符（如`ctrl`、`shift` 和 `alt` 键）之外的按键按下并且鼠标点击时才触发事件；
- `@click.shift` 点击并且按下 shift 按键时才触发事件；  

当然，除了上述的 `click` 与按键组合之外，也可以与别的事件组合。 更多可以参考官网：[按键修饰符](https://cn.vuejs.org/v2/guide/events.html#%E4%BA%8B%E4%BB%B6%E4%BF%AE%E9%A5%B0%E7%AC%A6)   

除了事件修饰符以外，v-model 也有几个修饰符：  

- `v-model.trim` 输入的字符串空格会被过滤掉；
- `v-model.lazy` 在监听时用 `change` 事件代替 `input` 事件（内容发生变化，并且失去焦点时触发 change 事件）；
- `v-model.number` 将输入的字符串传为有效的数字。  

