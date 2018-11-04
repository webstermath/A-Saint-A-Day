const SAINTS = [];
  
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
   const monthDays=[31,29,31,30,31,30,31,31,30,31,30,31];
   
   return monthDays.slice(0, today.getMonth()).reduce(function(acc,days){return acc+days},today.getDate())-1
  }
  
// ****** Make Audio Controls *******
  function makeAudioControls(data,audioTrack){
    const audioControls=audioTrack.querySelector('.audio_controls');
    audioControls.insertAdjacentHTML('beforeend', `<button class="player_button" title="Toggle Play">►</button>`);
    const playerContainer = audioTrack.querySelector('.audio_player_container');
    const audio = playerContainer.querySelector('.audio_player');
    const playerButton = audioControls.querySelector('.player_button');
   
   function togglePlay() {
     const method = audio.paused ? 'play' : 'pause';
     audio[method]();
   }
   function updateButton() {
    const icon = this.paused ? '►' : '❚ ❚';
    playerButton.textContent = icon;
   }
   function resetTime(){
    if(audio.currentTime>=data.end){
     audio.currentTime=data.start
     audio.pause();
    }
   }
    playerButton.addEventListener('click', togglePlay);
    audio.addEventListener('play', updateButton);
    audio.addEventListener('pause', updateButton);
    audio.addEventListener('timeupdate',resetTime)
  }
// ******* END makeAudioControls(data) ******
function makeAudioApp(dateKey){
 const audioApp=document.querySelector('#audio_app')
 const saints=SAINTS[dateKey];
 console.log(saints)
 audioApp.innerHTML='';
 audioApp.insertAdjacentHTML('beforeend', `<h2 class="feast_date">${getMonthDay(dateKey+1).join('-')}</h2>`);
 if(!saints.length){
   audioApp.insertAdjacentHTML('beforeend', `<h3>No Data</h3>`);
   makeAppControls(dateKey)
   return;
 }
  // TODO:
 // make player for all saints
 const saint=saints[0];
 
 audioApp.insertAdjacentHTML('beforeend', `<div class="audio_track"></div>`);
 const audioTrack=audioApp.querySelector('.audio_track:last-child');
 audioTrack.insertAdjacentHTML('beforeend', `<h3 class="feast_name">${saint.feast}</h3>`);
  
 audioTrack.insertAdjacentHTML('beforeend', `<div class="audio_player_container"></div>`);
 const audioUrl=saint.url//`${saint.url}#t=${saint.start},${saint.end}`;
 const playerContainer=audioTrack.querySelector('.audio_player_container');
 playerContainer.innerHTML=`<audio src="${audioUrl}" class="audio_player">`
 audioTrack.insertAdjacentHTML('beforeend', `<div class="audio_controls"></div>`);
 
 const audioPlayer=playerContainer.querySelector('.audio_player');
 console.log(new Date())
 audioPlayer.addEventListener('canplay',function(e){
 console.log(new Date())
  audioPlayer.currentTime=saint.start
  makeAudioControls(saint,audioTrack)
  makeAppControls(dateKey)
 },{once: true})


 
}
function makeAppControls(dateKey){
 const audioApp=document.querySelector('#audio_app')
 audioApp.insertAdjacentHTML('beforeend', `<div class="app_controls"></div>`);
 const appControls=audioApp.querySelector('.app_controls');
 appControls.insertAdjacentHTML('beforeend', `<button class="control_button back">←</button>`);
 appControls.insertAdjacentHTML('beforeend', `<button class="control_button forward">→</button>`);
 const forward=appControls.querySelector('.forward');
 const back=appControls.querySelector('.back');
 
 function moveForward(){
  const newDateKey=(dateKey+1)%366
  makeAudioApp(newDateKey)
 }
 
 function moveBack(){
  const newDateKey=(dateKey || 366)-1;
  makeAudioApp(newDateKey)
 }
 
 forward.addEventListener('click', moveForward);
 back.addEventListener('click', moveBack);

}


/********************
***** READY *********
*********************/
ready(function(){
  fetch('https://script.google.com/macros/s/AKfycbyZ8X6XntBJZC5s_0eT08NHan8c1n_htRj_cyxMAuExzrTGDds/exec')
  .then(r => r.json())
  .then(r => SAINTS.push(...r))
  .then(console.log)
  .then(function(){
    const dateKey=getDateKey();
    makeAudioApp(dateKey)

  })
  
});
