/* $$*/

const camelToKebab= (str) => str.replace(/[A-Z]/g, m => "-" + m.toLowerCase());

const $$ = (tag, attrs={}) =>  (tag[0] == '_') ? $('<input/>').attr('type',tag.slice(1)).attr(attrs) : $(`<${tag}/>`,attrs);
  
$$.data = o => {
  return Object.keys(o).reduce((acc,key) => {
    acc['data-'+camelToKebab(key)]=o[key];
    return acc;
  },{});
 }
   
$$.dataAttr = name => `[data-${voca.camelToKebab(name)}]`;
  
window.$$ = $$;