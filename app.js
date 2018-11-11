import {getMonthDay} from './utilities.js';
 function pushUrlQuery(query){
    var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname +'?'+ query;
    window.history.pushState({path:newurl},'',newurl);
 }


  function getDateKey(){
   const today=new Date()
   return dateFns.getDayOfYear(today-1)
  }
// ****** Make Audio App ******
export function getAudioApp(){
 // data
  let urlParams = new URLSearchParams(window.location.search.substring(1));
  if(urlParams.get('dateKey') === null){
    pushUrlQuery('dateKey='+getDateKey()+'&track=0')
    urlParams = new URLSearchParams(window.location.search.substring(1));
  }
  const dateKey = +urlParams.get('dateKey');
  
  const saints = SAINTS[dateKey];
  console.log(saints);

 //elements
 const $container = $$('div').addClass('saint-app');
 const $dateTitle = $$('h2').text(getMonthDay(dateKey+1).join('-')).addClass("saint-app__date-title");
 const feastWidget = saints.length ? getFeastWidget(saints).render() : $$('h3').text('No Saint Found').addClass("no-saint-found");
 const $appNavigation = $$('div').addClass('app-navigation');
 const $prevDateButton = $$('button').text('←').addClass('app-navigation__button app-navigation__button_date_prev');
 const $nextDateButton = $$('button').text('→').addClass('app-navigation__button app-navigation__button_date_next');
 
 //functions
 
 function moveForward(){
  pushUrlQuery('dateKey='+((dateKey+1)%366)+'&track=0');
  //window.location.search = 'dateKey='+((dateKey+1)%366)+'&track=0';
  $container.replaceWith(getAudioApp().render());
 }
 
 function moveBack(){
  pushUrlQuery('dateKey='+((dateKey || 366)-1)+'&track=0');
  //window.location.search = 'dateKey='+((dateKey || 366)-1)+'&track=0';
  $container.replaceWith(getAudioApp().render());
 }
 
 // events
 $prevDateButton.click(moveBack);
 $nextDateButton.click(moveForward);
 
 // render
 
 function render(){
   return $container
   .append($dateTitle)
   .append(feastWidget)
   .append($appNavigation
    .append($prevDateButton)
    .append($nextDateButton)
   );
 }
 
 return {render}
 
}

// ****** Get Feast Widget ******
function getFeastWidget(saints){
  const urlParams = new URLSearchParams(window.location.search.substring(1));
  if(urlParams.get('track') === null){
    //window.location.search = 'dateKey='+urlParams.get('dateKey')+'&track=0'
    pushUrlQuery('dateKey='+urlParams.get('dateKey')+'&track=0');
    urlParams = new URLSearchParams(window.location.search.substring(1));
  }
  const saintIndex = +urlParams.get('track');
  
  // data
 const saint = saints[saintIndex];
 const saintLen = saints.length;
 const audioUrl = saint.url;
 
 // elements
 const $container = $$('div').addClass('feast-widget')
 const $title = $$('h3').text(saint.feast).addClass("feast__title");
 const $player = $$('div').addClass("player")
 const $playerAudio = $$('audio').attr('src',audioUrl).addClass('player__audio')
 $playerAudio[0].load();
 const $playerControls = $$('div').addClass('player-controls')
 const $prevTrackButton = $$('button').text('⮜').addClass('player-controls__button player-controls__button_track_prev');
 if(saintLen < 2) $prevTrackButton.hide();
 const $nextTrackButton = $$('button').text('⮞').addClass('player-controls__button player-controls__button_track_next');
 if(saintLen < 2) $nextTrackButton.hide();
 const $trackControls = $$('div').addClass('track_controls')
 const $trackPlayButton = $$('button').text('►').addClass('track-controls__button track-controls__button_play');

 //functions
 function togglePlay() {
   const method = $playerAudio[0].paused ? 'play' : 'pause';
   $playerAudio[0][method]();
 }
 
 function updateButton() {
  const icon = $playerAudio[0].paused ? '►' : '❚ ❚';
  $trackPlayButton.text(icon);
 }
 
 function resetTime(){
  if($playerAudio[0].currentTime >= saint.end){
   $playerAudio[0].currentTime = saint.start
   $playerAudio[0].pause();
  }
 }
 
 function nextTrack(){
  pushUrlQuery('dateKey='+urlParams.get('dateKey')+'&track='+((saintIndex+1) % saintLen))
  //window.location.search = 'dateKey='+urlParams.get('dateKey')+'&track='+((saintIndex+1) % saintLen)
  $container.replaceWith(getFeastWidget(saints).render());
 }

 function prevTrack(){
  pushUrlQuery('dateKey='+urlParams.get('dateKey')+'&track='+ ((saintIndex || saintLen) - 1))
  //window.location.search = 'dateKey='+urlParams.get('dateKey')+'&track='+ ((saintIndex || saintLen) - 1)
  $container.replaceWith(getFeastWidget(saints).render());
 }
 
  // events
  $trackPlayButton.click(togglePlay);
  $playerAudio[0].addEventListener('play', updateButton);
  $playerAudio[0].addEventListener('pause', updateButton);
  $playerAudio[0].addEventListener('timeupdate',resetTime);
  
  $prevTrackButton.click(prevTrack)
  $nextTrackButton.click(nextTrack)
  if(saintLen < 2){
   $prevTrackButton.click(prevTrack);
   $nextTrackButton.click(nextTrack);
  }

  $playerAudio[0].addEventListener('canplaythrough',function(e){
   $playerAudio[0].currentTime = saint.start
   $trackPlayButton.show();
  },{once: true});
 
 // render
  function render(){
    return $container
    .append($title)
    .append($player
     .append($playerAudio)
     .append($playerControls
      .append($prevTrackButton)
      .append($trackControls
       .append($trackPlayButton)
      )
      .append($nextTrackButton)
     )
    )
  }
  
  return {render}
}




// ****** Make App Controls ******
// function makeAppControls(dateKey, saintLen, saintIndex){
//   // elements
// const audioApp=document.querySelector('#audio_app')
// audioApp.insertAdjacentHTML('beforeend', `<div class="app_controls"></div>`);
// const appControls=audioApp.querySelector('.app_controls');
// appControls.insertAdjacentHTML('beforeend', `<button class="control_button back">←</button>`);
// appControls.insertAdjacentHTML('beforeend', `<button class="control_button forward">→</button>`);
// const forward=appControls.querySelector('.forward');
// const back=appControls.querySelector('.back');
// const audioTrack=audioApp.querySelector('.audio_track');
// console.log(audioTrack)
// console.log(saintLen-1)
// if(saintLen-1){
//   const audioControls=audioTrack.querySelector('.audio_controls');
//   audioControls.insertAdjacentHTML('beforebegin', `<button class="prev_saint_button" title="Previous Saint">⮜</button>`);
//   audioControls.insertAdjacentHTML('afterend', `<button class="next_saint_button" title="Next Saint">⮞</button>`);
//   var prevSaintEl = audioApp.querySelector('.prev_saint_button')
//   var nextSaintEl = audioApp.querySelector('.next_saint_button')
// }
 
 
// // functions
// function moveForward(){
//   const newDateKey=(dateKey+1)%366
//   makeAudioApp(newDateKey)
  
// }
 
// function moveBack(){
//   const newDateKey=(dateKey || 366)-1;
//   makeAudioApp(newDateKey)
// }
 
// function nextSaint(){
//   makeAudioApp(dateKey, (saintIndex+1) % saintLen)
// }
 
//   function prevSaint(){
//   makeAudioApp(dateKey, (saintIndex || saintLen) - 1)
// }
 
// // event handlers
// forward.addEventListener('click', moveForward);
// back.addEventListener('click', moveBack);
// if(saintLen-1){
//   prevSaintEl.addEventListener('click', prevSaint);
//   nextSaintEl.addEventListener('click', nextSaint);
// }
// }

// ****** Make Audio Controls *******
  // function makeAudioControls(data,audioTrack){
  //   // elements
  //   const audioControls=audioTrack.querySelector('.audio_controls');
    
  //   audioControls.insertAdjacentHTML('beforeend', `<button class="player_button" title="Toggle Play">►</button>`);
    

  //   const playerContainer = audioTrack.querySelector('.audio_player_container');
  //   const audio = playerContainer.querySelector('.audio_player');
  //   const playerButton = audioControls.querySelector('.player_button');
   
  // //functions
  // function togglePlay() {
  //   const method = audio.paused ? 'play' : 'pause';
  //   audio[method]();
  // }
  // function updateButton() {
  //   const icon = this.paused ? '►' : '❚ ❚';
  //   playerButton.textContent = icon;
  // }
  // function resetTime(){
  //   if(audio.currentTime>=data.end){
  //   audio.currentTime=data.start
  //   audio.pause();
  //   }
  // }
  //   // event handlers
  //   playerButton.addEventListener('click', togglePlay);
  //   audio.addEventListener('play', updateButton);
  //   audio.addEventListener('pause', updateButton);
  //   audio.addEventListener('timeupdate',resetTime)
  // }