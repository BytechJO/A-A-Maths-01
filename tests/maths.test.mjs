import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {isCountingGrid,initialPaintColor,paintRegion,gradePaintRegions} from '../src/maths-paint.mjs';
const pages=JSON.parse(fs.readFileSync(new URL('../src/maths-data.json',import.meta.url)));
const asset=p=>new URL('../public/'+p,import.meta.url);
const regions=JSON.parse(fs.readFileSync(new URL('../src/maths-paint-regions.json',import.meta.url)));
test('Repeated-number parts color independently and each is required for completion',()=>{
 for(const p of pages.filter(p=>p.colorAnswers.length)){
  const rs=regions[p.name];assert.ok(rs.length>p.colorAnswers.length);
  assert.equal(new Set(rs.map(r=>r.id)).size,rs.length);
  const first=rs.find(a=>rs.some(b=>a.id!==b.id&&a.answer===b.answer)),other=rs.find(r=>r.id!==first.id&&r.answer===first.answer);
  assert.ok(other);
  const state=paintRegion(p,{},first.id,first.answer);
  assert.equal(state[other.id],undefined);
  assert.equal(gradePaintRegions(rs,state).right,1);
  const complete=Object.fromEntries(rs.map(r=>[r.id,r.answer]));
  assert.equal(gradePaintRegions(rs,complete).right,rs.length);
  complete[first.id]=(first.answer+1)%p.palette.length;
  const retry=gradePaintRegions(rs,complete);
  assert.equal(retry.right,rs.length-1);assert.equal(retry.correct[first.id],undefined);
  assert.equal(retry.correct[other.id],other.answer);
 }
});
test('Flowers, beach and train use shape fills and valid first colors, never counting rectangles',()=>{
 for(const index of [0,1,11]){
  const p=pages[index];assert.ok(p.paintCount>0);assert.equal(isCountingGrid(p),false);
  assert.equal(initialPaintColor(p),0);
  assert.deepEqual(paintRegion(p,{},'b0',0),{b0:0});
  assert.deepEqual(paintRegion(p,{},'b0',99),{});
 }
 assert.equal(isCountingGrid(pages[5]),true);
 assert.equal(pages[5].palette[initialPaintColor(pages[5])],'#427d29');
});
test('Counting eraser removes a square without clearing other squares, and recoloring replaces its color',()=>{
 const original={b0:10,b1:12};
 assert.deepEqual(paintRegion(pages[5],original,'b0',0),{b1:12});
 assert.deepEqual(paintRegion(pages[5],original,'b0',4),{b0:4,b1:12});
 assert.deepEqual(original,{b0:10,b1:12});
});
test('Maths unit 1 contains all 13 original pages and playable audio assets',()=>{
 assert.equal(pages.length,13);
 for(const [index,p] of pages.entries()){
  assert.equal(p.name,'p'+(index+1));
  assert.ok(fs.statSync(asset('maths/'+p.name+'.svg')).size>100);
  for(const i of p.items){
   if(i.file)assert.ok(fs.statSync(asset('assets/audio/maths/'+i.file)).size>100);
   if(/^b\d+$|^drag\d+$/.test(i.name))assert.ok(fs.existsSync(asset('maths/'+p.name+'-'+i.name+'.svg')));
  }
 }
});
test('All drag activities have matching unique numbered targets',()=>{
 for(const p of pages.filter(p=>p.items.some(i=>/^drag\d+$/.test(i.name)))){
  const ids=prefix=>p.items.filter(i=>new RegExp('^'+prefix+'\\d+$').test(i.name)).map(i=>i.name.slice(4)).sort();
  assert.deepEqual(ids('drag'),ids('drop'));assert.equal(ids('drag').length,5);
 }
});
test('Original counting answer keys and ordinal colors are retained',()=>{
 for(const [index,answers] of [[2,[3,3,1,2,1]],[3,[2,0,3,1,3]],[4,[2,0,0,1,2]]])
  assert.deepEqual(pages[index].answers.map(row=>row.indexOf('1')),answers);
 assert.deepEqual(pages[12].answers[3],['1','0']);
 assert.equal(pages[5].items.filter(i=>/^b\d+$/.test(i.name)).length,110);
 assert.equal(pages[11].colorAnswers.length,8);
});
test('Word-search endpoints spell all thirteen original number words',()=>{
 const p=pages[10];
 const words=p.solutions.map(([a,b])=>{let word='';const dx=Math.sign(b[0]-a[0]),dy=Math.sign(b[1]-a[1]);for(let n=0;n<=Math.max(Math.abs(b[0]-a[0]),Math.abs(b[1]-a[1]));n++)word+=p.grid[a[1]+n*dy][a[0]+n*dx];return word;});
 assert.deepEqual(words,['TWELVE','NINE','THREE','ELEVEN','FIVE','ZERO','SEVEN','TWO','FOUR','ONE','SIX','TEN','EIGHT']);
});

