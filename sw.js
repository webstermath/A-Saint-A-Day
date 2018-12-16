importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js');


if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

workbox.googleAnalytics.initialize()

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

 workbox.routing.registerRoute(
  matchImages,
    workbox.strategies.cacheFirst({
    cacheName: 'image-cache-v1',
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

function matchImages(request){
const pathname = request.url.pathname;
return ['png'].some( ext => pathname.endsWith(ext));
}

 workbox.routing.registerRoute(
  matchFonts,
    workbox.strategies.cacheFirst({
    cacheName: 'fonts-cache-v1',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 30,
        purgeOnQuotaError: false
      }),
    ],
  })
)


function matchFonts(request){
const pathname = request.url.pathname;
return ['woff2'].some( ext => pathname.endsWith(ext));
}

 workbox.routing.registerRoute(
  matchAudio,
    workbox.strategies.cacheFirst({
    cacheName: 'audio-cache-v1',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 31,
        purgeOnQuotaError: true
      }),
    ],
  })
)

function matchAudio(request){
const pathname = request.url.pathname;
return ['mp3'].some( ext => pathname.endsWith(ext));
}

