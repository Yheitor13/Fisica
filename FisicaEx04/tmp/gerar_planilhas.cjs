const fs=require("node:fs");
const path=require("node:path");
const {Workbook,SpreadsheetFile}=require("@oai/artifact-tool");
const root=path.resolve(__dirname,"..");
const raw=[
  [5,.15,.2,.3],[10,1.4,1.5,1.7],[15,3.1,3.85,4.0],
  [20,8.7,9.05,9.4],[25,13.05,13.2,13.8],[30,18.8,20.1,20.7],
  [35,28.6,29.15,29.95],[40,32.7,36.7,40.15],
  [45,48.6,49.35,53.0],[50,63.35,64.4,67.35],
  [55,81.7,"No chão","No chão"]
];
const calc=JSON.parse(fs.readFileSync(path.join(root,"tmp","calculos_verificados.json"),"utf8"));
function baseSheet(book,name,headers,data){
  const s=book.worksheets.add(name);
  s.showGridLines=false;
  s.getRange("A1:"+String.fromCharCode(64+headers.length)+"1").values=[headers];
  s.getRange("A2").writeValues(data);
  s.getRange("A1:"+String.fromCharCode(64+headers.length)+"1").format.borders={preset:"doubleBottom",style:"thin",color:"#6683A4"};
  s.getRange("A1:"+String.fromCharCode(64+headers.length)+(data.length+1)).format.borders={preset:"all",style:"thin",color:"#D9D9D9"};
  s.freezePanes.freezeRows(1);
  for(let c=0;c<headers.length;c++)s.getRange(String.fromCharCode(65+c)+":"+String.fromCharCode(65+c)).format.columnWidth=c===0?15:22;
  return s;
}
(async()=>{
  const original=Workbook.create();
  const o=baseSheet(original,"Medidas",["x (cm)","y1 (cm)","y2 (cm)","y3 (cm)"],raw);
  o.getRange("F1").values=[["Fonte"]];
  o.getRange("F2").values=[["Transcrição confirmada em 17/10/2026"]];
  o.getRange("F3").values=[["No chão é observação, não valor numérico"]];
  o.getRange("F:F").format.columnWidth=45;
  original.recalculate();
  const origCheck=await original.inspect({kind:"table",range:"Medidas!A1:D12",include:"values",tableMaxRows:12,tableMaxCols:4});
  console.log("ORIGINAIS",origCheck.ndjson.slice(0,2200));
  let preview=await original.render({sheetName:"Medidas",range:"A1:F13",scale:1.5});
  fs.writeFileSync(path.join(root,"tmp","preview_originais.png"),Buffer.from(await preview.arrayBuffer()));
  let blob=await SpreadsheetFile.exportXlsx(original);
  await blob.save(path.join(root,"Tabela_Medidas_Originais.xlsx"));

  const book=Workbook.create();
  const results=book.worksheets.add("Resultados");
  const source=baseSheet(book,"Medidas",["x (cm)","y1 (cm)","y2 (cm)","y3 (cm)"],raw);
  const tr=book.worksheets.add("Tratamento");
  tr.showGridLines=false;
  tr.getRange("A1:J1").values=[["x (cm)","n","y médio (cm)","s (cm)","u estat. (cm)","x (m)","y médio (m)","x² (m²)","ln(x/1 m)","ln(y/1 m)"]];
  for(let i=2;i<=12;i++){
    const rawrow=i;
    tr.getRange("A"+i).formulas=[["=Medidas!A"+rawrow]];
    tr.getRange("B"+i).formulas=[["=COUNT(Medidas!B"+rawrow+":D"+rawrow+")"]];
    tr.getRange("C"+i).formulas=[["=AVERAGE(Medidas!B"+rawrow+":D"+rawrow+")"]];
    if(i<12){
      tr.getRange("D"+i).formulas=[["=SQRT(((Medidas!B"+rawrow+"-C"+i+")^2+(Medidas!C"+rawrow+"-C"+i+")^2+(Medidas!D"+rawrow+"-C"+i+")^2)/2)"]];
      tr.getRange("E"+i).formulas=[["=D"+i+"/SQRT(3)"]];
    }else{
      tr.getRange("D"+i+":E"+i).values=[["sem repetição","sem repetição"]];
    }
    tr.getRange("F"+i+":J"+i).formulas=[["=A"+i+"/100","=C"+i+"/100","=F"+i+"^2","=LN(F"+i+")","=LN(G"+i+")"]];
  }
  tr.getRange("A1:J12").format.borders={preset:"all",style:"thin",color:"#D9D9D9"};
  tr.getRange("A1:J1").format.borders={preset:"doubleBottom",style:"thin",color:"#6683A4"};
  tr.getRange("A:J").format.columnWidth=18;
  tr.freezePanes.freezeRows(1);
  tr.getRange("C2:J12").setNumberFormat("0.000000");
  results.showGridLines=false;
  results.getRange("A1").values=[["Capítulo 13  Movimento de um projétil"]];
  results.getRange("A3:B3").values=[["Grandeza","Resultado"]];
  results.getRange("A4:A11").values=[["n livre"],["A por y = Ax², m^-1"],["v0 por y = Ax², m/s"],["A por log n=2, m^-1"],["v0 por log n=2, m/s"],["g assumido, m/s²"],["N de posições ajustadas"],["x=55 cm"]];
  results.getRange("B4").formulas=[["=SLOPE(Tratamento!J2:J11,Tratamento!I2:I11)"]];
  results.getRange("B5").formulas=[["=SUMPRODUCT(Tratamento!H2:H11,Tratamento!G2:G11)/SUMSQ(Tratamento!H2:H11)"]];
  results.getRange("B6").formulas=[["=SQRT(B9/(2*B5))"]];
  results.getRange("B7").formulas=[["=EXP(AVERAGE(Tratamento!J2:J11)-2*AVERAGE(Tratamento!I2:I11))"]];
  results.getRange("B8").formulas=[["=SQRT(B9/(2*B7))"]];
  results.getRange("B9:B11").values=[[9.79],[10],["1 medida; 2 vezes no chão"]];
  results.getRange("A13").values=[["Os valores de velocidade dependem do modelo quadrático."]];
  results.getRange("A14").values=[["Incerteza instrumental de x e y ainda não informada."]];
  results.getRange("A:A").format.columnWidth=45;
  results.getRange("B:B").format.columnWidth=30;
  results.getRange("A3:B11").format.borders={preset:"all",style:"thin",color:"#D9D9D9"};
  results.getRange("B4:B9").setNumberFormat("0.000000");
  book.recalculate();
  const check=await book.inspect({kind:"table",range:"Resultados!A3:B11",include:"values,formulas",tableMaxRows:10,tableMaxCols:2});
  console.log("RESULTADOS",check.ndjson.slice(0,3000));
  for(let [sheet,range,name] of [["Resultados","A1:B14","resultados"],["Medidas","A1:D12","medidas"],["Tratamento","A1:J12","tratamento"]]){
    const b=await book.render({sheetName:sheet,range,scale:1.5});
    fs.writeFileSync(path.join(root,"tmp","preview_"+name+".png"),Buffer.from(await b.arrayBuffer()));
  }
  blob=await SpreadsheetFile.exportXlsx(book);
  await blob.save(path.join(root,"Tabela_Medidas_Calculadas.xlsx"));
})().catch(e=>{console.error(e);process.exit(1)});

