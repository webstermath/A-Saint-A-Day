import {getUrlParam, setUrlParam} from './utilities.js';


export function getAudioWidget(saints){
 const saintIndex = +getUrlParam('track',0)
 
  // data
 const saint = saints[saintIndex];
 const saintLen = saints.length;
 const audioUrl = saint.url;
 if(!audioUrl) $('#wait-layer').hide();
 // elements
 const $container = $$('div').addClass('feast-widget')
 const $title = $$('h3').text(saint.title).addClass("feast__title");
 const $player = $$('div').addClass("player")
 const $playerAudio = $$('audio').attr('src',audioUrl).addClass('player__audio')
 $playerAudio[0].load();
 const $playerControls = $$('div').addClass('player-controls')
 const $prevTrackButton = $$('button').text('<').addClass('player-controls__button player-controls__button_track_prev');
 if(saintLen < 2) $prevTrackButton.hide();
 const $nextTrackButton = $$('button').text('>').addClass('player-controls__button player-controls__button_track_next');
 if(saintLen < 2) $nextTrackButton.hide();
 const $trackControls = $$('div').addClass('track_controls')
 const $trackPlayButton = $$('button').html('<div>►</div>').addClass('track-controls__button track-controls__button_play invisible')

 //functions
 function togglePlay() {
   const method = $playerAudio[0].paused ? 'play' : 'pause';
   $playerAudio[0][method]();
 }
 
 function updateButton() {
  const icon = $playerAudio[0].paused ? '►' : '❚ ❚';
  $trackPlayButton.html(`<div>${icon}</div>`);
 }
 
 function resetTime(){
  if($playerAudio[0].currentTime >= saint.end){
   $playerAudio[0].currentTime = saint.start
   $playerAudio[0].pause();
  }
 }
 
 function nextTrack(){
   changeTrack((saintIndex+1) % saintLen);
 }

 function prevTrack(){
  changeTrack((saintIndex || saintLen) - 1);
 }
 
 function changeTrack(track){
   $('#wait-layer').show();
   setUrlParam('track',track);
   $container.replaceWith(getAudioWidget(saints).render());
 }
 
  // events
  $trackPlayButton.click(togglePlay);
  $playerAudio[0].addEventListener('play', updateButton);
  $playerAudio[0].addEventListener('pause', updateButton);
  $playerAudio[0].addEventListener('timeupdate',resetTime);
  
  $prevTrackButton.click(prevTrack)
  $nextTrackButton.click(nextTrack)
  $playerAudio[0].addEventListener('canplaythrough',function(e){
   $playerAudio[0].currentTime = saint.start
   $trackPlayButton.removeClass('invisible');
   $('#wait-layer').hide();
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