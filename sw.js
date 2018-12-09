importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js');


if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}
//new RegExp('8000\/$')
//new RegExp('\/')http://127.0.0.1:8000/?type=today&dateKey=2018-11-29&track=0
//new RegExp('8000\/?\?')
//new RegExp('8000\/?\??[^.]*$')
//workbox.strategies.networkFirst()

//workbox.strategies.cacheFirst
//workbox.strategies.staleWhileRevalidate()


/*
workbox.routing.registerRoute(
  new RegExp('/images/'),
  workbox.strategies.cacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new workbox.expiration.Plugin({
        // Only cache requests for a week
        maxAgeSeconds: 7 * 24 * 60 * 60,
        // Only cache 10 requests.
        maxEntries: 10,
      }),
    ]
  })
);
*/
workbox.routing.registerRoute(
  matchGeneral,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'general-cache-v1'
    })
);
function matchGeneral(request){
 const pathname = request.url.pathname;
 return ['mp3','woff2','png'].every( ext => !pathname.endsWith(ext));
}


// workbox.routing.registerRoute(
//   matchImages,
//   workbox.strategies.staleWhileRevalidate({
//     cacheName: 'image-cache-v1'
//     })
// );
 workbox.routing.registerRoute(
  matchImages,
    workbox.strategies.cacheFirst({
    cacheName: 'image-cache-v1',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 1,
        purgeOnQuotaError: true
      }),
    ],
  })
)


function matchImages(request){
const pathname = request.url.pathname;
return ['png'].some( ext => pathname.endsWith(ext));
}

// workbox.routing.registerRoute(
//   matchFonts,
//   workbox.strategies.staleWhileRevalidate({
//     cacheName: 'fonts-cache-v1'
//     })
// );
 workbox.routing.registerRoute(
  matchFonts,
    workbox.strategies.cacheFirst({
    cacheName: 'fonts-cache-v1',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 7,
        purgeOnQuotaError: true
      }),
    ],
  })
)


function matchFonts(request){
const pathname = request.url.pathname;
return ['woff2'].some( ext => pathname.endsWith(ext));
}



// workbox.routing.registerRoute(
//   matchAudio,
//   workbox.strategies.staleWhileRevalidate({
//   cacheName: 'audio-cache-v1'
//   })
//);
 workbox.routing.registerRoute(
  matchAudio,
    workbox.strategies.cacheFirst({
    cacheName: 'audio-cache-v1',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 30,
        purgeOnQuotaError: true
      }),
    ],
  })
)


function matchAudio(request){
const pathname = request.url.pathname;
return ['mp3'].some( ext => pathname.endsWith(ext));
}





// self.addEventListener('install', function(event) {
//   console.log('sw install',event)
// });

// self.addEventListener('activate', function(event) {
//   console.log('sw activate',event)


// });

// self.addEventListener('fetch', function(event) {

// });