/* Mathematical expressions parsed as data. No executable user code. */
(function(root){
'use strict';
const fail=m=>{throw Error(m)};
const number=s=>{if(typeof s==='number')return Number.isFinite(s)?s:fail('Valor não finito.');s=String(s??'').trim();if(!s)return fail('Célula vazia.');if(!/^[+-]?(?:\d+(?:[.,]\d*)?|[.,]\d+)(?:e[+-]?\d+)?$/i.test(s))fail('Número inválido: '+s);const n=Number(s.replace(',','.'));return Number.isFinite(n)?n:fail('Número fora do intervalo.');};
const functions=new Set(['sqrt','ln','log10','abs','exp','sin','cos','asin']);
function parse(source,known=[]){
 if(source.length>1000)fail('Use uma expressão com até 1.000 caracteres.');
 const pieces=source.split(/(\[[^\]]+\])/g);source=pieces.map(s=>s.startsWith('[')?s:s.replace(/²/g,'^2').replace(/³/g,'^3').replace(/[×·]/g,'*').replace(/÷/g,'/').replace(/−/g,'-').replace(/√/g,'sqrt')).join('');
 const tokens=[];let pos=0;
 while(pos<source.length){const s=source.slice(pos);let m;if(/^\s/.test(s)){pos++;continue;}if(m=s.match(/^\[([^\]]+)\]/)){tokens.push({type:'id',value:m[1]});}
 else if(m=s.match(/^(?:\d+(?:[.,]\d*)?|[.,]\d+)(?:e[+-]?\d+)?/i)){tokens.push({type:'num',value:number(m[0])});}
 else if(m=s.match(/^[\p{L}_][\p{L}\p{N}_]*/u)){const v=m[0];if(known.includes(v)||functions.has(v)||['pi','π','e'].includes(v))tokens.push({type:'id',value:v});else{let rem=v;const split=[];const choices=[...known,'π'].sort((a,b)=>b.length-a.length);while(rem){const k=choices.find(k=>rem.startsWith(k));if(!k)break;split.push({type:'id',value:k});rem=rem.slice(k.length);}if(!rem&&split.length)tokens.push(...split);else tokens.push({type:'id',value:v});}}
 else if(m=s.match(/^[+\-*/^()]/)){tokens.push({type:m[0]});}else fail('Símbolo não permitido: '+s[0]);pos+=m[0].length;
 if(tokens.length>256)fail('Expressão muito longa.');}
 const ts=[];for(const t of tokens){const prev=ts.at(-1);if(prev&&(['num','id',')'].includes(prev.type))&&(['num','id','('].includes(t.type))&&!(prev.type==='id'&&functions.has(prev.value)&&t.type==='('))ts.push({type:'*'});ts.push(t);}
 let i=0;const peek=()=>ts[i]?.type;const take=t=>{if(peek()!==t)fail('Esperado “'+t+'” na expressão.');return ts[i++];};
 function atom(){if(peek()==='num')return {type:'num',value:ts[i++].value};if(peek()==='('){i++;const a=expr(0);take(')');return a;}if(peek()==='id'){const v=ts[i++].value;if(functions.has(v)){take('(');const a=expr(0);take(')');return {type:'fn',name:v,a};}if(['pi','π','e'].includes(v))return {type:'num',value:v==='e'?Math.E:Math.PI};return {type:'var',name:v};}fail('Expressão incompleta.');}
 function expr(min){let a;if(peek()==='+'||peek()==='-'){const op=ts[i++].type;a={type:'unary',op,a:expr(25)};}else a=atom();while(true){const op=peek(),prec={'+':10,'-':10,'*':20,'/':20,'^':30}[op];if(prec===undefined||prec<min)break;i++;a={type:'op',op,a,b:expr(op==='^'?prec:prec+1)};}return a;}
 if(!ts.length)fail('Digite uma expressão.');const tree=expr(0);if(i!==ts.length)fail('Expressão inválida.');return tree;
}
function variables(tree){const names=new Set();function walk(t){if(t.type==='var')names.add(t.name);if(t.a)walk(t.a);if(t.b)walk(t.b);}walk(tree);return [...names];}
function evaluate(tree,values,derivatives=false){
 const make=(v,g={})=>{if(!Number.isFinite(v))fail('Resultado indefinido ou fora do intervalo.');if(derivatives&&Object.values(g).some(x=>!Number.isFinite(x)))fail('Derivada não definida neste ponto.');return {v,g};};
 const scale=(g,f)=>Object.fromEntries(Object.entries(g).map(([k,v])=>[k,v===0?0:v*f]));
 const combine=(a,b,fa,fb)=>{const g={};for(const k of new Set([...Object.keys(a),...Object.keys(b)]))g[k]=(a[k]===undefined||a[k]===0?0:a[k]*fa)+(b[k]===undefined||b[k]===0?0:b[k]*fb);return g;};
 function ev(t){if(t.type==='num')return make(t.value);if(t.type==='var'){if(!Object.hasOwn(values,t.name))fail('Variável não encontrada: '+t.name);return make(number(values[t.name]),derivatives?{[t.name]:1}:{});}const a=ev(t.a);if(t.type==='unary')return make(t.op==='-'?-a.v:a.v,scale(a.g,t.op==='-'?-1:1));
 if(t.type==='fn'){let v,d;switch(t.name){case 'sqrt':if(a.v<0)fail('Raiz exige valor não negativo.');v=Math.sqrt(a.v);d=1/(2*v);break;case 'ln':case 'log10':if(a.v<=0)fail('Logaritmo exige valor positivo.');v=t.name==='ln'?Math.log(a.v):Math.log10(a.v);d=1/(a.v*(t.name==='ln'?1:Math.LN10));break;case 'abs':if(derivatives&&a.v===0&&Object.keys(a.g).length)fail('abs não tem derivada em zero.');v=Math.abs(a.v);d=Math.sign(a.v);break;case 'exp':v=Math.exp(a.v);d=v;break;case 'sin':v=Math.sin(a.v);d=Math.cos(a.v);break;case 'cos':v=Math.cos(a.v);d=-Math.sin(a.v);break;case 'asin':if(Math.abs(a.v)>1)fail('Arco seno fora do domínio.');v=Math.asin(a.v);d=1/Math.sqrt(1-a.v*a.v);break;}return make(v,scale(a.g,d));}
 const b=ev(t.b);switch(t.op){case '+':return make(a.v+b.v,combine(a.g,b.g,1,1));case '-':return make(a.v-b.v,combine(a.g,b.g,1,-1));case '*':return make(a.v*b.v,combine(a.g,b.g,b.v,a.v));case '/':if(b.v===0)fail('Divisão por zero.');return make(a.v/b.v,combine(a.g,b.g,1/b.v,-a.v/(b.v*b.v)));case '^':{if(a.v<0&&!Number.isInteger(b.v))fail('Potência não real.');if(a.v===0&&b.v<=0)fail('Potência indefinida em zero.');const v=Math.pow(a.v,b.v);const da=b.v===0?0:b.v*Math.pow(a.v,b.v-1);const db=Object.keys(b.g).length?v*Math.log(a.v):0;return make(v,combine(a.g,b.g,da,db));}}}
 return ev(tree);
}
function propagate(tree,values,uncertainties){const {v,g}=evaluate(tree,values,true);let terms=[];for(const k of variables(tree)){if(!Object.hasOwn(uncertainties,k))fail('Informe a incerteza de '+k);const u=number(uncertainties[k]);if(u<0)fail('Incertezas devem ser não negativas.');terms.push((g[k]||0)*u);}const u=Math.hypot(...terms);if(!Number.isFinite(u))fail('Incerteza fora do intervalo.');return {value:v,uncertainty:u};}
function statistics(values){const xs=values.map(number);if(!xs.length)fail('A coluna está vazia.');let mean=0,m2=0,n=0;for(const x of xs){n++;let delta=x-mean;mean+=delta/n;m2+=delta*(x-mean);}if(!Number.isFinite(mean)||!Number.isFinite(m2))fail('Estatística fora do intervalo numérico.');const s=n>1?Math.sqrt(Math.max(0,m2/(n-1))):null;return {n,mean,min:Math.min(...xs),max:Math.max(...xs),s,sem:s===null?null:s/Math.sqrt(n)};}
function parseDelimited(text){text=text.replace(/^\uFEFF/,'').replace(/\r\n?/g,'\n');const first=text.split('\n')[0];const delimiter=first.includes('\t')?'\t':first.includes(';')?';':',';const rows=[];let row=[],cell='',quoted=false;for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++;}else if(quoted||cell==='')quoted=!quoted;else fail('Aspas inválidas no CSV.');}else if(!quoted&&(c===delimiter||c==='\n')){row.push(cell);cell='';if(c==='\n'){rows.push(row);row=[];}}else cell+=c;}if(quoted)fail('Aspas não fechadas no CSV.');row.push(cell);rows.push(row);while(rows.length&&rows.at(-1).every(x=>!x.trim()))rows.pop();if(!rows.length)fail('Nenhum dado encontrado.');if(rows.length>10001||Math.max(...rows.map(r=>r.length))>100)fail('Limite: 10.000 linhas e 100 colunas.');return rows;}
const quote=s=>'"'+String(s).replace(/"/g,'""')+'"';
function delimited(headers,rows,separator=';'){return [headers,...rows].map((r,i)=>r.map(v=>{let s=String(v??'');if(i===0&&/^[=+\-@\t\r]/.test(s))s="'"+s;return quote(s);}).join(separator)).join('\r\n');}
const API={number,parse,variables,evaluate,propagate,statistics,parseDelimited,delimited};if(typeof module!=='undefined')module.exports=API;root.Physics=API;
})(typeof globalThis!=='undefined'?globalThis:this);
