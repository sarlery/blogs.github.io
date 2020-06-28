const CACHE_NAME = 'v1.0.2';

self.addEventListener('install',async() => {
    const cache = await caches.open(CACHE_NAME);
    // 把资源放入 cache 中
    await cache.addAll([
        "/",
        "/src/favicon.ico",
        "/src/index.css",
        "/src/index.html",
        "/src/sun.png",
        "/src/index.js",
    ]);
    await self.skipWaiting();
});

self.addEventListener('activate', async () => {
    const keys = await caches.keys();
    for(let k of keys){
        if(k !== CACHE_NAME){
            await caches.delete(k);
        }
    }
    await self.clients.claim();
});

self.addEventListener('fetch',async (event) => {
    // 注意，event.request 页面发出的请求
    // 而 caches.match 根据请求匹配本地缓存中有没有相应的资源
    async function getResponse(){
        try {
            if(navigator.onLine){   // onLine 是 true，表示有网
                let response = await fetch(event.request);
                let cache = await caches.open(CACHE_NAME);
                await cache.put(event.request, response.clone());
                return response;
            }else{
                return await caches.match(event.request);
            }
        } catch (error) {
            // 也有可能在请求途中我们网断了，这时候需要判断一下缓存中有没有数据
            let res = await caches.match(event.request);
            if(!res)    return caches.match('/');
            return res;
        }
    }

    event.respondWith(
        getResponse()
    );
});