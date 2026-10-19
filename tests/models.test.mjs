import test from 'node:test';
import assert from 'node:assert/strict';
import {owner,migrations,rpcTrace,majority,wordCount,HASHES} from '../dist/models.js';

test('a lost reply and retry duplicates an unprotected non-idempotent operation',()=>{
  assert.equal(rpcTrace(true,false).at(-1).value,2);
  assert.equal(rpcTrace(true,true).at(-1).value,1);
  assert.equal(rpcTrace(false,false).at(-1).value,1);
});
test('ring expansion only transfers keys to new nodes and wraps at the ring boundary',()=>{
  for(const n of [4,5])for(const r of migrations(n,'ring')){
    if(r.before!==r.after)assert.ok(['D','E'].includes(r.after));
  }
  assert.equal(owner(99,3), 'A');
  assert.equal(owner(40,3), 'B');
  assert.ok(migrations(4,'ring').filter(r=>r.before!==r.after).length<migrations(4,'modulo').filter(r=>r.before!==r.after).length);
  assert.equal(migrations(3).filter(r=>r.before!==r.after).length,0);
});
test('two majorities intersect and five nodes tolerate at most two missing votes',()=>{
  assert.equal(majority(5),3);assert.equal(5-2>=majority(5),true);assert.equal(5-3>=majority(5),false);
  for(let n=1;n<=20;n++) assert.ok(2*majority(n)>n);
});
test('MapReduce conserves token counts and safely handles object property names',()=>{
  const r=wordCount('Data systems DATA\n系统 系统 __proto__ constructor');
  assert.equal(r.words.length,7);
  assert.equal(r.counts.reduce((sum,[,n])=>sum+n,0),7);
  assert.deepEqual(Object.fromEntries(r.counts),{['__proto__']:1,constructor:1,data:2,systems:1,'系统':2});
  assert.equal(r.groups['__proto__'].length,1);
  assert.deepEqual(wordCount(' \n ').counts,[]);
});
