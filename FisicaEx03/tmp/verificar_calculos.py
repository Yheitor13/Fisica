from pathlib import Path
import json,numpy as np,openpyxl
p=Path(__file__).resolve().parents[1]
w=openpyxl.load_workbook(p/'refs/medidas_fisicaEX03.xlsx',data_only=True)
r=np.array([[c.value for c in row] for row in w.active.iter_rows(min_row=6,max_row=22,min_col=2,max_col=5)])
j=json.loads((p/'tmp/calculos_verificados.json').read_text())
d=r[:,0]/100;t=r[:,1:].mean(1);sd=r[:,1:].std(1,ddof=1);u=np.hypot(sd/np.sqrt(3),.0001)
np.testing.assert_allclose(t,[a['mean'] for a in j['rows']],rtol=1e-12)
np.testing.assert_allclose(u,[a['total'] for a in j['rows']],rtol=1e-12)
for key,x,y,uy in [('log',np.log(d),np.log(t),u/t),('squareFree',d,t*t,2*t*u)]:
 A=np.column_stack([x,np.ones(len(x))]);Aw=A/uy[:,None];yw=y/uy
 beta=np.linalg.lstsq(Aw,yw,rcond=None)[0];cov=np.linalg.inv(Aw.T@Aw)
 np.testing.assert_allclose(beta,[j[key]['a'],j[key]['b']],rtol=1e-10)
 np.testing.assert_allclose(np.sqrt(np.diag(cov)),[j[key]['ua'],j[key]['ub']],rtol=1e-10)
 np.testing.assert_allclose(cov[0,1],j[key]['covariance'],rtol=1e-10)
 np.testing.assert_allclose(np.sum(((y-A@beta)/uy)**2),j[key]['chi'],rtol=1e-10)
q=t*t;uq=2*t*u;a=np.sum(d*q/uq**2)/np.sum(d*d/uq**2)
np.testing.assert_allclose(2/a,j['squareOrigin']['g'],rtol=1e-12)
X=np.log(d);Y=np.log(t);uy=u/t;b=np.average(Y-X/2,weights=1/uy**2)
np.testing.assert_allclose(2*np.exp(-2*b),j['logFixed']['g'],rtol=1e-12)
result={'status':'conferido','metodo':'NumPy least-squares independente a partir da planilha salva','pontos':len(r),'tempos':r[:,1:].size,'checagens':['médias','DP e incertezas','coeficientes','covariâncias','qui-quadrado','g pelos dois métodos']}
(p/'tmp/verificacao_independente.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf8');print(json.dumps(result,ensure_ascii=False))
