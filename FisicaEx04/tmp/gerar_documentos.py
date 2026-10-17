from pathlib import Path
import json, math
from docx import Document
from docx.shared import Cm, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image as RLImage, PageBreak, KeepTogether
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT=Path(__file__).resolve().parents[1]
z=json.loads((ROOT/"tmp/calculos_verificados.json").read_text(encoding="utf-8"))
rr=z["rows"]
lf=z["model_log_free"]
lo=z["model_log_n2"]
sq=z["model_square_origin"]
diag=z["model_square_intercept"]
data=[
("5","0,15","0,2","0,3"),("10","1,4","1,5","1,7"),
("15","3,1","3,85","4,0"),("20","8,7","9,05","9,4"),
("25","13,05","13,2","13,8"),("30","18,8","20,1","20,7"),
("35","28,6","29,15","29,95"),("40","32,7","36,7","40,15"),
("45","48,6","49,35","53,0"),("50","63,35","64,4","67,35"),
("55","81,7","No ch�o","No ch�o")]
def num(v,n=3):return f"{v:.{n}f}".replace(".",",")

doc=Document()
sec=doc.sections[0]
sec.top_margin=Cm(3);sec.bottom_margin=Cm(2);sec.left_margin=Cm(3);sec.right_margin=Cm(2)
normal=doc.styles["Normal"]
normal.font.name="Arial";normal.font.size=Pt(11)
normal.paragraph_format.line_spacing=1.35
normal.paragraph_format.space_after=Pt(7)
for name,size in [("Title",16),("Heading 1",13),("Heading 2",11)]:
    s=doc.styles[name];s.font.name="Arial";s.font.size=Pt(size);s.font.bold=True;s.font.color.rgb=RGBColor(0,0,0)
    s.paragraph_format.space_before=Pt(12);s.paragraph_format.space_after=Pt(8)
def para(text="",bold=False,center=False):
    p=doc.add_paragraph()
    if center:p.alignment=WD_ALIGN_PARAGRAPH.CENTER
    r=p.add_run(text);r.bold=bold
    return p
def heading(text):doc.add_heading(text,level=1)
def caption(text):
    p=doc.add_paragraph(text);p.alignment=WD_ALIGN_PARAGRAPH.CENTER
    p.style=normal
    for r in p.runs:r.italic=True;r.font.size=Pt(9)
def table(headers,body,widths=None):
    t=doc.add_table(rows=1,cols=len(headers));t.style="Table Grid"
    t.alignment=WD_TABLE_ALIGNMENT.CENTER
    for j,h in enumerate(headers):t.rows[0].cells[j].text=h
    for row in body:
        cells=t.add_row().cells
        for j,val in enumerate(row):cells[j].text=str(val)
    for i,row in enumerate(t.rows):
        for cell in row.cells:
            cell.vertical_alignment=WD_CELL_VERTICAL_ALIGNMENT.CENTER
            for p in cell.paragraphs:
                p.alignment=WD_ALIGN_PARAGRAPH.CENTER
                p.paragraph_format.space_after=Pt(2)
                for run in p.runs:run.font.size=Pt(8.5)
            if i==0:
                tcPr=cell._tc.get_or_add_tcPr()
                shd=OxmlElement("w:shd");shd.set(qn("w:fill"),"DCE6F0");tcPr.append(shd)
                for p in cell.paragraphs:
                    for run in p.runs:run.bold=True
    if widths:
        for row in t.rows:
            for cell,w in zip(row.cells,widths):cell.width=Cm(w)
    doc.add_paragraph()
    return t
def picture(filename,legend):
    p=doc.add_paragraph()
    p.alignment=WD_ALIGN_PARAGRAPH.CENTER
    p.add_run().add_picture(str(ROOT/"tmp/graficos"/filename),width=Cm(15.5))
    caption(legend)

# Capa e folha de rosto com a mesma estrutura acad�mica dos relat�rios anteriores.
for s in ("UNIVERSIDADE FEDERAL DE UBERL�NDIA","INSTITUTO DE F�SICA"):
    para(s,center=True)
doc.add_paragraph("\n"*5)
para("HEITOR YOCHIDA DE �VILA",center=True)
doc.add_paragraph("\n"*5)
para("RELAT�RIO DE F�SICA GERAL EXPERIMENTAL I",bold=True,center=True)
para("Movimento de um proj�til em duas dimens�es",center=True)
doc.add_paragraph("\n"*5)
para("Uberl�ndia 2026",center=True)
doc.add_page_break()
para("RELAT�RIO DE F�SICA GERAL EXPERIMENTAL I",bold=True,center=True)
para("Movimento de um proj�til em duas dimens�es",center=True)
doc.add_paragraph("\n"*4)
para("Relat�rio da disciplina F�sica Geral Experimental I da Universidade Federal de Uberl�ndia. Cap�tulo 13 da apostila do laborat�rio.")
para("Autor: Heitor Yochida de �vila")
para("Data do registro: outubro de 2026. A data exata da pr�tica n�o foi informada.")
doc.add_paragraph("\n"*6)
para("Uberl�ndia 2026",center=True)
doc.add_page_break()

heading("RESUMO")
para("Foi estudada a trajet�ria de uma esfera lan�ada horizontalmente de uma rampa. Para posi��es horizontais entre 5 e 50 cm, foram registradas tr�s posi��es verticais por dist�ncia; em 55 cm houve uma leitura de 81,7 cm e duas indica��es de que a esfera atingiu o ch�o. A partir das m�dias, analisaram-se a lei de pot�ncia e a rela��o entre y e x�. O ajuste logar�tmico livre forneceu expoente n = "+num(lf["n"],3)+" � "+num(lf["u_n"],3)+". Sob a hip�tese quadr�tica e com g = 9,79 m/s�, o ajuste de y em fun��o de x� pela origem forneceu velocidade inicial de "+num(sq["velocity"]["v0_m_s"],3)+" m/s. A incerteza instrumental das posi��es n�o foi informada; as incertezas apresentadas descrevem somente a dispers�o das leituras ou os res�duos do ajuste. A diferen�a entre o expoente obtido e o valor ideal 2 limita a interpreta��o da velocidade como estimativa f�sica completa.")
para("Palavras-chave: lan�amento horizontal; trajet�ria; regress�o; lineariza��o; incerteza estat�stica.")

heading("1 INTRODU��O")
para("No lan�amento horizontal ideal, a coordenada horizontal � x = v0t e o deslocamento vertical a partir da altura de sa�da � y = gt�/2. Eliminando o tempo, obt�m-se y = [g/(2v0�)]x�. Assim, o gr�fico de y em fun��o de x� � linear e o expoente de uma lei de pot�ncia y = Kxn deve ser n = 2. A apostila do laborat�rio, cap�tulo 13, solicita a trajet�ria, a lineariza��o logar�tmica e a an�lise quadr�tica.")
para("O objetivo � analisar as medidas confirmadas, verificar a adequa��o da lei de pot�ncia e estimar a velocidade horizontal inicial sob o modelo ideal, sem alterar as leituras coletadas.")

heading("2 FUNDAMENTA��O E TRATAMENTO")
para("Para cada dist�ncia com tr�s lan�amentos, calcularam-se a m�dia ? = Sy?/3, o desvio padr�o amostral s = V[S(y?-?)�/2] e a incerteza estat�stica da m�dia u???(?) = s/V3. Como n�o foram informadas resolu��es instrumentais, u??? n�o representa a incerteza total. Em x = 55 cm, apenas uma leitura � num�rica, de modo que n�o se estima s nem u??? para essa posi��o.")
para("As vari�veis foram convertidas de cent�metros para metros antes dos ajustes. A transforma��o logar�tmica � ln(y/1 m) = n ln(x/1 m) + b. Se n for fixado em 2, A = e?/1 m e v0 = V[g/(2A)]. No segundo m�todo, ajusta-se y = Ax� pela origem e utiliza-se a mesma rela��o. Todos os ajustes aqui s�o m�nimos quadrados ordin�rios, pois a incerteza instrumental de x e a incerteza total de y n�o est�o definidas. Os erros padr�o dos par�metros estimam a dispers�o residual sob o respectivo modelo; n�o incluem efeitos sistem�ticos.")

heading("3 METODOLOGIA")
para("O roteiro descreve uma esfera liberada de uma rampa, que colide com um anteparo coberto por papel, registrando a posi��o vertical em diferentes dist�ncias horizontais. A tabela foi transcrita da folha enviada e confirmada pelo estudante em 17/10/2026. A altura da rampa, o instrumento usado para x e y, suas resolu��es e fotografias da montagem n�o foram fornecidos. Logo, n�o se afirma calibra��o, dimens�es da montagem ou procedimentos adicionais.")
caption("Tabela 1 Medidas originais confirmadas, em cent�metros")
table(["x","y�","y�","y�"],data)
para(""No ch�o" � uma observa��o qualitativa, n�o um valor y = 0 nem uma leitura y = 81,7 cm. Os ajustes usam as dez posi��es de 5 a 50 cm com tr�s leituras num�ricas; a observa��o em 55 cm � preservada fora da regress�o.")

heading("4 RESULTADOS E DISCUSS�O")
caption("Tabela 2 M�dias e incerteza estat�stica da m�dia")
table(["x (cm)","n","? (cm)","s (cm)","u??? (cm)"],
      [[r["x_cm"],r["n"],num(r["mean_cm"],4),
        "-" if r["s_cm"] is None else num(r["s_cm"],4),
        "-" if r["u_stat_cm"] is None else num(r["u_stat_cm"],4)] for r in rr])
para("Exemplo em x = 20 cm: ? = (8,7 + 9,05 + 9,4)/3 = 9,0167 cm; s = 0,3500 cm e u??? = 0,2021 cm. Os c�lculos e os ajustes utilizam os valores completos antes do arredondamento.")
picture("01_Trajetoria.png","Figura 1 Trajet�ria medida. A cruz em 55 cm representa uma �nica leitura e n�o participa do ajuste.")
para("A depend�ncia crescente � compat�vel qualitativamente com a trajet�ria de um lan�amento. Contudo, o modelo quadr�tico simples apresenta res�duos estruturados, especialmente nas dist�ncias maiores; a dispers�o entre lan�amentos em 40 cm tamb�m � elevada.")
picture("03_Linearizacao_Logaritmica.png","Figura 2 Lineariza��o logar�tmica com expoente livre e expoente fixado em 2.")
para("O ajuste de ln(y/1 m) por ln(x/1 m) resultou em n = "+num(lf["n"],3)+" � "+num(lf["u_n"],3)+", b = "+num(lf["intercept"],3)+" � "+num(lf["intercept_se"],3)+" e R� = "+num(lf["r2"],4)+". A incerteza do expoente � formal, derivada dos res�duos do ajuste. O valor est� afastado de 2; portanto, o coeficiente da lei de pot�ncia livre n�o deve ser convertido diretamente em velocidade de lan�amento constante.")
picture("02_Linearizacao_Quadratica.png","Figura 3 Deslocamento vertical em fun��o de x� com ajuste pela origem e diagn�stico de intercepto livre.")
caption("Tabela 3 Par�metros e estimativas condicionais")
table(["An�lise","Coeficiente","v0 (m/s)"],
      [["Logar�tmica, n livre","n = "+num(lf["n"],3)+" � "+num(lf["u_n"],3),"n�o aplic�vel"],
       ["Logar�tmica, n = 2","A = "+num(lo["velocity"]["A_per_m"],3)+" m?�",
        num(lo["velocity"]["v0_m_s"],3)+" � "+num(lo["velocity"]["u_v0_fit_m_s"],3)],
       ["y = Ax� pela origem","A = "+num(sq["slope"],3)+" � "+num(sq["slope_se"],3)+" m?�",
        num(sq["velocity"]["v0_m_s"],3)+" � "+num(sq["velocity"]["u_v0_fit_m_s"],3)],
       ["y = Ax� + B","B = "+num(diag["intercept"],4)+" m","diagn�stico"]])
para("O modelo quadr�tico pela origem fornece A = ("+num(sq["slope"],3)+" � "+num(sq["slope_se"],3)+") m?�. Aplicando g = 9,79 m/s�, v0 = ("+num(sq["velocity"]["v0_m_s"],3)+" � "+num(sq["velocity"]["u_v0_fit_m_s"],3)+") m/s. A estimativa pelo logaritmo com n imposto em 2 � ("+num(lo["velocity"]["v0_m_s"],2)+" � "+num(lo["velocity"]["u_v0_fit_m_s"],2)+") m/s. Esses valores usam as mesmas leituras, mas crit�rios de ajuste diferentes; sua discrep�ncia evidencia depend�ncia do modelo.")
para("Com intercepto livre, y = ("+num(diag["slope"],3)+" m?�)x� "+num(diag["intercept"],4)+" m. O intercepto negativo n�o � uma corre��o f�sica demonstrada da posi��o inicial e n�o foi subtra�do dos dados. Entre as poss�veis causas a investigar est�o refer�ncias de leitura, sa�da n�o perfeitamente horizontal, varia��o da condi��o de soltura e efeitos de colis�o; os dados dispon�veis n�o identificam uma causa �nica.")
para("As barras dos gr�ficos representam apenas u???. Para uma incerteza instrumental u? e u? conhecida, seria necess�rio combinar contribui��es conforme o m�todo da apostila: u(?) = V[u???� + u?�], u[ln(y/1 m)] ~ u(?)/? e u(x�) ~ 2|x|u?. Sem essas resolu��es, n�o se deve atribuir cobertura estat�stica completa aos intervalos de v0 apresentados.")

heading("5 CONCLUS�O")
para("As medidas confirmadas mostram uma trajet�ria crescente e aproximadamente parab�lica, mas o ajuste livre apresenta expoente "+num(lf["n"],2)+", acima do valor 2 previsto para lan�amento horizontal ideal. Ao impor a rela��o quadr�tica, obt�m-se v0 ~ "+num(sq["velocity"]["v0_m_s"],2)+" m/s pelo ajuste de y por x� na origem. A diferen�a em rela��o ao m�todo logar�tmico fixado e o comportamento dos res�duos exigem cautela: trata-se de uma estimativa condicionada ao modelo e �s incertezas dispon�veis. A an�lise experimental completa requer a resolu��o dos instrumentos, a altura da montagem e a folha de marca��es indicada no roteiro.")
heading("REFER�NCIAS")
para("IWAMOTO, W. A.; GUARANY, C. A.; FOSCHINI, M.; DI LORENZO, A. Guias e roteiros para Laborat�rio de F�sica Experimental I. Uberl�ndia: Instituto de F�sica, UFU, 2014. Cap�tulos 2 a 6 e 13. Apostila disponibilizada na disciplina.")
para("REGISTRO EXPERIMENTAL. Tabela de posi��es do lan�amento horizontal, transcrita da folha enviada e confirmada por Heitor Yochida de �vila em 17 out. 2026.")
doc.core_properties.title="Movimento de um proj�til em duas dimens�es"
doc.core_properties.author="Heitor Yochida de �vila"
doc.save(ROOT/"Relatorio_Final.docx")

# Arquivos complementares em PDF.
pdfmetrics.registerFont(TTFont("Arial",r"C:\Windows\Fonts\arial.ttf"))
pdfmetrics.registerFont(TTFont("ArialBold",r"C:\Windows\Fonts\arialbd.ttf"))
st=getSampleStyleSheet()
for style in st.byName.values():style.fontName="Arial"
st["Normal"].fontSize=10;st["Normal"].leading=14;st["Normal"].spaceAfter=7
st["Title"].fontName="ArialBold";st["Title"].fontSize=17;st["Title"].leading=22
st["Heading1"].fontName="ArialBold";st["Heading1"].fontSize=12
st.add(ParagraphStyle(name="SmallLocal",parent=st["Normal"],fontSize=8.5,leading=11))
def P(t,style="Normal"):
    # A fonte PDF n�o cont�m alguns subscritos; usar nota��o ASCII leg�vel.
    for old,new in (("???","_est"),("0","0"),("�","1"),("�","2"),
                    ("?�","^-1"),("V","sqrt"),("?","y_med")):
        t=str(t).replace(old,new)
    return Paragraph(t,st[style])
def T(headers,rows,widths):
    a=Table([[P(str(x),"SmallLocal") for x in headers]]+[[P(str(x),"SmallLocal") for x in r] for r in rows],
            colWidths=widths,repeatRows=1)
    a.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,0),colors.HexColor("#dce6f0")),
        ("GRID",(0,0),(-1,-1),.35,colors.HexColor("#d9d9d9")),
        ("VALIGN",(0,0),(-1,-1),"MIDDLE"),("TOPPADDING",(0,0),(-1,-1),5),
        ("BOTTOMPADDING",(0,0),(-1,-1),5)]))
    return a
def footer(c,d):
    c.setFont("Arial",8);c.drawString(54,25,"F�sica Geral Experimental I  |  Cap�tulo 13")
    c.drawRightString(A4[0]-54,25,str(d.page))
def build(name,story):
    SimpleDocTemplate(str(ROOT/name),pagesize=A4,leftMargin=54,rightMargin=54,
                      topMargin=50,bottomMargin=48).build(story,onFirstPage=footer,onLaterPages=footer)
summary=[
 P("Cap�tulo 13  Movimento de um proj�til","Title"),
 P("Resultados dos c�lculos","Heading1"),
 P("Dez posi��es, 5 a 50 cm, com tr�s leituras num�ricas cada. Em 55 cm h� uma leitura de 81,7 cm e duas observa��es "No ch�o"; essa posi��o n�o foi ajustada."),
 T(["Grandeza","Resultado"],[
  ["Expoente livre n",num(lf["n"],3)+" � "+num(lf["u_n"],3)],
  ["A de y = Ax�",num(sq["slope"],3)+" � "+num(sq["slope_se"],3)+" m?�"],
  ["v0 pelo ajuste quadr�tico",num(sq["velocity"]["v0_m_s"],3)+" � "+num(sq["velocity"]["u_v0_fit_m_s"],3)+" m/s"],
  ["v0 pelo ajuste logar�tmico com n = 2",num(lo["velocity"]["v0_m_s"],3)+" � "+num(lo["velocity"]["u_v0_fit_m_s"],3)+" m/s"],
  ["Intercepto do diagn�stico",num(diag["intercept"],4)+" � "+num(diag["intercept_se"],4)+" m"],
 ],[240,245]),Spacer(1,18),
 P("Interpreta��o","Heading1"),
 P("g = 9,79 m/s� conforme o roteiro. Os par�metros foram obtidos por m�nimos quadrados ordin�rios. Os intervalos acima s�o erros padr�o formais dos ajustes, n�o incertezas totais de medi��o. A incerteza instrumental de x e y n�o foi fornecida."),
 P("O expoente livre difere de 2 e os dois m�todos quadr�ticos fornecem velocidades diferentes. Nenhuma leitura foi alterada; a estimativa de v0 � condicional ao modelo ideal. A linha de 55 cm � preservada, mas n�o fornece tr�s leituras num�ricas para o mesmo tratamento."),
 P("Fonte: medidas confirmadas em 17/10/2026 e apostila LAB1, cap�tulo 13.","SmallLocal")
]
build("Resultados_Finais.pdf",summary)

detail=[P("Cap�tulo 13  Resolu��o dos c�lculos","Title"),
 P("1 Dados originais","Heading1"),
 T(["x (cm)","y� (cm)","y� (cm)","y� (cm)"],data,[70,125,125,165]),
 P("As dez primeiras linhas t�m tr�s leituras. Em 55 cm, y� = 81,7 cm; as outras duas observa��es s�o "No ch�o". N�o se imputou valor nem se suprimiu a linha da fonte."),
 P("2 M�dias e dispers�o","Heading1"),
 P("? = Sy?/3; s = V[S(y?-?)�/(3-1)]; u???(?) = s/V3. Esses termos estat�sticos n�o incluem resolu��o dos instrumentos."),
 T(["x (cm)","? (cm)","s (cm)","u??? (cm)"],
   [[r["x_cm"],num(r["mean_cm"],5),"-" if r["s_cm"] is None else num(r["s_cm"],5),
     "-" if r["u_stat_cm"] is None else num(r["u_stat_cm"],5)] for r in rr],
   [65,125,145,150]),
 P("Para 20 cm: ? = (8,7 + 9,05 + 9,4)/3 = 9,0166667 cm; s = 0,3500000 cm; u??? = 0,2020726 cm."),
 PageBreak(),
 P("3 Ajuste logar�tmico","Heading1"),
 P("X = ln(x / 1 m); Y = ln(? / 1 m); Y = nX + b. Os logaritmos s�o de raz�es adimensionais; as posi��es foram convertidas previamente de cm para m."),
 T(["x (cm)","? (cm)","ln(x / 1 m)","ln(? / 1 m)"],
   [[r["x_cm"],num(r["mean_cm"],4),num(r["ln_x"],6),num(r["ln_y"],6)] for r in rr[:10]],
   [62,95,160,168]),
 P("M�nimos quadrados ordin�rios: n = "+num(lf["n"],8)+", b = "+num(lf["intercept"],8)+
   ", erro padr�o de n = "+num(lf["u_n"],8)+", R� = "+num(lf["r2"],7)+". O erro padr�o utiliza a vari�ncia residual RSS/(N-2), com N = 10."),
 P("O coeficiente com n livre tem dimens�o dependente do expoente. Como n difere de 2, n�o se infere v0 constante diretamente desse coeficiente."),
 P("Fixando n = 2: b� = m�dia[Y-2X] = "+num(lo["intercept"],8)+
   "; A = exp(b�)/1 m = "+num(lo["velocity"]["A_per_m"],8)+
   " m?�; v0 = V[9,79/(2A)] = "+num(lo["velocity"]["v0_m_s"],8)+" m/s."),
 PageBreak(),
 P("4 Rela��o quadr�tica","Heading1"),
 P("Defina Z = x� em m�. No modelo y = AZ pela origem, A = S(Zy)/S(Z�) = "+
   num(sq["slope"],8)+" m?�. A vari�ncia residual estimada � RSS/(N-1); o erro padr�o do coeficiente � "+
   num(sq["slope_se"],8)+" m?�."),
 T(["x (cm)","x� (m�)","? (m)","y-Ax� (m)"],
   [[r["x_cm"],num(r["x2_m2"],6),num(r["mean_m"],6),num(e,6)]
    for r,e in zip(rr[:10],sq["residuals"])],
   [65,125,125,170]),
 P("v0 = V[g/(2A)] = "+num(sq["velocity"]["v0_m_s"],8)+" m/s. A propaga��o somente do erro padr�o do ajuste fornece u(v0) ~ v0 u(A)/(2A) = "+
   num(sq["velocity"]["u_v0_fit_m_s"],8)+" m/s. Isso n�o inclui incerteza em g, x, y ou condi��es de lan�amento."),
 P("Diagn�stico com intercepto livre: y = ("+num(diag["slope"],8)+" m?�)x� "+
   num(diag["intercept"],8)+" m, com erro padr�o do intercepto "+
   num(diag["intercept_se"],8)+" m. N�o corrigir as medi��es com esse intercepto sem evid�ncia adicional."),
 P("5 Propaga��o a completar","Heading1"),
 P("Quando forem conhecidas as resolu��es u? e u?: u(?) = V[u???� + u?�]; u(x�) ~ 2|x|u?; u[ln(x/1 m)] ~ u?/x; u[ln(?/1 m)] ~ u(?)/?. O tratamento poder� ent�o ser repetido com pesos e efeitos instrumentais justificados."),
 P("Fonte: tabela confirmada pelo estudante; apostila LAB1, cap�tulos 2-6 e 13. Scripts, fonte e JSON com precis�o integral ficam em tmp.","SmallLocal")
]
build("Resolucao_Completa.pdf",detail)
report=[
 P("UNIVERSIDADE FEDERAL DE UBERL�NDIA","Title"),Spacer(1,125),
 P("Relat�rio de F�sica Geral Experimental I","Title"),
 P("Movimento de um proj�til em duas dimens�es","Heading1"),
 Spacer(1,145),P("Heitor Yochida de �vila"),P("Uberl�ndia 2026"),PageBreak(),
 P("Resumo","Heading1"),
 P("Foram analisadas tr�s posi��es verticais para cada dist�ncia horizontal entre 5 e 50 cm. Em 55 cm, uma leitura foi 81,7 cm e duas indicaram "No ch�o". O ajuste livre da lei de pot�ncia y = Kxn resultou em n = "+
   num(lf["n"],3)+" � "+num(lf["u_n"],3)+". Admitindo y = Ax� e g = 9,79 m/s�, estimou-se v0 = "+
   num(sq["velocity"]["v0_m_s"],3)+" m/s pelo ajuste quadr�tico na origem. A resolu��o dos instrumentos n�o foi informada; incertezas formais e estat�sticas n�o incluem efeitos instrumentais."),
 P("Palavras-chave: lan�amento horizontal; trajet�ria; lineariza��o; regress�o."),
 P("1 Introdu��o","Heading1"),
 P("No modelo de lan�amento horizontal, x = v0t e y = gt�/2. Eliminar t leva a y = [g/(2v0�)]x�. A compara��o com uma lei de pot�ncia y = Kxn verifica se o expoente n se aproxima do valor te�rico 2. O cap�tulo 13 da apostila solicita gr�ficos da trajet�ria, lineariza��o logar�tmica e ajuste de y por x�."),
 P("Objetivo: analisar as medidas confirmadas e estimar v0 sob hip�teses expl�citas, preservando integralmente as leituras."),
 P("2 M�todo e fonte dos dados","Heading1"),
 P("A apostila descreve esfera liberada de uma rampa e anteparo com marca��es verticais em v�rias dist�ncias horizontais. A tabela foi confirmada pelo estudante em 17/10/2026. N�o foram fornecidas a altura da sa�da, a resolu��o dos instrumentos nem fotografias da montagem; n�o se atribuem procedimentos ou calibra��es adicionais."),
 T(["x (cm)","y� (cm)","y� (cm)","y� (cm)"],data,[70,125,125,165]),
 P("Em 55 cm, duas ocorr�ncias "No ch�o" s�o observa��es sem valor num�rico. S� os dez conjuntos completos de 5 a 50 cm entraram nos ajustes. A leitura isolada de 81,7 cm permanece na fonte e na figura da trajet�ria."),
 P("3 Tratamento estat�stico","Heading1"),
 P("Calculou-se ? = Sy?/3, s = V[S(y?-?)�/2] e u???(?) = s/V3. Os ajustes s�o m�nimos quadrados ordin�rios porque n�o h� incerteza instrumental completa de x e y. Os erros padr�o dos par�metros derivam dos res�duos e n�o representam cobertura total."),
 T(["x (cm)","? (cm)","s (cm)","u??? (cm)"],
   [[r["x_cm"],num(r["mean_cm"],3),"-" if r["s_cm"] is None else num(r["s_cm"],3),
     "-" if r["u_stat_cm"] is None else num(r["u_stat_cm"],3)] for r in rr],
   [65,125,145,150]),
 P("4 Resultados e discuss�o","Heading1"),
 RLImage(str(ROOT/"tmp/graficos/01_Trajetoria.png"),width=480,height=314),
 P("Figura 1. Trajet�ria medida; 55 cm aparece como leitura isolada, fora da regress�o.","SmallLocal"),
 P("O conjunto � crescente, mas o desvio do modelo ideal e a dispers�o de algumas tr�ades exigem an�lise dos res�duos."),
 RLImage(str(ROOT/"tmp/graficos/03_Linearizacao_Logaritmica.png"),width=480,height=314),
 P("Figura 2. Ajuste de ln(y/1 m) por ln(x/1 m).","SmallLocal"),
 P("O expoente livre foi n = "+num(lf["n"],3)+" � "+num(lf["u_n"],3)+
   "; intercepto b = "+num(lf["intercept"],3)+" � "+num(lf["intercept_se"],3)+
   "; R� = "+num(lf["r2"],4)+". Como n difere de 2, o coeficiente livre n�o permite inferir velocidade inicial constante sem impor outra hip�tese."),
 RLImage(str(ROOT/"tmp/graficos/02_Linearizacao_Quadratica.png"),width=480,height=314),
 P("Figura 3. Lineariza��o y por x� pela origem e com intercepto livre.","SmallLocal"),
 T(["M�todo","Par�metro","v0 (m/s)"],[
   ["Logar�tmico n livre","n = "+num(lf["n"],3)+" � "+num(lf["u_n"],3),"n�o aplic�vel"],
   ["Logar�tmico n = 2","A = "+num(lo["velocity"]["A_per_m"],3)+" m?�",
      num(lo["velocity"]["v0_m_s"],3)+" � "+num(lo["velocity"]["u_v0_fit_m_s"],3)],
   ["Quadr�tico pela origem","A = "+num(sq["slope"],3)+" � "+num(sq["slope_se"],3)+" m?�",
      num(sq["velocity"]["v0_m_s"],3)+" � "+num(sq["velocity"]["u_v0_fit_m_s"],3)]],
   [175,165,145]),
 P("No m�todo direto, A = S(x�y)/S(x4) = "+num(sq["slope"],6)+
   " m?� e v0 = V[g/(2A)] = "+num(sq["velocity"]["v0_m_s"],3)+
   " m/s, usando g = 9,79 m/s�. A outra estimativa com n = 2 � "+
   num(lo["velocity"]["v0_m_s"],3)+" m/s. Como partem das mesmas leituras, n�o s�o verifica��es independentes; a diferen�a entre elas mostra a sensibilidade � forma do ajuste."),
 P("Um ajuste adicional y = Ax� + B fornece B = "+num(diag["intercept"],4)+
   " m, �til como diagn�stico. Ele n�o comprova uma corre��o de origem, que n�o foi aplicada. A resolu��o instrumental, o alinhamento, as condi��es de libera��o e efeitos de colis�o permanecem pontos a investigar. As barras de erro representam somente s/V3."),
 P("5 Conclus�o","Heading1"),
 P("As medidas permitem construir a trajet�ria e as duas lineariza��es do roteiro. O expoente livre de "+
   num(lf["n"],2)+" excede o valor ideal 2; sob a hip�tese quadr�tica, a velocidade inicial estimada pelo ajuste direto � cerca de "+
   num(sq["velocity"]["v0_m_s"],2)+" m/s. As conclus�es dependem do modelo e n�o substituem uma an�lise completa de incertezas instrumentais. Os dados originais, inclusive as observa��es em 55 cm, foram preservados."),
 P("Refer�ncias","Heading1"),
 P("IWAMOTO, W. A.; GUARANY, C. A.; FOSCHINI, M.; DI LORENZO, A. Guias e roteiros para Laborat�rio de F�sica Experimental I. Uberl�ndia: Instituto de F�sica, UFU, 2014. Cap�tulos 2-6 e 13."),
 P("REGISTRO EXPERIMENTAL. Tabela confirmada por Heitor Yochida de �vila em 17 out. 2026.")
]
build("Relatorio_Final.pdf",report)
print("Documentos gerados")

