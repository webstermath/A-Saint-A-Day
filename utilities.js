export function getUrlParam(key,defaultVal){
  let urlParams = new URLSearchParams(window.location.search.substring(1));
  if(urlParams.get(key) === null && defaultVal !== undefined) urlParams = setUrlParam(key, defaultVal);
  return urlParams.get(key);
}

export function setUrlParam(...args){
  const urlParams = new URLSearchParams(window.location.search.substring(1));
  if(args.length > 1) urlParams.set(...args);
  else Object.keys(args[0]).forEach(key => urlParams.set(key, args[0][key]))
  pushUrlQuery(urlParams.toString());
  return urlParams;
}

export function makeDataList(id,list){
  $("#datalists").append($$('datalist').attr('id',id)
  .append(list.map(item => $$('option',item))));
}
export function dateStrToDate(dateStr){
  const [year, month, day] = dateStr.split('-');
  return new Date(year, month - 1, day)
  
}
export function dateToDateStr(date){
  return [date.getFullYear(), date.getMonth()+1, date.getDate()].map(lead0).join('-')
}

 function pushUrlQuery(query){
    var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname +'?'+ query;
    window.history.pushState({path:newurl},'',newurl);
 }
 
 function lead0(n){
  return String(n > 9 ? n : '0' + n );
}