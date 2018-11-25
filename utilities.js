export function getUrlParam(key,defaultVal){
  let urlParams = new URLSearchParams(window.location.search.substring(1));
  if(urlParams.get(key) === null && defaultVal !== undefined) urlParams = setUrlParam(key, defaultVal);
  return urlParams.get(key);
}

export function setUrlParam(key,val){
  const urlParams = new URLSearchParams(window.location.search.substring(1));
  urlParams.set(key, val);
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

 function pushUrlQuery(query){
    var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname +'?'+ query;
    window.history.pushState({path:newurl},'',newurl);
 }