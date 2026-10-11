const test=require('node:test'),assert=require('node:assert/strict'),F=require('./freefall.js');
const close=(a,b,tol=1e-9)=>assert.ok(Math.abs(a-b)<tol,`${a} != ${b}`);
test('Recupera queda ideal e expoente dois, com g em SI',()=>{
 const rows=Array.from({length:17},(_,i)=>{const d=.1+.05*i,t=Math.sqrt(2*d/9.81);return[d,t,t,t];});const f=F.analyze(rows);
 close(f.power.n,2);close(f.power.C,9.81/2);close(f.logFixed.g,9.81);close(f.squareOrigin.g,9.81);close(f.squareFree.g,9.81);close(f.squareFree.b,0);
 assert.ok(f.power.uC>0);assert.ok(f.logFixed.ug>0);assert.ok(f.squareOrigin.ug>0);
});
test('Intercepto comum aparece no diagnóstico sem modificar dados',()=>{
 const rows=Array.from({length:17},(_,i)=>{const d=.1+.05*i,t=Math.sqrt(2*d/9.81+.004);return[d,t,t,t];});const before=JSON.stringify(rows);const f=F.analyze(rows);
 close(f.squareFree.g,9.81);close(f.squareFree.b,.004);assert.ok(f.squareOrigin.g<9.81);assert.equal(JSON.stringify(rows),before);
});
test('Valida entradas e variância não nula',()=>{
 assert.throws(()=>F.analyze([[.1,.1,.1],[.2,.2,.2],[.3,.3,.3]],0),/incerteza/);
 assert.throws(()=>F.analyze([[.1,-.1,.1],[.2,.2,.2],[.3,.3,.3]]),/positivos/);
 assert.throws(()=>F.analyze([[.1,.1,.1],[.1,.2,.2],[.1,.3,.3]]),/distintas/);
});
test('Propaga a dispersão e a contribuição instrumental sem arredondamento',()=>{
 const f=F.analyze([[.1,.158,.1572,.158],[.2,.2111,.212,.2122],[.3,.2556,.2561,.2552]]);
 close(f.rows[0].mean,(.158+.1572+.158)/3);close(f.rows[0].total,Math.hypot(f.rows[0].s/Math.sqrt(3),.0001));close(f.rows[0].uq,2*f.rows[0].mean*f.rows[0].total);
});
