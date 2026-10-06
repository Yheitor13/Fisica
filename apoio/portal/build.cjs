// Creates only a publishing copy; never moves or modifies the source documents.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..');
const out=path.resolve(process.argv[2]||path.join(root,'.pages'));
if(out===root||root.startsWith(out+path.sep))throw Error('Destino de publicação inválido.');
fs.mkdirSync(out,{recursive:true});
function copy(source,dest){fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(source,dest);}
for(const name of ['index.html','style.css'])copy(path.join(__dirname,name),path.join(out,name));
fs.writeFileSync(path.join(out,'.nojekyll'),'');
const app=path.join(root,'apoio/programa-graficos');
for(const name of ['index.html','favicon.svg','README.md','css','js','vendor','exemplos'])fs.cpSync(path.join(app,name),path.join(out,'graficolab',name),{recursive:true});
for(const experiment of ['FisicaEx01','FisicaEx02']){
 for(const entry of fs.readdirSync(path.join(root,experiment),{withFileTypes:true})){
  if(entry.isFile()&&/\.(pdf|docx|xlsx)$/i.test(entry.name))copy(path.join(root,experiment,entry.name),path.join(out,experiment,entry.name));
 }
}
for(const file of ['FisicaEx01/refs/Trabalho_FG1.pdf','FisicaEx02/refs/medidas_fisicaEX02.xlsx','FisicaEx02/refs/Aula3-PropagacaoLinearizacao.pdf'])copy(path.join(root,file),path.join(out,file));
for(const file of fs.readdirSync(path.join(root,'apoio/referencias_gerais'))){
 if(file.endsWith('.pdf'))copy(path.join(root,'apoio/referencias_gerais',file),path.join(out,'materiais',file));
}
// Every local link in the portal must resolve to a file in the publication.
const html=fs.readFileSync(path.join(out,'index.html'),'utf8');let checked=0;
for(const match of html.matchAll(/href="([^"]+)"/g)){
 const href=match[1];if(href.startsWith('http')||href.startsWith('#'))continue;
 const resolved=path.resolve(out,decodeURIComponent(href));
 if(!resolved.startsWith(out+path.sep)&&resolved!==out)throw Error('Link fora do site: '+href);
 if(!fs.existsSync(resolved))throw Error('Link quebrado: '+href);checked++;
}
console.log(`Portal pronto: ${checked} links locais conferidos. Saída: ${out}`);
