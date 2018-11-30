importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js');


if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

workbox.routing.registerRoute(
  new RegExp('.*'),
  workbox.strategies.networkFirst()
);



self.addEventListener('install', function(event) {
  console.log('sw install',event)
});

self.addEventListener('activate', function(event) {
  console.log('sw activate',event)


});

self.addEventListener('fetch', function(event) {
  //console.log(event.request)
  // event.respondWith(
  //   caches.match(event.request)
  //     .then(function(response) {
  //       // Cache hit - return response
  //       if (response) {
  //         return response;
  //       }
  //       return fetch(event.request);
  //     }
  //   )
  // );
});