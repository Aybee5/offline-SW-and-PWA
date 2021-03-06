const version = 'v3'
self.addEventListener("install", (event)=>{
    event.waitUntil(
        caches.open(version)
        .then((cache)=>{
            return cache.addAll(['./offline.html',
                                'css/grid.css',
                                'css/style.css'])
        })
    )
})
self.addEventListener("activate", (event)=>{
    event.waitUntil(
        caches.keys()
        .then((keys)=>{
            return new Promise.all(keys.filter((key)=>{
                return key !== version
            }).map((key)=>{
                return caches.delete(key)
            }))
        })
    )
})
self.addEventListener("fetch", (event)=>{
    event.respondWith(
        caches.match(event.request)
        .then((res)=>{
            if (res)
                return res
            if (!navigator.onLine)
                return caches.match(new Request('/offline.html'))
            return fetchAndUpdate(event.request)
        })
    )
})

function fetchAndUpdate(request){
    return fetch(request)
    .then((res)=>{
        if (res){
            return caches.open(version)
            .then((cache)=>{
                return cache.put(request, res.clone())
                .then(()=>{
                    return res
                })
            })
        }
    })
}

