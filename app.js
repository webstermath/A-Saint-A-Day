import {getUrlParam, setUrlParam, makeDataList, dateStrToDate, dateToDateStr} from './utilities.js';
import {getAudioWidget} from './audio.js';

// ****** Make Audio App ******
export function makePlayerApp(root, saintCalendar){
  if(getUrlParam('type','today') == 'today') setUrlParam('dateKey',dateToDateStr(new Date()));
  
  const saintLookUp = Object.keys(saintCalendar).reduce(function(acc,dateKey){
    const day = saintCalendar[dateKey];
    day.forEach(function(saint,saintIndex){
      acc[saint.title]={dateKey, saintIndex}
    });
    return acc;
  },{});
  
  makeDataList('saint_list',Object.keys(saintLookUp).map(saint => ({html: saint})));
  
  const playerApp = getPlayerApp();
  
   // reloads to today when page is refocused if type is set to today
  document.addEventListener("visibilitychange", function(e){
    if(document.hidden) return;
    const todayDateStr =  dateToDateStr(new Date());
    if(getUrlParam('type') == 'today' && getUrlParam('dateKey') != todayDateStr){
     setUrlParam('dateKey', todayDateStr)
     $(root).html(getPlayerApp().render());
    }
  });
    // detects back and forward events and reloads page accordingly
  window.addEventListener('popstate', function(event) {
      $(root).html(getPlayerApp().render());
  });
  
 $(root).html(playerApp.render());
 
 function getPlayerApp(){
 // data
  const platform = window.navigator.platform;

  const livesOfTheSaintsUrl='https://librivox.org/lives-of-the-saints-with-reflections-for-every-day-in-the-year-by-alban-butler/';
  const marieThereseUrl='https://catholicaudiobooks.wordpress.com/';
  const dateKey = getUrlParam('dateKey', dateToDateStr(new Date()))
  const saints = saintCalendar[dateKey.slice(5)];
  
 //elements
 const $container = $$('div').addClass('player-app');
 
 const $appTitle =$$('div').addClass('player-app__title')
  .append($$('h1').html('A Saint A Day'))
  //.append($$('span').text(' '))
  //.append($$('span').text('beta'));
 
 const $appSubTitle =$$('div').addClass('player-app__subtitle')
  .append($$('h4').html(`From <a href="${livesOfTheSaintsUrl}" rel="noopener" target="_BLANK">The Lives of The Saints</a>`))
  .append($$('h4').html(`Read by <a href="${marieThereseUrl}" rel="noopener" target="_BLANK">Maria Therese</a>`));

 const $dateTitle = $$('h2').text(dateFns.format(dateStrToDate(dateKey),'dddd, MMMM D')).addClass("player-app__date-title");
 const audioWidget = (saints && saints.length) ? getAudioWidget(saints).render() : $$('h3').text('No Saint Found').addClass("no-saint-found");
 
 const $appNavigation = $$('div').addClass('app-navigation');
 const $prevDateButton = $$('button').text('←').addClass('app-navigation__button app-navigation__button_date_prev').attr('title','Previous Day');
 const $todayButton = $$('button').text('☀').addClass('app-navigation__button app-navigation__button_date_today').attr('title','Today');
 const $nextDateButton = $$('button').text('→').addClass('app-navigation__button app-navigation__button_date_next').attr('title','Next Day');

 const $appSearch = $$('div').addClass('app-search');
 const $dateLabel =$$('label').text('📅').addClass('app-search__label app-search__label_date').attr('title', 'Go To Date')
 .addClass(platform.toLowerCase() == 'iphone' ? 'invisible' : '' )//.attr('tabindex',0)
 const $dateInput = $$('_date').addClass('app-search__input app-search__input_date').hide();
 const $saintLabel =$$('label').text('🔎').addClass('app-search__label app-search__label_saint').attr('title', 'Go To Saint')
 .addClass(platform.toLowerCase() == 'iphone' ? 'invisible' : '' ); //.attr('tabindex',0)
 const $saintInput = $$('_text').addClass('app-search__input app-search__input_saint').attr('list','saint_list').attr('placeholder','Go To Saint').hide(); //
 const $reloadButton =$$('button').text('↻').addClass('app-search__button app-search__button_reload').attr('title', 'Reload'); //.attr('tabindex',0)

 
 const $footer = $$('div').addClass('player-footer');
 const $calendarLink = $$('a').addClass("far fa-calendar-alt cal-icon").attr('title','Saint Calendar')
 .attr('href','https://calendar.google.com/calendar/embed?src=asaintaday1%40gmail.com&ctz=America%2FLos_Angeles').attr('target','_BLANK').attr('rel','noopener');
 const $twitterLink = $$('a').addClass("fab fa-twitter twitter-icon").attr('title','Twitter Account')
 .attr('href','https://twitter.com/ASaintADay1').attr('target','_BLANK').attr('rel','noopener');
 const $githubLink = $$('a').addClass('fab fa-github github-icon').attr('title','Github Repository')
 .attr('href','https://github.com/webstermath/A-Saint-A-Day').attr('target','_BLANK').attr('rel','noopener');
 
 
 //functions
 function moveForward(){
   loadOther(dateToDateStr(dateFns.addDays(dateStrToDate(dateKey),1)));
 }
 
 function moveBack(){
  loadOther(dateToDateStr(dateFns.subDays(dateStrToDate(dateKey),1)));
 }
 
 function goToDate(dateStr){
   loadOther(dateStr);
 }
 
 function goToSaint(saintName){
   const saint = saintLookUp[saintName];
   if(!saint) return;
   const currentYear = (new Date()).getFullYear();
   const newDateKey = (saint.dateKey < dateKey.slice(5) ? currentYear + 1 : currentYear) + '-' + saint.dateKey;
   loadOther(newDateKey, saint.saintIndex);
 }
 
 function loadOther(dateKey,track){
   setUrlParam({
     type: 'other',
     dateKey: dateKey,
     track: track || 0
   });
   $container.replaceWith(getPlayerApp().render());
 }
 
 function loadToday(){
   setUrlParam({
     type: 'today',
     dateKey: dateToDateStr(new Date()),
     track: 0
   });
   $container.replaceWith(getPlayerApp().render());
 }
 
 // events
 $prevDateButton.click(moveBack);
 $todayButton.click(loadToday)
 $nextDateButton.click(moveForward);
 $dateInput.change(e => goToDate(e.target.value));
 $saintInput.change(e => goToSaint(e.target.value));
 $reloadButton.click(evt => $container.replaceWith(getPlayerApp().render()))
 $dateLabel.hover(evt => $dateInput.show(), evt => $dateInput.hide());
 $saintLabel.hover(evt => $saintInput.show(),
 evt => $container.mouseover(e => {
   if(e.target.classList.contains('app-search__input_saint')) return;
   $saintInput.hide();
   $container.off('mouseover');
 }));
 
 // render
 function render(){
   return $container
   .append($appSearch
    .append($dateLabel
     .append($dateInput)
    )
    .append($reloadButton)
    .append($saintLabel
     .append($saintInput)
    )
   )
   .append($appTitle)
   .append($appSubTitle)
   .append($dateTitle)
   .append(audioWidget)
   .append($appNavigation
    .append($prevDateButton, $todayButton, $nextDateButton)
   )
   .append($footer.append($calendarLink,$twitterLink,$githubLink));
 }
 
 return {render}
 
 }
}


