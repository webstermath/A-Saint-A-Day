export function getMonthDay(days,monthsLeft){
  const months=monthsLeft || [31,29,31,30,31,30,31,31,30,31,30,31];
  if(days<=months[0]) return [13-months.length,days]
  return getMonthDay(days-months.shift(),months)
}