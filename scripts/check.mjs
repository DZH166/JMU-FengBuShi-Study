import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const ids=new Set(),labs=new Set(['rpc','hash','replication','quorum','2pc','mapreduce']);
let sections=0,questions=0,chars=0;
for(let n=1;n<=8;n++){
  const id=String(n).padStart(2,'0'),c=JSON.parse(await readFile(new URL(`../dist/content/ch${id}.json`,import.meta.url),'utf8'));
  assert.equal(c.id,id);assert.ok(c.title&&c.question&&c.description);assert.equal(c.lessons.length,4);assert.ok(Array.isArray(c.prerequisites));
  for(const [i,l] of c.lessons.entries()){
    assert.equal(l.id,`${id}-${String(i+1).padStart(2,'0')}`);assert.ok(!ids.has(l.id));ids.add(l.id);
    assert.ok(l.title&&l.intro&&l.minutes>0);assert.ok(l.sections.length>=3);assert.ok(l.quiz.length>=2);assert.ok(l.takeaways.length>=2);assert.ok(l.terms.length>=1);
    for(const s of l.sections){assert.ok(s.title&&Array.isArray(s.paragraphs));for(const p of s.paragraphs)assert.equal(typeof p,'string');if(s.table)for(const row of s.table.rows)assert.equal(row.length,s.table.headers.length);sections++;}
    for(const q of l.quiz){assert.ok(q.question&&q.explanation);assert.ok(q.options.length>=2);assert.ok(Number.isInteger(q.correct)&&q.correct>=0&&q.correct<q.options.length);questions++;}
    if(l.lab)assert.ok(labs.has(l.lab),l.lab);
    chars+=JSON.stringify(l).length;
  }
}
const method=JSON.parse(await readFile(new URL('../dist/content/method.json',import.meta.url),'utf8'));
assert.ok(method.title&&method.intro&&method.sections.length);
console.log(JSON.stringify({chapters:8,lessons:ids.size,sections,questions,contentCharacters:chars,valid:true},null,2));
