## meta 标签知多少

meta 标签提供该页面的一些信息，比如针对搜索引擎和更新频度的描述和关键词，它还可以控制页面缓冲、响应式窗口等，定义 meta 标签有利于网站 SEO（有利于搜索引擎访问），对于响应式窗口也起着作用，因此 meta 标签是 HTML 中很重要的一个标签。在生成默认的 HTML 文档结构时，通常会有两个 `meta` 标签：  

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
```

通过上面可以看到，meta 元素不用闭合，有一个开始标签就可以了，因为 meta 并不在网页上展示内容。meta 有三个属性：`charset`、`name` 和 `content`。`charset` 不用多解释，它表示当前文档所使用的字符编码，通常是 `UTF-8`。而就是一个名称 `name`，有了名称就需要一个对应的值，`content` 属性就是对应的值，也就是信息，在 meta 中记录的信息称为“元信息”。因此，如果设置了 name 属性，就应该再设置一个 `content` 作为值。  

name 与 content 的关系可以比作 js 当中的对象，name 是键，而 content 是对应的值。name 的键通常不是随便去定义的，而 content 的值一般（不是所有，有的需要特定的格式）可以随意设置（只要是字符串就行）。name 一般有下面几个关键词： 

- `viewport`提供有关视口初始大小的提示，仅供移动设备使用，在下面会做详细介绍，这个属性的 content 值不能随意去设定。
- `keywords` 包含与逗号分隔的页面内容相关的单词，设置关键词有利于搜索引擎检索网页的基本信息，比如：  

```html
<meta name="keywords" content="js,html,css">
```

- `author` 这个文档的作者名称，值可以自由定义；
- `description`包含页面内容的简短和精确的描述，这也有利于搜索引擎检索网页的基本信息，而且一些浏览器将其用作书签页面的默认描述。描述内容不易过长。比如下面淘宝网的例子：  

```html
<meta name="description" content="淘宝网 - 亚洲较大的网上交易平台，提供各类服饰、美容、家居、数码、话费/点卡充值… 数亿优质商品，同时提供担保交易(先收货后付款)等安全交易保障服务，并由商家提供退货承诺、破损补寄等消费者保障服务，让你安心享受网上购物乐趣！">
```
- `generator`包含生成页面的软件的标识符，一般不怎么用；
- `publisher`以自由格式定义文档发布者的名称，功能与 author 相似，只是它一般是公司、机构的名称。
- `robots`定义搜索引擎爬虫的索引方式，这在下面会详细说到；
- `referrer`控制所有从该文档发出的 HTTP 请求中 HTTP Referer 首部的内容，定义 Referrer，启用该属性可以防止一些网络爬虫爬取图片或视频，这在下面会介绍；
- `creator` 以自由格式定义文档创建者的名称，如果值比较多，该属性可以定义出多个 `meta` 标签。
- `copyright` 标注版权信息，值可以自由定义；

有关 name 的值差不多有那么多，其中 `viewport`、`robots`、`referrer`是很有用的。  

## viewport
该属性可以控制视口，但仅供移动设备使用。需要注意的是 `视口` 不代表就是手机的屏幕宽高，视口可以设置，就是通过 `viewport` 这个属性设置的。  

viewport 的 content 值如下：  

- `width` 定义视口的宽度，值一般就是 `device-width`，表示宽度与设备宽度一致。也可以设置成数值，单位是像素，比如：  

```js
<meta name="viewport" content="width=200,height=300">
```

- `height` 定义视口的高度，值一般就是 `device-height`；
- `initial-scale` 定义设备宽度（纵向模式下的设备宽度或横向模式下的设备高度）与视口大小之间的缩放比率，可以取 0.0 到 10.0 的数值，一般是 `1.0`，表示不缩放，大于 1.0 会把页面放大（比值大表明视口的大小比真实的设备尺寸大）。  
- `user-scalable` 如果设置为 no，用户将不能放大或缩小网页。默认值为 yes。当我们使用手机访问某个页面时，会发现双击页面或者手指可以拉伸放到页面，就是这个属性的值没有设置成 `no`。  

```html
<meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=no">
```

通过上面也能发现，content 可以一次设置多个属性，每个属性之间用逗号隔开。  

- `maximum-scale` 定义缩放的最大值，就是最大只能放大到这个值了，取值是 `0.0` 到 `10.0` 之间；
- `minimum-scale` 定义缩放的最小值，值必须小于或等于 `maximum-scale` 的值，取值也是在 `0.0` 到 `10.0` 之间；  


## referrer

当你使用 Node.js 爬取网上资源时，特别是图片、视频，程序运行了一会，发现下载下来的图片全部都是一张，上面写着什么防盗链。网站通过某种方式阻止了网络爬虫的“攻击”，而防盗链就是一种措施，这种措施可以使用 `Referer` 这个请求头来实现。  

HTTP 请求头部中有一个 `Referer` 首部。它表示用户从那个页面连接过来的，比如当我们点击了一个超链接跳转到另一个页面，就会发出网络请求，`Referer` 的值就是上一个（超链接的那个）页面的 url。因此使用 `Referer` 可以简单的实现发爬虫，因为有些爬虫会先搜集整理出图片的 url，然后就是高效的直接去请求 url 了，所以利用 `Referer` 的值大致可以鉴别出一个请求是不是网络爬虫。  

使用 meta 标签可以设置 `Referer` 首部信息。content 的值可以设置成下面几个值：  

- `no-referrer` 表示不发送 `Referer`首部；
- `origin` 发送当前文档的 origin（origin 包括访问协议和域名）；
- `no-referrer-when-downgrade` 当目的地是安全的（从 https 到 https），则发送 origin 作为 referrer，目的地是较不安全的（从 https 到 http）则不发送 referrer，这个是默认的行为。  
- `origin-when-crossorigin`在同源请求下，发送完整的 URL（不包括查询参数），其他情况下则仅发送当前文档的 origin。
- `unsafe-URL` 在同源请求下，发送完整的URL (不含查询参数)。  

以上就是 content 的所有值。  

## robots

robots 属性表示该 HTML 网页应对搜索引擎的方式。content 值有以下几种，当设置多个值时每个值用 `,` 隔开。  


- `index` 允许搜索引擎索引页面，默认行为；
- `noindex` 防止搜索引擎索引页面；
- `noarchive` 防止搜索引擎缓存页面内容，就是页面快照；
- `nosnippet`搜索引擎的搜索结果中会显示一部分搜索文字上下文的内容，而 `nosnippet` 属性就是拒绝搜索引擎显示这部分内容，另外，所说引擎也不会保存该页面的快照。
- `noimageindex` 禁止搜索引擎索引本页面上的图片，本页面上的图片不会显示在搜索结果中。
- `follow` 告诉搜索引擎爬虫可以爬取本页面上的链接；
- `nofollow` 告诉搜索引擎不要爬取本页面上的链接；
- `noodp` 搜索引擎的搜索结果中会显示一部分搜索文字上下文的内容，noodp 属性用来阻止使用DMOZ信息做为这部分的文字使用；
- `noydir` 搜索引擎的搜索结果中会显示一部分搜索文字上下文的内容，noydir 属性会阻止雅虎使用Yahoo! directory信息作为这部分的文字使用；  

通过上面可以看出，一些可能的值是互斥的，例如同时使用 `index` 和 `noindex` ，或 `follow` 和 `nofollow`。在这些情况下，搜索引擎的行为是不确定的，因此应避免这样做。如果想要让自己的网站排名靠前，就需要考虑让搜索引擎爬虫容易访问你的网站，robots 属性在一定程度上可以做一些贡献。  

## http-equiv 与 property  

meta 标签设置属性名可以用 `name` 设置，除了 `name` 之外还有别的属性项，比如上面说的 `charset`，不过该属性一般没有 content 值，除了 `charset` 之外还有两个：`http-equiv` 和 `property`。  

### http-equiv
一看也能发现，该属性应该与 HTTP 有关。它的值用 content 属性接受。`http-equiv` 的属性有三个：  

- `content-type` 这个属性定义了文档的 `MIME type`。比如：  

```html
<meta http-equiv="content-type" content="text/html;charset=UTF-8">
```
这个属 content-type 其实是 HTML4 的属性，在 HTML5 中可以使用 `<meta charset="UTF-8">` 来代替。  

- `default-style` 这个属性指定了在页面上使用的首选样式表。它的 `content` 值必须匹配同一文档中的一个 `<link>` 元素上的 `title` 属性的值，或者必须匹配同一文档中的一个 `<style>` 元素上的 `title` 属性的值。因此在设置该属性之前，需要页面的首选样式设置 title 属性。  
- `refresh` 定义文档自动刷新的时间间隔。设置了这个属性，页面可以每隔一段时间自动刷新。content 值包含一个正整数时，表示重新载入页面的时间间隔(秒)，包含一个正整数并且跟着一个字符串（重定向的链接），则是重定向到指定链接的时间间隔(秒)。 
- `content-language` 这个指令定义页面使用的默认语言。这个属性是 HTML4 的内容，在 HTML5 中应使用 `<html>` 标签中的 `lang` 属性代替它。 

### property

关于 property 属性，它是 Open Graph Protocol（开放内容协议），通常以以 `property=og:`格式设置。这种协议可以让网页成为一个“富媒体对象”。用了`Meta Property=og`标签，就是你同意了网页内容可以被其他社会化网站引用等，目前这种协议被SNS网站（社交网站）如Fackbook、renren采用。关于该协议可以参考这篇文章：  

[Open Graph Protocol（开放内容协议）](https://www.douban.com/note/180821246/)  

[The Open Graph protocol](https://ogp.me/)  

## 最后

以上就是 meta 的使用与作用，可以发现 meta 标签是一个比较复杂的标签。meta 标签可以定义多个，每一个只能有一个属性，content 的值可以有多个，比如：  

```html
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=no">
        <meta name="author" content="ming">
        <meta name="description" content="Welcome to this site!"> 
        <meta name="referrer" content="origin-when-crossorigin">
        <meta http-equiv="default-style" content="Preferred style">
        <style title="Preferred style">
            *{
                padding: 0;
                margin: 0;
            }
        </style>
    </head>
</html>
```

以上就是关于 `<meta>` 标签的全部内容。  

