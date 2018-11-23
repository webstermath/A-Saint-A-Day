import {getUrlParam, setUrlParam, makeDataList} from './utilities.js';


// ****** Make Audio App ******
export function getAudioAppFn(saintCalendar){
  
  const saintLookUp = saintCalendar.reduce(function(acc,day,dateKey){
    day.forEach(function(saint,saintIndex){
      acc[saint.title]={dateKey,saintIndex}
    });
    return acc;
  },{});
  
  makeDataList('saint_list',Object.keys(saintLookUp).map(saint => ({html: saint})))
  console.log(saintLookUp);

return function getAudioApp(){
 // data
  
  const dateKey = +getUrlParam('dateKey',+dateFns.getDayOfYear(new Date()))
  
  const saints = saintCalendar[dateKey];
  console.log(saints);
 //elements
 const $container = $$('div').addClass('saint-app');
 const $dateTitle = $$('h2')
 .text(dateFns.format(dateFns.setDayOfYear(new Date(),dateKey),'dddd, MMMM D')).addClass("saint-app__date-title");
 const feastWidget = saints.length ? getFeastWidget(saints).render() : $$('h3').text('No Saint Found').addClass("no-saint-found");
 const $appNavigation = $$('div').addClass('app-navigation');
 const $prevDateButton = $$('button').text('←').addClass('app-navigation__button app-navigation__button_date_prev');
 const $todayButton = $$('button').text('☀').addClass('app-navigation__button app-navigation__button_date_today');
 
 const $nextDateButton = $$('button').text('→').addClass('app-navigation__button app-navigation__button_date_next');
 const $dateInput = $$('_date').addClass('app-navigation__input app-navigation__input_date').attr('title', 'Go To Date');
 const $saintInput = $$('_text').addClass('app-navigation__input app-navigation__input_saint').attr('title', 'Go To Saint')
 .attr('list','saint_list').attr('placeholder','Go To Saint');
 //functions
 //☀

 
 function moveForward(){
   loadOther((dateKey+1)%366);
 }
 
 function moveBack(){
  loadOther((dateKey || 366)-1);
 }
 
 function goToDate(dateStr){
   loadOther(+dateFns.getDayOfYear(new Date(dateStr))+1);
  // setUrlParam('dateKey',+dateFns.getDayOfYear(new Date(dateStr))+1);
  // $container.replaceWith(getAudioApp().render());
 }
 
  function goToSaint(saintName){
   const saint = saintLookUp[saintName];
   if(!saint) return;
   loadOther(saint.dateKey, saint.saintIndex);
  // setUrlParam('dateKey',saint.dateKey);
  // setUrlParam('track',saint.saintIndex);
  // $container.replaceWith(getAudioApp().render());
 }
 
 function loadOther(dateKey,track){
   setUrlParam('type','other');
   setUrlParam('dateKey',dateKey);
   setUrlParam('track',track || 0);
   $container.replaceWith(getAudioApp().render());
 }
  function loadToday(){
   setUrlParam('type','today');
   setUrlParam('dateKey',+dateFns.getDayOfYear(new Date()));
   setUrlParam('track', 0);
   $container.replaceWith(getAudioApp().render());
   
 }
 
 // events
 $prevDateButton.click(moveBack);
 $todayButton.click(loadToday)
 $nextDateButton.click(moveForward);
 $dateInput.change(e => goToDate(e.target.value));
 $saintInput.change(e => goToSaint(e.target.value));
 // render
 
 function render(){
   return $container
   .append($dateTitle)
   .append(feastWidget)
   .append($appNavigation
    .append($prevDateButton)
    .append($todayButton)
    .append($nextDateButton)
    .append($dateInput)
    .append($saintInput)
   );
 }
 
 return {render}
 
}
}

// ****** Get Feast Widget ******
function getFeastWidget(saints){
 const saintIndex = +getUrlParam('track',0)
 
  // data
 const saint = saints[saintIndex];
 const saintLen = saints.length;
 const audioUrl = saint.url;
 
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
 const $trackPlayButton = $$('button').text('►').addClass('track-controls__button track-controls__button_play invisible')

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
  setUrlParam('track',(saintIndex+1) % saintLen);
  $container.replaceWith(getFeastWidget(saints).render());
 }

 function prevTrack(){
  setUrlParam('track',(saintIndex || saintLen) - 1);
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
   $trackPlayButton.removeClass('invisible');
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
