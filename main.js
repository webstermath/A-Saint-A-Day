import {getAudioApp} from './app.js';


window.SAINTS = [];
  
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
  SAINTS.push(...data);
  console.log(data);
  //const dateKey = getDateKey()
  $('#saint_app').html(getAudioApp().render());
  
}


/********************
***** READY *********
*********************/
ready(init);

