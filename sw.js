self.addEventListener('install', function(event) {
  console.log('sw install',event)
});


self.addEventListener('fetch', function(event) {
  console.log(event.request)
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