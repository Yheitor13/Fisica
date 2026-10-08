// Relatório final do EX01, tabela 1 e metodologia; centímetros.
const EX01=[["Bateria · D", 2.08, 2.03, 2.0, 0.001], ["Bateria · h", 0.31, 0.31, 0.3, 0.001], ["Arruela · D₁", 0.75, 0.71, 0.72, 0.005], ["Arruela · D₂", 1.85, 1.89, 1.87, 0.005], ["Arruela · h", 0.1, 0.14, 0.01, 0.005], ["Ressalto e furo · D₁", 0.76, 0.6, 0.72, 0.005], ["Ressalto e furo · D₂", 1.88, 1.7, 1.81, 0.005], ["Ressalto e furo · D₃", 2.51, 2.4, 2.53, 0.005], ["Ressalto e furo · h₁", 2.49, 2.3, 2.57, 0.005], ["Ressalto e furo · h₂", 0.45, 0.3, 0.35, 0.005], ["Ressalto, furo e corte · D₁", 0.5, 0.61, 0.61, 0.005], ["Ressalto, furo e corte · D₂", 1.1, 1.26, 1.22, 0.005], ["Ressalto, furo e corte · D₃", 2.1, 2.21, 2.2, 0.005], ["Ressalto, furo e corte · h₁", 0.4, 1.07, 0.94, 0.005], ["Ressalto, furo e corte · h₂", 0.9, 0.06, 0.5, 0.005], ["Ressalto, furo e corte · L", 1.2, 1.31, 1.4, 0.005]];
'use strict';
const P=Physics,L=Lab,$=id=>document.getElementById(id),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let state={cols:[{id:'c1',name:'Nome',unit:''},{id:'c2',name:'Medida 1',unit:''},{id:'c3',name:'Medida 2',unit:''},{id:'c4',name:'Medida 3',unit:''}],rows:[{c1:'',c2:'',c3:'',c4:''}],next:5},output=null,history=[],inputHistory=[],dirty=false;
const clone=x=>JSON.parse(JSON.stringify(x));
const meta={
 treatment:['Média → DP → incerteza da média → incerteza total','x̄ = Σxᵢ/N; s = √[Σ(xᵢ−x̄)²/(N−1)]; σm = s/√N; σtotal = √(σm²+σinst²)','Apostila, equações 2.1–2.4, p. 9','Selecione as colunas de repetições e os resultados que deseja. A incerteza instrumental deve ser informada na mesma unidade das medidas.'],
 deviations:['Desvios individuais','dᵢ = xᵢ − x̄','Apostila, capítulo 2','Selecione uma coluna com leituras repetidas da mesma grandeza.'],
 total:['Combinação de incertezas','σtotal = √(σm² + σinst²)','Apostila, equação 2.4','A coluna estatística deve conter a incerteza da média, e não o DP das leituras.'],
 relative:['Incerteza relativa','r = σ/|x|; r% = 100r','Apostila, pp. 10–11 e capítulo 3','Apresentação final com um algarismo significativo na incerteza.'],
 geometry:['Propagação de incertezas','σf = √Σ[(∂f/∂xᵢ)σᵢ]²','Apostila, equação 3.1; relatório 01','Use medidas independentes e unidades compatíveis. Valores derivados de uma mesma medida não são independentes. Não há conversão automática de unidades.'],
 linearization:['Transformação das duas coordenadas','X = ln(x/xref); σX = σx/|x| (para ln)','Apostila, capítulo 4; aula, slide 13','As referências normalizam os logaritmos. Por exemplo, normalize tempo em segundos por 1 s antes de calcular ln(t/1 s).'],
 regression:['Regressão linear ponderada','Y = aX + b; wᵢ = 1/σYᵢ²','Apostila, equações 5.9–5.14; aula, slide 16','O ajuste usa somente as incertezas verticais, sem reescalar as incertezas dos coeficientes por χ² reduzido. Para pesos iguais, informe a mesma σY para todos os pontos.'],
 power:['Retorno da linearização por ln','y = C(x/xref)ⁿ; n = a; C = yref · exp(b); σC = Cσb','Apostila, capítulo 4; aula, slides 12–13','Use os coeficientes do ajuste de ln(y/yref) em função de ln(x/xref). Não se aplica ao ajuste com log10. Mantenha a mesma referência de x ao escrever a lei de potência.']};
const stats=[['n','N'],['mean','Média'],['s','DP amostral'],['sem','Incerteza da média'],['instrument','Incerteza instrumental'],['total','Incerteza total'],['min','Mínimo'],['max','Máximo'],['relative','Incerteza relativa'],['percent','Incerteza relativa (%)'],['report','Valor ± incerteza']];
function message(s,error=false){$('status').textContent=s;$('status').className=error?'error':'success';}
function invalidate(){output=null;history=[];$('results').hidden=true;$('result-panel').hidden=true;$('undo').disabled=true;dirty=true;message('');}
function snapshot(){return Object.fromEntries([...$('config').querySelectorAll('input,select')].map(e=>[e.id,e.type==='checkbox'?e.checked:e.value]));}
function selector(id,label,preferred,extra=''){return `<label>${esc(label)}<select id="${id}">${extra}${state.cols.map(c=>`<option value="${c.id}" ${c.id===preferred?'selected':''}>${esc(c.name)}${c.unit?' ['+esc(c.unit)+']':''}</option>`).join('')}</select></label>`;}
function guess(re,index=0){return state.cols.find(c=>re.test(c.name))?.id||state.cols[Math.min(index,state.cols.length-1)]?.id;}
function field(id,label,value=''){return `<label>${esc(label)}<input id="${id}" value="${esc(value)}" inputmode="decimal"></label>`;}
function sigma(prefix,label){return selector(prefix,label,'constant','<option value="constant" selected>Valor igual para todas as linhas</option>')+field(prefix+'-value','Incerteza absoluta (0 se exata)');}
function configure(saved={}){
 const k=$('calculation').value,m=meta[k];$('equation').textContent=m[1];$('source').textContent=m[2];$('explanation').textContent=m[3];let h='';
 if(k==='treatment'){
 const main=['mean','s','sem','total'];
 const choices=list=>'<div class="choices">'+list.map(([id,name])=>`<label class="check"><input id="out-${id}" type="checkbox" ${['mean','s','sem'].includes(id)?'checked':''}>${id==='s'?'DP (desvio padrão)':name}</label>`).join('')+'</div>';
 h=choices(stats.filter(([id])=>main.includes(id)));
 h+='<div id="instrument-box">'+(saved.layout==='columns'?field('instrument-value','Incerteza instrumental (na unidade das medidas)'):sigma('instrument','Incerteza instrumental'))+'</div>';
 h+='<details id="treatment-options"><summary>Mais opções</summary>'+choices(stats.filter(([id])=>!main.includes(id)));
 h+='<label>Organização das leituras<select id="layout"><option value="rows">Uma linha por grandeza</option><option value="columns">Uma coluna por grandeza</option></select></label><fieldset><legend>Colunas que entram no cálculo</legend><div class="choices">'+state.cols.map((c,i)=>`<label class="check"><input type="checkbox" id="rep-${c.id}" ${i>0?'checked':''}>${esc(c.name)}</label>`).join('')+'</div></fieldset>';
 if(saved.layout!=='columns')h+=selector('label-column','Coluna com o nome de cada linha',state.cols[0]?.id,'<option value="">Número da linha</option>');
 h+='</details><p id="measure-summary" class="help"></p>';
 }else if(k==='deviations')h=selector('measure','Coluna de leituras',guess(/medida|t1/i,1));
 else if(k==='total')h=selector('statistical','Incerteza da média (σm)',guess(/incerteza da média/i,1))+sigma('instrument','Incerteza instrumental');
 else if(k==='relative')h=selector('measure','Valor da grandeza',guess(/média/i,1))+sigma('uncertainty','Incerteza absoluta');
 else if(k==='geometry'){
 const name=saved.model&&L.models[saved.model]?saved.model:'cylinder',model=L.models[name];
 h='<label>Grandeza<select id="model">'+Object.entries(L.models).map(([id,m])=>`<option value="${id}" ${id===name?'selected':''}>${m.name}</option>`).join('')+'</select></label><p class="equation">'+esc(model.display)+'</p><p class="help">'+esc(model.source)+'</p>';
 model.vars.forEach((v,i)=>{h+=`<fieldset><legend>${v}</legend>`+selector('value-'+v,'Coluna de '+v,guess(new RegExp('^'+v+'$','i'),i))+sigma('sigma-'+v,'Incerteza de '+v)+'</fieldset>';});h+=field('output-unit','Unidade do resultado (opcional)');
 }else if(k==='linearization'){
 for(const axis of ['x','y'])h+=`<fieldset><legend>Coordenada ${axis.toUpperCase()}</legend>`+selector('value-'+axis,'Medida',guess(axis==='x'?/média|tempo/i:/^x$|distância/i,axis==='x'?1:0))+sigma('sigma-'+axis,'Incerteza da medida')+`<label>Transformação<select id="transform-${axis}"><option value="ln">Logaritmo natural — ln</option><option value="log10">Logaritmo decimal — log10</option><option value="square">Quadrado</option><option value="inverse">Inverso</option></select></label>`+field('reference-'+axis,'Referência (na unidade da medida)','1')+'</fieldset>';
 }else if(k==='regression')h=selector('value-x','Coordenada X',guess(/^X$/,0))+selector('value-y','Coordenada Y',guess(/^Y$/,2))+sigma('sigma-y','Incerteza vertical σY (vY)');
 else if(k==='power')h=selector('slope','Coeficiente angular a',guess(/^a$/,0))+selector('uslope','Incerteza σa',guess(/^σa$/,1))+selector('intercept','Coeficiente linear b',guess(/^b$/,2))+selector('uintercept','Incerteza σb',guess(/^σb$/,3))+field('reference-y','Referência de y usada no logaritmo','1')+field('output-unit','Unidade de y e de C');
 $('config').innerHTML=h;
 for(const [id,v] of Object.entries(saved)){const e=$(id);if(!e)continue;if(e.type==='checkbox')e.checked=!!v;else if(e.tagName!=='SELECT'||[...e.options].some(o=>o.value===v))e.value=v;}
 visibility();
 $('config').onchange=event=>{const id=event.target.id,s=snapshot();if(id==='layout'||id==='model'){configure(s);if(id==='layout')$('treatment-options').open=true;}else visibility();invalidate();};
 $('config').oninput=()=>invalidate();
}
function visibility(){
 $('common-unit').parentElement.hidden=$('calculation').value!=='treatment';const units=[...new Set(state.cols.slice(1).map(c=>c.unit))];$('common-unit').value=units.length===1?units[0]:'';$('common-unit').placeholder=units.length>1?'Por coluna':'Ex.: cm ou s';
 if($('instrument-box')){$('instrument-box').hidden=!['instrument','total','relative','percent','report'].some(id=>$('out-'+id).checked);$('measure-summary').textContent='Leituras selecionadas: '+state.cols.filter(c=>$('rep-'+c.id).checked).map(c=>c.name).join(', ')+'.';}
for(const e of $('config').querySelectorAll('select')){const f=$(e.id+'-value');if(f)f.parentElement.hidden=e.value!=='constant';if(e.id.startsWith('transform-'))$('reference-'+e.id.slice(10)).parentElement.hidden=!['ln','log10'].includes(e.value);}}
const chosen=id=>{const c=state.cols.find(c=>c.id===$(id)?.value);if(!c)throw Error('Selecione uma coluna para '+id+'.');return c;};
function num(row,c){try{return P.number(row[c.id]);}catch(e){throw Error(c.name+': '+e.message);}}
function uv(prefix,row){return !$(prefix)||$(prefix).value==='constant'?L.uncertainty($(prefix+'-value').value):L.uncertainty(num(row,chosen(prefix)));}
function compatible(cols){const units=[...new Set(cols.map(c=>c.unit.trim()).filter(Boolean))];if(units.length>1)throw Error('Unidades diferentes: '+units.join(', ')+'. Converta as medidas para a mesma unidade.');return units[0]||'';}
function sigmaUnit(prefix,c){if($(prefix)&&$(prefix).value!=='constant')compatible([c,chosen(prefix)]);}
const col=(name,unit='')=>({name,unit});
function eachRow(fn){return state.rows.map((r,i)=>{try{return fn(r,i);}catch(e){throw Error('Linha '+(i+1)+': '+e.message);}});}
function compute(){const k=$('calculation').value;let cols,rows,secondary,description=meta[k][2];
 if(!state.rows.length)throw Error('Inclua pelo menos uma linha.');
 if(k==='treatment'){
 const inputs=state.cols.filter(c=>$('rep-'+c.id).checked),selected=stats.filter(([id])=>$('out-'+id).checked),vertical=$('layout').value==='columns';
 if(!inputs.length||!selected.length)throw Error('Selecione as medidas e pelo menos um resultado.');
 const needsU=selected.some(([id])=>['instrument','total','relative','percent','report'].includes(id)),needsTwo=selected.some(([id])=>['s','sem','total','relative','percent','report'].includes(id));
 const unit=compatible(inputs),label=!vertical&&$('label-column').value?chosen('label-column'):null;
 if(needsU&&!vertical)inputs.forEach(c=>sigmaUnit('instrument',c));
 cols=[col(vertical?'Grandeza':label?label.name:'Linha',label?.unit||''),...selected.map(([id,name])=>col(name,id==='percent'?'%':['n','relative'].includes(id)?'':unit))];
 const one=(values,u,label)=>{const s=L.treatment(values,u);if(needsTwo&&s.n<2)throw Error('DP e incertezas estatísticas exigem pelo menos duas medidas.');return [label,...selected.map(([id])=>id==='relative'?L.relative(s.mean,s.total):id==='percent'?100*L.relative(s.mean,s.total):id==='report'?L.report(s.mean,s.total):s[id])];};
 rows=vertical?inputs.map(c=>{try{return one(state.rows.filter(r=>String(r[c.id]??'').trim()).map(r=>num(r,c)),needsU?uv('instrument',{}):null,c.name);}catch(e){throw Error(c.name+': '+e.message);}}):eachRow((r,i)=>one(inputs.map(c=>num(r,c)),needsU?uv('instrument',r):null,label?r[label.id]:i+1));
 description+=' · Repetições: '+inputs.map(c=>c.name).join(', ')+'.';
 }else if(k==='deviations'){
 const c=chosen('measure'),points=state.rows.map((r,i)=>({r,i})).filter(({r})=>String(r[c.id]??'').trim()),values=points.map(({r})=>num(r,c)),s=P.statistics(values);
 cols=[col('Linha'),col('Medida',c.unit),col('Média',c.unit),col('Desvio',c.unit),col('Desvio absoluto',c.unit),col('Desvio ao quadrado',c.unit?c.unit+'²':'')];rows=points.map(({i},j)=>[i+1,values[j],s.mean,values[j]-s.mean,Math.abs(values[j]-s.mean),(values[j]-s.mean)**2]);
 }else if(k==='total'){
 const c=chosen('statistical');sigmaUnit('instrument',c);cols=[col('Linha'),col('Incerteza da média',c.unit),col('Incerteza instrumental',c.unit),col('Incerteza total',c.unit)];rows=eachRow((r,i)=>{const s=L.uncertainty(num(r,c)),u=uv('instrument',r);return [i+1,s,u,Math.hypot(s,u)];});
 }else if(k==='relative'){
 const c=chosen('measure');sigmaUnit('uncertainty',c);cols=[col('Linha'),col('Valor',c.unit),col('Incerteza',c.unit),col('Incerteza relativa'),col('Incerteza percentual','%'),col('Valor ± incerteza',c.unit)];rows=eachRow((r,i)=>{const x=num(r,c),u=uv('uncertainty',r),rel=L.relative(x,u);return [i+1,x,u,rel,100*rel,L.report(x,u)];});
 }else if(k==='geometry'){
 const name=$('model').value,m=L.models[name],cs=m.vars.map(v=>chosen('value-'+v));if(new Set(cs.map(c=>c.id)).size!==cs.length)throw Error('Cada grandeza independente deve usar uma coluna distinta.');
 const unit=m.unitPower||name==='difference'?compatible(cs):'';m.vars.forEach((v,i)=>sigmaUnit('sigma-'+v,cs[i]));const outunit=$('output-unit').value.trim()||(unit?unit+({2:'²',3:'³'}[m.unitPower]||''):'');
 cols=[col('Linha'),col('Resultado',outunit),col('Incerteza',outunit),col('Incerteza percentual','%'),col('Valor ± incerteza',outunit)];rows=eachRow((r,i)=>{const v={},u={};m.vars.forEach((key,j)=>{v[key]=num(r,cs[j]);u[key]=uv('sigma-'+key,r);});const a=L.model(name,v,u);return [i+1,a.value,a.uncertainty,a.relative===null?'Indefinida':100*a.relative,a.presentation];});description=m.source+' · '+m.display;
 }else if(k==='linearization'){
 const axes=['x','y'].map(a=>{const c=chosen('value-'+a);sigmaUnit('sigma-'+a,c);const kind=$('transform-'+a).value,ref=['ln','log10'].includes(kind)?P.number($('reference-'+a).value):1,unit=['ln','log10'].includes(kind)?'':kind==='square'?(c.unit?c.unit+'²':''):(c.unit?'1/('+c.unit+')':'');return {a,c,kind,ref,unit};});
 cols=axes.flatMap(({a,unit})=>[col(a.toUpperCase(),unit),col('v'+a.toUpperCase(),unit)]);rows=eachRow(r=>axes.flatMap(({a,c,kind,ref})=>{const z=L.transform(kind,num(r,c),uv('sigma-'+a,r),ref);return [z.value,z.uncertainty];}));description+=' · '+axes.map(a=>a.a.toUpperCase()+': '+a.kind+' de '+a.c.name+', referência '+a.ref+' '+a.c.unit).join('; ');
 }else if(k==='regression'){
 const x=chosen('value-x'),y=chosen('value-y');if(x.id===y.id)throw Error('Escolha colunas diferentes para X e Y.');sigmaUnit('sigma-y',y);const fit=L.regression(eachRow(r=>({x:num(r,x),y:num(r,y),u:uv('sigma-y',r)})));
 cols=[col('X',x.unit),col('Y',y.unit),col('σY',y.unit),col('w'),col('wX'),col('wY'),col('wX²'),col('wXY'),col('Y ajustado',y.unit),col('Resíduo',y.unit)];rows=fit.rows.map(r=>[r.x,r.y,r.u,r.w,r.wx,r.wy,r.wxx,r.wxy,r.fit,r.res]);
 secondary={cols:[col('a',x.unit?'('+y.unit+')/('+x.unit+')':y.unit),col('σa',x.unit?'('+y.unit+')/('+x.unit+')':y.unit),col('b',y.unit),col('σb',y.unit),col('χ²'),col('Graus de liberdade'),col('χ² reduzido')],rows:[[fit.a,fit.ua,fit.b,fit.ub,fit.chi,fit.df,fit.reduced??'Indefinido']]};description+=' · χ² reduzido é uma verificação complementar; com dois pontos, fica indefinido.';
 }else if(k==='power'){
 const unit=$('output-unit').value.trim(),ref=P.number($('reference-y').value);cols=[col('Linha'),col('n'),col('σn'),col('C',unit),col('σC',unit),col('n ± σn'),col('C ± σC',unit)];rows=eachRow((r,i)=>{const z=L.powerReturn(num(r,chosen('slope')),num(r,chosen('uslope')),num(r,chosen('intercept')),num(r,chosen('uintercept')),ref);return [i+1,z.n,z.un,z.C,z.uC,L.report(z.n,z.un),L.report(z.C,z.uC)];});
 }
 for(const row of rows)for(const v of row)if(typeof v==='number'&&!Number.isFinite(v))throw Error('Resultado fora do intervalo numérico.');
 return {title:meta[k][0],description,cols,rows,secondary};
}
function inputTable(){
 $('count').textContent=state.rows.length+' linhas · '+state.cols.length+' colunas';
 $('table').querySelector('thead').innerHTML='<tr><th>Linha</th>'+state.cols.map(c=>`<th><input data-col="${c.id}" data-key="name" aria-label="Nome da coluna" value="${esc(c.name)}"><input data-col="${c.id}" data-key="unit" aria-label="Unidade de ${esc(c.name)}" placeholder="Unidade" value="${esc(c.unit)}"><button data-delete-col="${c.id}" aria-label="Excluir ${esc(c.name)}">×</button></th>`).join('')+'<th></th></tr>';
 $('table').querySelector('tbody').innerHTML=state.rows.map((r,i)=>'<tr><th scope="row">'+(i+1)+'</th>'+state.cols.map(c=>`<td><input data-row="${i}" data-cell="${c.id}" aria-label="Linha ${i+1}, ${esc(c.name)}" value="${esc(r[c.id])}" placeholder="${c===state.cols[0]?'Ex.: diâmetro':'0,00'}" inputmode="${c===state.cols[0]?'text':'decimal'}" autocomplete="off"></td>`).join('')+`<td><button data-delete-row="${i}" aria-label="Excluir linha ${i+1}">×</button></td></tr>`).join('');
 $('restore-input').disabled=!inputHistory.length;const units=[...new Set(state.cols.slice(1).map(c=>c.unit))];$('common-unit').value=units.length===1?units[0]:'';
}
function refresh(saved=snapshot()){inputTable();configure(saved);invalidate();}
$('table').oninput=e=>{const t=e.target;if(t.dataset.cell){state.rows[Number(t.dataset.row)][t.dataset.cell]=t.value;invalidate();}};
$('table').onchange=e=>{const t=e.target;if(t.dataset.col){const c=state.cols.find(c=>c.id===t.dataset.col),s=snapshot(),v=t.value.trim();if(t.dataset.key==='name'&&(!v||state.cols.some(x=>x!==c&&x.name===v))){t.value=c.name;message('Use nomes de coluna preenchidos e diferentes.',true);return;}c[t.dataset.key]=v;configure(s);invalidate();}};
$('table').onclick=e=>{const t=e.target;if(t.dataset.deleteCol&&state.cols.length>1&&confirm('Excluir esta coluna de medidas?')){const id=t.dataset.deleteCol;state.cols=state.cols.filter(c=>c.id!==id);state.rows.forEach(r=>delete r[id]);refresh();}else if(t.dataset.deleteRow!==undefined&&confirm('Excluir esta linha de medidas?')){state.rows.splice(Number(t.dataset.deleteRow),1);refresh();}};
function shown(v){if(typeof v!=='number')return String(v??'');const d=Number($('digits').value);return ($('format').value==='decimal'?v.toFixed(d):v.toPrecision(d)).replace('.',',');}
function heading(c){return c.name+(c.unit?' ['+c.unit+']':'');}
function tableHTML(data){return '<thead><tr>'+data.cols.map(c=>'<th scope="col">'+esc(heading(c))+'</th>').join('')+'</tr></thead><tbody>'+data.rows.map(r=>'<tr>'+r.map((v,i)=>'<td>'+esc(['N','Linha','Graus de liberdade'].includes(data.cols[i].name)?String(v):shown(v))+'</td>').join('')+'</tr>').join('')+'</tbody>';}
function showOutput(){if(!output){$('results').hidden=true;$('result-panel').hidden=true;return;}$('results').hidden=false;$('result-panel').hidden=false;$('result-description').textContent=output.title+' · '+output.description;$('result-table').innerHTML=tableHTML(output);$('secondary').innerHTML=output.secondary?'<h3>Coeficientes e qualidade do ajuste</h3><div class="table-wrap"><table>'+tableHTML(output.secondary)+'</table></div><button id="use-coefficients">Usar coeficientes para retornar à lei de potência →</button>':'';if(output.secondary)$('use-coefficients').onclick=()=>promote(output.secondary,true);$('secondary-csv').hidden=!output.secondary;$('undo').disabled=!history.length;}
$('calculate').onclick=()=>{try{const next=compute();history.push(output);if(history.length>10)history.shift();output=next;showOutput();message('');$('result-panel').scrollIntoView({behavior:'smooth',block:'start'});}catch(e){message(e.message,true);$('status').scrollIntoView({behavior:'smooth',block:'center'});}};
$('undo').onclick=()=>{if(history.length){output=history.pop();showOutput();$('undo').disabled=!history.length;message('Último cálculo desfeito.');}};
$('format').onchange=showOutput;$('digits').onchange=showOutput;
$('calculation').onchange=()=>{configure();invalidate();};
$('add-row').onclick=()=>{if(state.rows.length>=10000)return message('Limite de 10.000 linhas.',true);state.rows.push(Object.fromEntries(state.cols.map(c=>[c.id,''])));refresh();};
$('add-col').onclick=()=>{if(state.cols.length>=100)return message('Limite de 100 colunas.',true);const id='c'+state.next++;let name='Medida '+(state.cols.length+1);while(state.cols.some(c=>c.name===name))name+=' nova';state.cols.push({id,name,unit:''});state.rows.forEach(r=>r[id]='');refresh();};
function fromMatrix(matrix){if(matrix.length<2||!matrix[0].length)throw Error('Cole o cabeçalho e pelo menos uma linha.');const names=new Set(),cols=matrix[0].map((h,i)=>{const m=String(h).trim().match(/^(.*?)\s*\[([^\]]*)\]\s*$/),name=(m?m[1]:String(h)).trim();if(!name||names.has(name))throw Error('Os nomes das colunas devem ser preenchidos e diferentes.');names.add(name);return {id:'c'+(i+1),name,unit:m?m[2]:''};});if(matrix.slice(1).some(r=>r.length!==cols.length))throw Error('Todas as linhas devem ter a mesma quantidade de colunas.');return {cols,rows:matrix.slice(1).map(r=>Object.fromEntries(cols.map((c,i)=>[c.id,String(r[i])]))),next:cols.length+1};}
function replaceInput(next){if(confirm('Substituir a tabela de entrada? Você poderá voltar à tabela anterior nesta aba.')){inputHistory.push(clone(state));state=next;refresh({});}}
$('paste-load').onclick=()=>{try{replaceInput(fromMatrix(P.parseDelimited($('paste').value)));}catch(e){message(e.message,true);}};
$('import').onclick=()=>$('file').click();
$('file').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>5e6)throw Error('O limite é 5 MB.');replaceInput(fromMatrix(P.parseDelimited(await file.text())));}catch(e){message(e.message,true);}e.target.value='';};
$('clear').onclick=()=>{const next=clone(state);next.rows=next.rows.map(()=>Object.fromEntries(next.cols.map(c=>[c.id,''])));replaceInput(next);};
function promote(data,power=false){if(!confirm('Usar os resultados como nova tabela de entrada? A tabela anterior ficará guardada nesta aba.'))return;inputHistory.push(clone(state));state=fromMatrix([data.cols.map(heading),...data.rows.map(r=>r.map(v=>String(v)))]);if(power)$('calculation').value='power';refresh({});message('Resultados transferidos com precisão completa. Escolha a próxima etapa.');}
$('use-result').onclick=()=>output&&promote(output);
$('restore-input').onclick=()=>{if(inputHistory.length&&confirm('Voltar à tabela anterior?')){state=inputHistory.pop();refresh({});}};
function loadExample(kind){try{let matrix,settings;
 if(kind==='ex01'){matrix=[['Peça e grandeza','Leitura 1 [cm]','Leitura 2 [cm]','Leitura 3 [cm]','σ instrumental [cm]'],...EX01];settings={'instrument':'c5','rep-c5':false,'out-total':true};}else{matrix=[['Grandeza','L1 [m]','L2 [m]','L3 [m]'],['L','0,680','0,660','0,670']];settings={'instrument-value':'0,005','out-total':true};}
 inputHistory.push(clone(state));state=fromMatrix(matrix);$('calculation').value='treatment';refresh(settings);message(kind==='ex01'?'Exemplo carregado. Clique em Calcular.':'Exemplo da apostila carregado. Clique em Calcular.');
 }catch(e){message(e.message,true);}}
$('example').onclick=()=>loadExample('ex01');
$('other-example').onclick=()=>loadExample($('example-kind').value);
function download(blob,name){const a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function exported(data){return data.rows.map(r=>r.map(v=>typeof v==='number'&&$('export-rounded').checked?P.number(shown(v)):v));}
function csvText(data,separator=';'){return P.delimited(data.cols.map(heading),exported(data).map(r=>r.map(v=>typeof v==='number'?String(v).replace('.',','):/^[=+\-@\t\r]/.test(String(v))?"'"+v:v)),separator);}
$('csv').onclick=()=>{if(output)download(new Blob(['\uFEFF'+csvText(output)],{type:'text/csv;charset=utf-8'}),'tabela-calculada.csv');};
$('secondary-csv').onclick=()=>{if(output?.secondary)download(new Blob(['\uFEFF'+csvText(output.secondary)],{type:'text/csv;charset=utf-8'}),'coeficientes.csv');};
$('xlsx').onclick=()=>{try{if(output)download(new Blob([makeXLSX(output.cols.map(heading),exported(output))],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}),'tabela-calculada.xlsx');}catch(e){message(e.message,true);}};
$('copy').onclick=async()=>{try{if(output){await navigator.clipboard.writeText(csvText(output,'\t'));message('Tabela copiada. Cole no Excel, Sheets ou Word.');}}catch(e){message('Não foi possível copiar. Use Baixar CSV ou XLSX.',true);}};
function validState(s){if(!s||!Array.isArray(s.cols)||!s.cols.length||s.cols.length>100||!Array.isArray(s.rows)||s.rows.length>10000)throw Error('Sessão inválida.');const ids=new Set(),names=new Set();for(const c of s.cols){if(!/^c\d+$/.test(c.id)||ids.has(c.id)||typeof c.name!=='string'||!c.name.trim()||names.has(c.name)||typeof c.unit!=='string')throw Error('Colunas inválidas na sessão.');ids.add(c.id);names.add(c.name);}for(const r of s.rows){if(!r||typeof r!=='object'||Array.isArray(r))throw Error('Linha inválida na sessão.');for(const c of s.cols)if(typeof r[c.id]!=='string'&&typeof r[c.id]!=='number')throw Error('Célula inválida na sessão.');}return {cols:s.cols.map(({id,name,unit})=>({id,name,unit})),rows:s.rows.map(r=>Object.fromEntries(s.cols.map(c=>[c.id,String(r[c.id])]))),next:Math.max(...s.cols.map(c=>Number(c.id.slice(1))))+1};}
$('save-session').onclick=()=>{const data={version:2,state,plan:{kind:$('calculation').value,settings:snapshot(),format:$('format').value,digits:$('digits').value}};download(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),'medidas-fisica.json');dirty=false;message('Sessão salva com as medidas e a configuração do cálculo.');};
$('load-session').onclick=()=>$('session-file').click();
$('session-file').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>5e6)throw Error('O limite é 5 MB.');const data=JSON.parse(await file.text());if(data.version!==2)throw Error('Sessão da versão anterior: importe a tabela CSV exportada naquela versão.');const next=validState(data.state);if(!meta[data.plan?.kind])throw Error('Configuração de cálculo inválida.');if(!confirm('Abrir esta sessão e substituir a entrada atual?'))return;inputHistory.push(clone(state));state=next;$('calculation').value=data.plan.kind;if(['significant','decimal'].includes(data.plan.format))$('format').value=data.plan.format;if(['2','3','4','5','6'].includes(data.plan.digits))$('digits').value=data.plan.digits;refresh(data.plan.settings||{});dirty=false;message('Sessão restaurada. Clique em Calcular tabela para gerar os resultados.');}catch(err){message(err.message,true);}e.target.value='';};
window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
$('common-unit').onchange=()=>{state.cols.slice(1).forEach(c=>c.unit=$('common-unit').value.trim());refresh();};
$('edit-columns').onchange=()=>$('table').classList.toggle('editing',$('edit-columns').checked);
inputTable();configure();
