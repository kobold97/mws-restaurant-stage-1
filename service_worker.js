/*I thought that this will be the easiest part but while coding service_worker.js I had so many
questions and so many errors. My biggest problem was caching all requests. 
At first I tried to do it in the 'install' event, but all static files were not enough to render
the whole website. I could only cache a few static files (the one in the comment in the 'install'
event in the array) while my network log in devTools was showing much more requests being send.
So I abandoned 'install' event and cached everything in the 'fetch' event. I'm quite new to service
workers so I will appreciate any kind of feedback.*/

/*  I named my only cache in the app and stored it in the variable */
var cacheName = 'Global_cache';
/*This is unnecessary and does nothing but I will leave it because I'm not sure weather
it was a good choice to cache nothing here and everything in the 'fetch' event so I might use it
later*/
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

/*Here I cache every single request and store it in my cache.
The mechanism here assures that later on if response would be found in the cache
it would serve it from there instead of going to the network*/
self.addEventListener('fetch', function cachingOrServingRequests(event) {
  event.respondWith(
    caches.open(cacheName).then(function findResponseInCache(cache) {
      return cache.match(event.request).then(function serveResponseIfFound(response) {
        return response || fetch(event.request).then(function ifNotServeFromNetworkAndCache(response) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});

/*Now this bit here is for the future. If I will ever have more caches than one
than I will delete the ones that are not needed*/
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
/*And that's it. I'm really curious how could I improve that code*/