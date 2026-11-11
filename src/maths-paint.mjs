// paintCount also exists on the irregular artwork; it is not a grid flag.
export function isCountingGrid(page) {
  return page.paintCount > 0 && page.colorAnswers.length === 0;
}
export function initialPaintColor(page) {
  return isCountingGrid(page) ? page.palette.indexOf('#427d29') : 0;
}
export function paintRegion(page, previous, name, color) {
  if (!page.palette[color]) return previous;
  const next = {...previous};
  if (isCountingGrid(page) && page.palette[color] === '#ffffff') delete next[name];
  else next[name] = color;
  return next;
}
export function gradePaintRegions(regions, paint) {
  const correct=Object.fromEntries(regions.filter(r=>paint[r.id]===r.answer).map(r=>[r.id,paint[r.id]]));
  return {total:regions.length,right:Object.keys(correct).length,correct};
}
