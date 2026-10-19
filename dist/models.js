// Small, deterministic teaching models. These do not implement production protocols.
export const HASHES=[2,7,12,17,22,27,32,37,42,47,52,57,62,67,72,77,82,87,92,97];
export const TOKENS=[{name:'A',pos:10},{name:'B',pos:40},{name:'C',pos:75},{name:'D',pos:90},{name:'E',pos:55}];
export function owner(hash,n,mode='ring'){
  const nodes=TOKENS.slice(0,n);
  if(mode==='modulo') return nodes[hash%n].name;
  const sorted=nodes.toSorted((a,b)=>a.pos-b.pos);
  return (sorted.find(x=>x.pos>=hash)||sorted[0]).name;
}
export function migrations(n=4,mode='ring'){
  return HASHES.map((hash,i)=>({key:`K${String(i+1).padStart(2,'0')}`,hash,before:owner(hash,3,mode),after:owner(hash,n,mode)}));
}
export function rpcTrace(drop=false,idempotent=true){
  return [
    {event:'客户端发出请求',detail:'request_id = enroll-42，执行选课，已选人数初始为 0。',value:0},
    {event:'服务端执行并记录结果',detail:'已选人数变为 1；启用去重时，将请求 ID 与结果一并保留。',value:1},
    {event:drop?'回复在网络中丢失':'客户端收到成功回复',detail:drop?'服务端已经执行；客户端仍然不知道结果。':'请求完成，客户端知道结果。',value:1,clientKnown:!drop},
    ...(drop?[
      {event:'客户端超时，重试相同请求',detail:'超时只能说明没有及时收到回复，不能推出服务端没有执行。',value:1},
      {event:idempotent?'服务端识别重复 ID':'服务端再次执行',detail:idempotent?'返回保存的首次结果，人数保持为 1。':'没有去重，已选人数错误地增加到 2。',value:idempotent?1:2},
      {event:'客户端收到重试的回复',detail:idempotent?'客户端获知成功，服务端仍只执行了一次。':'客户端虽然获知成功，服务端却已经执行了两次，重复副作用仍然存在。',value:idempotent?1:2,clientKnown:true}
    ]:[])
  ];
}
export function majority(n){return Math.floor(n/2)+1;}
export function wordCount(text){
  const words=text.toLowerCase().trim().split(/\s+/u).filter(Boolean);
  const groups=Object.create(null);for(const word of words) (groups[word]??=[]).push(1);
  return {words,groups,counts:Object.entries(groups).map(([word,values])=>[word,values.length]).sort(([a],[b])=>a.localeCompare(b))};
}
