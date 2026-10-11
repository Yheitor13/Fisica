(function(root){
'use strict';
const L=typeof module!=='undefined'?require('./lab.js'):root.Lab;
function analyze(input,instrument=0.0001){
 instrument=L.uncertainty(instrument);
 if(!Array.isArray(input)||input.length<3)throw Error('Use pelo menos três alturas distintas.');
 const rows=input.map((r,i)=>{
  if(!Array.isArray(r)||r.length<3)throw Error('Cada altura precisa de pelo menos dois tempos.');
  const d=Number(r[0]);if(!Number.isFinite(d)||d<=0)throw Error('Alturas em metros devem ser positivas.');
  const times=r.slice(1).map(Number);if(times.some(t=>!Number.isFinite(t)||t<=0))throw Error('Tempos devem ser positivos.');
  const z=L.treatment(times,instrument);if(!(z.total>0))throw Error('O ajuste exige incerteza do tempo maior que zero.');
  return {point:i+1,d,times,...z,X:Math.log(d),Y:Math.log(z.mean),uY:z.total/z.mean,q:z.mean*z.mean,uq:2*z.mean*z.total};
 });
 if(new Set(rows.map(r=>r.d)).size<3)throw Error('Use pelo menos três alturas distintas.');
 const log=L.regression(rows.map(r=>({x:r.X,y:r.Y,u:r.uY})));
 if(log.a<=0)throw Error('A relação entre altura e tempo precisa ser crescente.');
 const n=1/log.a,un=log.ua/log.a**2,C=Math.exp(-log.b/log.a);
 const da=log.b/log.a**2,db=-1/log.a;
 const v=da*da*log.ua**2+db*db*log.ub**2+2*da*db*log.covariance;
 const power={n,un,C,uC:C*Math.sqrt(Math.max(0,v))};
 const sum=(fn)=>rows.reduce((s,r)=>s+fn(r),0);
 const W=sum(r=>1/r.uY**2),b2=sum(r=>(r.Y-.5*r.X)/r.uY**2)/W,ub2=1/Math.sqrt(W);
 const glog=2*Math.exp(-2*b2),ulog=2*glog*ub2;
 const chiLog=sum(r=>((r.Y-.5*r.X-b2)/r.uY)**2);
 const logFixed={b:b2,ub:ub2,g:glog,ug:ulog,chi:chiLog,df:rows.length-1,reduced:chiLog/(rows.length-1)};
 const Sxx=sum(r=>r.d*r.d/r.uq**2),a0=sum(r=>r.d*r.q/r.uq**2)/Sxx,ua0=1/Math.sqrt(Sxx);
 const chi0=sum(r=>((r.q-a0*r.d)/r.uq)**2);
 const squareOrigin={a:a0,ua:ua0,g:2/a0,ug:2*ua0/a0**2,chi:chi0,df:rows.length-1,reduced:chi0/(rows.length-1)};
 const sq=L.regression(rows.map(r=>({x:r.d,y:r.q,u:r.uq})));
 const squareFree={...sq,g:2/sq.a,ug:2*sq.ua/sq.a**2,d0:-sq.b/sq.a};
 if(sq.a<=0||a0<=0)throw Error('A inclinação de t² por altura deve ser positiva.');
 const result={instrument,rows,log,power,logFixed,squareOrigin,squareFree};
 function check(value){if(typeof value==='number'&&!Number.isFinite(value))throw Error('Resultado fora do intervalo numérico.');if(value&&typeof value==='object')Object.values(value).forEach(check);}
 check(result);return result;
}
const api={analyze};root.FreeFall=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
