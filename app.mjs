import {getMonthDay} from './utilities.mjs';




// ****** MAke Audio App ******
export function makeAudioApp(dateKey,saintIndex = 0){
 // data
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
 const saint=saints[saintIndex];
 
 audioApp.insertAdjacentHTML('beforeend', `<div class="audio_track"></div>`);
 const audioTrack=audioApp.querySelector('.audio_track:last-child');
 audioTrack.insertAdjacentHTML('beforeend', `<h3 class="feast_name">${saint.feast}</h3>`);
  
 audioTrack.insertAdjacentHTML('beforeend', `<div class="audio_player_container"></div>`);
 const audioUrl=saint.url//`${saint.url}#t=${saint.start},${saint.end}`;
 const playerContainer=audioTrack.querySelector('.audio_player_container');
 playerContainer.innerHTML=`<audio src="${audioUrl}" class="audio_player">`
 audioTrack.insertAdjacentHTML('beforeend', `<div class="audio_controls"></div>`);
 
 const audioPlayer=playerContainer.querySelector('.audio_player');
 audioPlayer.addEventListener('canplaythrough',function(e){
  audioPlayer.currentTime=saint.start
  makeAudioControls(saint,audioTrack)
  makeAppControls(dateKey, saints.length, saintIndex)
 },{once: true});
  
 audioPlayer.load();

 
}

// ****** Make App Controls ******
function makeAppControls(dateKey, saintLen, saintIndex){
  // elements
 const audioApp=document.querySelector('#audio_app')
 audioApp.insertAdjacentHTML('beforeend', `<div class="app_controls"></div>`);
 const appControls=audioApp.querySelector('.app_controls');
 appControls.insertAdjacentHTML('beforeend', `<button class="control_button back">←</button>`);
 appControls.insertAdjacentHTML('beforeend', `<button class="control_button forward">→</button>`);
 const forward=appControls.querySelector('.forward');
 const back=appControls.querySelector('.back');
 const audioTrack=audioApp.querySelector('.audio_track:last-child');
 if(saintLen){
  const audioControls=audioTrack.querySelector('.audio_controls');
  audioControls.insertAdjacentHTML('beforebegin', `<button class="prev_saint_button" title="Previous Saint">⮜</button>`);
  audioControls.insertAdjacentHTML('afterend', `<button class="next_saint_button" title="Next Saint">⮞</button>`);
  const prevSaintEl = audioControls.querySelector('.prev_saint_button')
  const nextSaintEl = audioControls.querySelector('.next_saint_button')
 }
 
 
 // functions
 function moveForward(){
  const newDateKey=(dateKey+1)%366
  makeAudioApp(newDateKey)
  
 }
 
 function moveBack(){
  const newDateKey=(dateKey || 366)-1;
  makeAudioApp(newDateKey)
 }
 
 function nextSaint(){
   makeAudioApp(newDateKey, saintLen, saintIndex+1 % saintLen)
 }
 
  function prevSaint(){
   makeAudioApp(newDateKey, saintLen, (saintIndex || saintLen) - 1)
 }
 
 // event handlers
 forward.addEventListener('click', moveForward);
 back.addEventListener('click', moveBack);
 if(saintLen){
   prevSaintEl.addEventListener('click', prevSaint);
   nextSaintEl.addEventListener('click', nextSaint);
 }
}

// ****** Make Audio Controls *******
  function makeAudioControls(data,audioTrack){
    // elements
    const audioControls=audioTrack.querySelector('.audio_controls');
    
    audioControls.insertAdjacentHTML('beforeend', `<button class="player_button" title="Toggle Play">►</button>`);
    

    const playerContainer = audioTrack.querySelector('.audio_player_container');
    const audio = playerContainer.querySelector('.audio_player');
    const playerButton = audioControls.querySelector('.player_button');
   
   //functions
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
    // event handlers
    playerButton.addEventListener('click', togglePlay);
    audio.addEventListener('play', updateButton);
    audio.addEventListener('pause', updateButton);
    audio.addEventListener('timeupdate',resetTime)
  }