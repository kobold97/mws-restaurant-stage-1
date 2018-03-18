var cacheName = 'Global_cache';

self.addEventListener('install', function runWhenInstalling(event){
	event.waitUntil(
		caches.open(cacheName).then(function caheAll(db){
		db.addAll([/*'index.html',
			'restaurant.html',
			'data/restaurants.json',
			'css/styles.css',
			'css/styles_for_sub_page.css',
			'js/dbhelper.js',
			'js/main.js',
			'js/restaurant_info.js',
			'service_worker.js'
			*/]);
	}).catch(function cachingFailed(err){console.log(err);})
		)
});	

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(cacheName).then(function(cache) {
      return cache.match(event.request).then(function (response) {
        return response || fetch(event.request).then(function(response) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});


self.addEventListener('activate', function cachesCleanUp(event){
	event.waitUntil(
		caches.keys().then(function deleteTheCachesIdontNeed(cacheNames){
			return Promise.all(
				cacheNames.filter(function(cache){
					return cache !== cacheName;
				}).map(function removeFilteredCaches(cache_to_remove){
					return cache.delete(cache_to_remove);
				})
			);
		})
		)
});