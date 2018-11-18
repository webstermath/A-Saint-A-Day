import {getAudioAppFn} from './app.js';
import {getUrlParam, setUrlParam, makeDataList} from './utilities.js';

// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', function() {
//     navigator.serviceWorker.register('/sw.js').then(function(registration) {
//       // Registration was successful
//       console.log('ServiceWorker registration successful with scope: ', registration.scope);
//     }, function(err) {
//       // registration failed :(
//       console.log('ServiceWorker registration failed: ', err);
//     });
//   });
// }

  function ready(eventHandler){
    if (document.readyState !== 'loading') {
      eventHandler();
    } else {
      document.addEventListener('DOMContentLoaded', eventHandler);
    }
  }
  
// ****** Init ******
async function init(){
  const response = await fetch('https://script.google.com/macros/s/AKfycbyZ8X6XntBJZC5s_0eT08NHan8c1n_htRj_cyxMAuExzrTGDds/exec');
  const data = await response.json();
  if(getUrlParam('type','today') == 'today') setUrlParam('dateKey',+dateFns.getDayOfYear(new Date()))
  const getAudioApp = getAudioAppFn(data);
  console.log(data);
  $('#saint_app').html(getAudioApp().render());

  document.addEventListener("visibilitychange", function(e){
    if(document.hidden) return;
    if(getUrlParam('type') == 'today' && getUrlParam('dateKey') != dateFns.getDayOfYear(new Date())){
     setUrlParam('dateKey',+dateFns.getDayOfYear(new Date()))
     $('#saint_app').html(getAudioApp().render());
      
    }
    
    
  });
}

/********************
***** READY *********
*********************/
ready(init);
