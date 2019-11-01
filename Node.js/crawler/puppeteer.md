# puppeteer 爬虫初探

puppeteer 是 Google Chrome 团队开源的一个神器，这个神器是一个 headless Browser（无头浏览器）。用这个神器可以模拟操作浏览器，去访问Web站点。因此用 puppeteer 做爬虫，可以爬取到你想要的几乎所有的网站资源。

## 怎样使用这个利器？

第一步当然实现安装：

+ 第一步，需要先有 Node.js 环境；

+ 通过 `npm` 或者 `yarn` 命令来安装：

  + `npm install puppeteer -S`  或者

  + `yarn add puppeteer`

+ 这里有个注意点，安装 puppeteer 包时，会安装一个依赖 —— `chromium` (chrome 浏览器的引擎)。这个安装过程会很慢，甚至下载失败。解决的办法就是不下载，使用本地的浏览器引擎。

### 设置环境变量
