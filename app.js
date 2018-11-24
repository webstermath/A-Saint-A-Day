import {getUrlParam, setUrlParam, makeDataList} from './utilities.js';
import {getAudioWidget} from './audio.js';

// ****** Make Audio App ******
export function getPlayerAppFn(saintCalendar){
  
  const saintLookUp = saintCalendar.reduce(function(acc,day,dateKey){
    day.forEach(function(saint,saintIndex){
      acc[saint.title]={dateKey,saintIndex}
    });
    return acc;
  },{});
  
  makeDataList('saint_list',Object.keys(saintLookUp).map(saint => ({html: saint})));

 return function getPlayerApp(){
 // data
  const livesOfTheSaintsUrl='https://librivox.org/lives-of-the-saints-with-reflections-for-every-day-in-the-year-by-alban-butler/';
  const marieThereseUrl='https://catholicaudiobooks.wordpress.com/';
  const dateKey = +getUrlParam('dateKey',+dateFns.getDayOfYear(new Date()))
  
  const saints = saintCalendar[dateKey];
  
 //elements
 const $container = $$('div').addClass('saint-app');
 
 const $appTitle =$$('div').addClass('player-app__title')
  .append($$('h1').text('A Saint A Day'));
 
 const $appSubTitle =$$('div').addClass('player-app__subtitle')
  .append($$('h4').html(`From <a href="${livesOfTheSaintsUrl}" rel="noopener" target="_BLANK">The Lives of The Saints</a>`))
  .append($$('h4').html(`Read by <a href="${marieThereseUrl}" rel="noopener" target="_BLANK">Maria Therese</a>`));

 const $dateTitle = $$('h2').text(dateFns.format(dateFns.setDayOfYear(new Date(),dateKey),'dddd, MMMM D')).addClass("saint-app__date-title");
 const audioWidget = saints.length ? getAudioWidget(saints).render() : $$('h3').text('No Saint Found').addClass("no-saint-found");
 
 const $appNavigation = $$('div').addClass('app-navigation');
 const $prevDateButton = $$('button').text('←').addClass('app-navigation__button app-navigation__button_date_prev');
 const $todayButton = $$('button').text('☀').addClass('app-navigation__button app-navigation__button_date_today');
 const $nextDateButton = $$('button').text('→').addClass('app-navigation__button app-navigation__button_date_next');

 const $appSearch = $$('div').addClass('app-search');
 const $dateLabel =$$('label').text('📅').addClass('app-search__label app-search__label_date').attr('title', 'Go To Date'); //.attr('tabindex',0)
 const $dateInput = $$('_date').addClass('app-search__input app-search__input_date').hide();
 const $saintLabel =$$('label').text('🔎').addClass('app-search__label app-search__label_saint').attr('title', 'Go To Saint'); //.attr('tabindex',0)
 const $saintInput = $$('_text').addClass('app-search__input app-search__input_saint').attr('list','saint_list').attr('placeholder','Go To Saint').hide(); //
 
 //functions
 function moveForward(){
   loadOther((dateKey+1)%366);
 }
 
 function moveBack(){
  loadOther((dateKey || 366)-1);
 }
 
 function goToDate(dateStr){
   loadOther(+dateFns.getDayOfYear(new Date(dateStr))+1);
 }
 
 function goToSaint(saintName){
   const saint = saintLookUp[saintName];
   if(!saint) return;
   loadOther(saint.dateKey, saint.saintIndex);
 }
 
 function loadOther(dateKey,track){
   setUrlParam('type','other');
   setUrlParam('dateKey',dateKey);
   setUrlParam('track',track || 0);
   $container.replaceWith(getPlayerApp().render());
 }
 
 function loadToday(){
   setUrlParam('type','today');
   setUrlParam('dateKey',+dateFns.getDayOfYear(new Date()));
   setUrlParam('track', 0);
   $container.replaceWith(getPlayerApp().render());
 }
 
 // events
 $prevDateButton.click(moveBack);
 $todayButton.click(loadToday)
 $nextDateButton.click(moveForward);
 $dateInput.change(e => goToDate(e.target.value));
 $saintInput.change(e => goToSaint(e.target.value));
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
   );
 }
 
 return {render}
 
 }
}


