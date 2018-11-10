import {makeAudioApp} from './app.js';


window.SAINTS = [];
  
  function ready(eventHandler){
    if (document.readyState !== 'loading') {
      eventHandler();
    } else {
      document.addEventListener('DOMContentLoaded', eventHandler);
    }
  }

  function getDateKey(){
   const today=new Date()
   return dateFns.getDayOfYear(today-1)
  }
  


// ****** Init ******
async function init(){
  const response = await fetch('https://script.google.com/macros/s/AKfycbyZ8X6XntBJZC5s_0eT08NHan8c1n_htRj_cyxMAuExzrTGDds/exec');
  const data = await response.json();
  SAINTS.push(...data);
  console.log(data);
  const dateKey = getDateKey()
  makeAudioApp(dateKey)
  
}


/********************
***** READY *********
*********************/
ready(init);

