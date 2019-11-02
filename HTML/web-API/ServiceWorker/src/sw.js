/*
    'install' : 载入缓存；
    'activate' : 删除旧缓存； 
    'fetch' : 更新缓存；
*/

// 定义缓存版本
const Vis = 'v_0.1.1';

self.addEventListener('install',(event) => {
    event.waitUntil(        // 确保 Service Worker 不会在 waitUntil() 里面的代码执行完毕之前完成安装
        caches.open(Vis).then(function(cache){
            // 打开一个新的缓存
            // 下面的 URL 就是想要缓存的资源列表
            return cache.addAll([
                '/',
                '/index.html',
                '/index.css',
                '/index.js',
                '/img/pomegranates.jpg'
            ]);
        })
    );
});

self.addEventListener('activate',(event) => {
    const cacheList = [Vis];

    event.waitUntil(
        // keys() 方法返回一个 Promise，这个Promise将解析为一个 cache 键的数组
        caches.keys().then(keyList => {
            // 这里的 keyList 包含的是上一次的缓存和这一次新的缓存版本
            Promise.all(keyList.map(key => {
                // 这个 key 就是版本字符串
                if(cacheList.indexOf(key) === -1){
                    // Cache 接口的 delete() 方法查询 request 为 key 的 Cache 条目，
                    // 如果找到，则删除该 Cache 条目并返回resolve为true的 Promise 。 
                    // 如果没有找到，则返回 resolve为 false的 Promise 
                    return caches.delete(key);
                }
            }));
        })
    );
});

self.addEventListener('fetch',(event) => {
    // respondWith() 方法可以劫持我们的 HTTP 响应，可以利用这，用自己的代码更新它们
    event.respondWith(
        // 这个方法允许我们对网络请求的资源和 cache 里可获取的资源进行匹配
        // 查看缓存中是否有相应的资源
        caches.match(event.request).then(function(res){
            // 如果没有在缓存中找到匹配的资源，
            // 你可以告诉浏览器对着资源直接去 fetch 默认的网络请求
            return res || fetch(event.request).then(response => {
                return caches.open(Vis).then(cache => {
                    // put 方法用来把这些资源加入到缓存中
                    // 资源可以从 event.request 抓取，
                    // 它的响应会被 response.clone() 克隆一份，然后被加入到缓存中
                    cache.put(event.request,response.clone());
                    return response;
                });
            });
            // 更新失败的话，可以利用 catch 方法，回退到之前的版本
        }).catch(() => caches.match('/'))
    );
});