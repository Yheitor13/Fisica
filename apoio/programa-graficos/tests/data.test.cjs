const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const D = require('../js/data.js');
const close = (actual, expected, tol = 1e-12) => assert.ok(Math.abs(actual - expected) < tol, `${actual} ≠ ${expected}`);
test('curva informada respeita referência, domínio e coeficientes, sem ajustar pontos', () => {
  const points=[{x:1,y:500},{x:4,y:-500}];
  const curve=D.powerCurve(points,3,2,2);
  close(curve.y[0],.75); close(curve.y.at(-1),12);
  assert.equal(curve.x.length,301);
  assert.throws(()=>D.powerCurve([{x:0},{x:1}],3,2,1));
  assert.throws(()=>D.powerCurve(points,3,2,0));
  assert.throws(()=>D.powerCurve([{x:1},{x:1}],3,2,1));
});
test('CSV brasileiro, cabeçalho reordenado, notação científica e aspas', () => {
  assert.deepEqual(D.validate(D.parse('\uFEFFY;vY;X;vX\r\n"4,8";1e-1;2,50;0,05')), [{x:2.5,vx:.05,y:4.8,vy:.1}]);
  assert.deepEqual(D.validate(D.parse('X,vX,Y,vY\n2.5,0.05,4.8,0.1')), [{x:2.5,vx:.05,y:4.8,vy:.1}]);
  assert.deepEqual(D.validate(D.parse('2,5\t0,05\t4,8\t0,1')), [{x:2.5,vx:.05,y:4.8,vy:.1}]);
});
test('não descarta silenciosamente medidas inválidas', () => {
  for (const source of ['1;0;2;', '1;-1;2;0', '1;0;Infinity;0', 'X;X;Y;vY\n1;0;2;0', '1,5,0,1,3,0,2', '1;0;2;0\n2;0;erro;0', '1e999;0;2;0']) assert.throws(() => D.parse(source));
  assert.throws(() => D.validate([['', '', '', '']]));
  assert.throws(() => D.parse('"1;0;2;0'));
});
test('ajuste exato e translação com offset grande', () => {
  const fit = D.regression([0,1,2,3].map(x => ({x:x+1e9,y:2*x+3,vx:0,vy:1})));
  close(fit.slope,2); close(fit.intercept,3-2e9); close(fit.r2,1); close(fit.predict(1e9+2),7);
});
test('ponderação analítica: ponto impreciso tem influência menor', () => {
  const points=[{x:0,y:0,vy:1},{x:1,y:1,vy:1},{x:2,y:10,vy:10}];
  const fit=D.regression(points,'weighted');
  close(fit.slope,43/35); close(fit.intercept,-8/105);
  assert.ok(D.regression(points).slope > fit.slope);
});
test('casos degenerados não produzem resultado enganoso', () => {
  assert.throws(() => D.regression([{x:0,y:1,vy:1}]));
  assert.throws(() => D.regression([{x:1,y:1,vy:1},{x:1,y:2,vy:1}]));
  assert.throws(() => D.regression([{x:0,y:1,vy:0},{x:1,y:2,vy:1}],'weighted'));
  const flat = D.regression([{x:0,y:2,vy:1},{x:1,y:2,vy:1}]);
  assert.equal(flat.r2,null); assert.equal(flat.slope,0);
});
test('reproduz independentemente os resultados documentados do EX02', () => {
  const matrix=D.parse(fs.readFileSync(path.join(__dirname,'../exemplos/dados-exemplo.csv'),'utf8'));
  const points=D.validate(matrix);
  const fit=D.regression(points,'weighted');
  assert.equal(points.length,9);
  close(fit.slope,1.0491426034754439);
  close(fit.intercept,4.247506620097855);
  close(fit.r2,0.9991171911338197);
  assert.deepEqual(D.validate(D.parse(D.csv(points))),points);
});
