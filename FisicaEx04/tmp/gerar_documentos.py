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
("55","81,7","No chão","No chão")]
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

# Capa e folha de rosto com a mesma estrutura acadêmica dos relatórios anteriores.
for s in ("UNIVERSIDADE FEDERAL DE UBERLÂNDIA","INSTITUTO DE FÍSICA"):
    para(s,center=True)
doc.add_paragraph("\n"*5)
para("HEITOR YOCHIDA DE ÁVILA",center=True)
doc.add_paragraph("\n"*5)
para("RELATÓRIO DE FÍSICA GERAL EXPERIMENTAL I",bold=True,center=True)
para("Movimento de um projétil em duas dimensões",center=True)
doc.add_paragraph("\n"*5)
para("Uberlândia 2026",center=True)
doc.add_page_break()
para("RELATÓRIO DE FÍSICA GERAL EXPERIMENTAL I",bold=True,center=True)
para("Movimento de um projétil em duas dimensões",center=True)
doc.add_paragraph("\n"*4)
para("Relatório da disciplina Física Geral Experimental I da Universidade Federal de Uberlândia. Capítulo 13 da apostila do laboratório.")
para("Autor: Heitor Yochida de Ávila")
para("Data do registro: outubro de 2026. A data exata da prática não foi informada.")
doc.add_paragraph("\n"*6)
para("Uberlândia 2026",center=True)
doc.add_page_break()

heading("RESUMO")
para("Foi estudada a trajetória de uma esfera lançada horizontalmente de uma rampa. Para posições horizontais entre 5 e 50 cm, foram registradas três posições verticais por distância; em 55 cm houve uma leitura de 81,7 cm e duas indicações de que a esfera atingiu o chão. A partir das médias, analisaram-se a lei de potência e a relação entre y e x². O ajuste logarítmico livre forneceu expoente n = "+num(lf["n"],3)+" ± "+num(lf["u_n"],3)+". Sob a hipótese quadrática e com g = 9,79 m/s², o ajuste de y em função de x² pela origem forneceu velocidade inicial de "+num(sq["velocity"]["v0_m_s"],3)+" m/s. A incerteza instrumental das posições não foi informada; as incertezas apresentadas descrevem somente a dispersão das leituras ou os resíduos do ajuste. A diferença entre o expoente obtido e o valor ideal 2 limita a interpretação da velocidade como estimativa física completa.")
para("Palavras-chave: lançamento horizontal; trajetória; regressão; linearização; incerteza estatística.")

heading("1 INTRODUÇÃO")
para("No lançamento horizontal ideal, a coordenada horizontal é x = v₀t e o deslocamento vertical a partir da altura de saída é y = gt²/2. Eliminando o tempo, obtém-se y = [g/(2v₀²)]x². Assim, o gráfico de y em função de x² é linear e o expoente de uma lei de potência y = Kxⁿ deve ser n = 2. A apostila do laboratório, capítulo 13, solicita a trajetória, a linearização logarítmica e a análise quadrática.")
para("O objetivo é analisar as medidas confirmadas, verificar a adequação da lei de potência e estimar a velocidade horizontal inicial sob o modelo ideal, sem alterar as leituras coletadas.")

heading("2 FUNDAMENTAÇÃO E TRATAMENTO")
para("Para cada distância com três lançamentos, calcularam-se a média ȳ = Σyᵢ/3, o desvio padrão amostral s = √[Σ(yᵢ−ȳ)²/2] e a incerteza estatística da média uₑₛₜ(ȳ) = s/√3. Como não foram informadas resoluções instrumentais, uₑₛₜ não representa a incerteza total. Em x = 55 cm, apenas uma leitura é numérica, de modo que não se estima s nem uₑₛₜ para essa posição.")
para("As variáveis foram convertidas de centímetros para metros antes dos ajustes. A transformação logarítmica é ln(y/1 m) = n ln(x/1 m) + b. Se n for fixado em 2, A = eᵇ/1 m e v₀ = √[g/(2A)]. No segundo método, ajusta-se y = Ax² pela origem e utiliza-se a mesma relação. Todos os ajustes aqui são mínimos quadrados ordinários, pois a incerteza instrumental de x e a incerteza total de y não estão definidas. Os erros padrão dos parâmetros estimam a dispersão residual sob o respectivo modelo; não incluem efeitos sistemáticos.")

heading("3 METODOLOGIA")
para("O roteiro descreve uma esfera liberada de uma rampa, que colide com um anteparo coberto por papel, registrando a posição vertical em diferentes distâncias horizontais. A tabela foi transcrita da folha enviada e confirmada pelo estudante em 17/10/2026. A altura da rampa, o instrumento usado para x e y, suas resoluções e fotografias da montagem não foram fornecidos. Logo, não se afirma calibração, dimensões da montagem ou procedimentos adicionais.")
caption("Tabela 1 Medidas originais confirmadas, em centímetros")
table(["x","y₁","y₂","y₃"],data)
para("“No chão” é uma observação qualitativa, não um valor y = 0 nem uma leitura y = 81,7 cm. Os ajustes usam as dez posições de 5 a 50 cm com três leituras numéricas; a observação em 55 cm é preservada fora da regressão.")

heading("4 RESULTADOS E DISCUSSÃO")
caption("Tabela 2 Médias e incerteza estatística da média")
table(["x (cm)","n","ȳ (cm)","s (cm)","uₑₛₜ (cm)"],
      [[r["x_cm"],r["n"],num(r["mean_cm"],4),
        "—" if r["s_cm"] is None else num(r["s_cm"],4),
        "—" if r["u_stat_cm"] is None else num(r["u_stat_cm"],4)] for r in rr])
para("Exemplo em x = 20 cm: ȳ = (8,7 + 9,05 + 9,4)/3 = 9,0167 cm; s = 0,3500 cm e uₑₛₜ = 0,2021 cm. Os cálculos e os ajustes utilizam os valores completos antes do arredondamento.")
picture("01_Trajetoria.png","Figura 1 Trajetória medida. A cruz em 55 cm representa uma única leitura e não participa do ajuste.")
para("A dependência crescente é compatível qualitativamente com a trajetória de um lançamento. Contudo, o modelo quadrático simples apresenta resíduos estruturados, especialmente nas distâncias maiores; a dispersão entre lançamentos em 40 cm também é elevada.")
picture("03_Linearizacao_Logaritmica.png","Figura 2 Linearização logarítmica com expoente livre e expoente fixado em 2.")
para("O ajuste de ln(y/1 m) por ln(x/1 m) resultou em n = "+num(lf["n"],3)+" ± "+num(lf["u_n"],3)+", b = "+num(lf["intercept"],3)+" ± "+num(lf["intercept_se"],3)+" e R² = "+num(lf["r2"],4)+". A incerteza do expoente é formal, derivada dos resíduos do ajuste. O valor está afastado de 2; portanto, o coeficiente da lei de potência livre não deve ser convertido diretamente em velocidade de lançamento constante.")
picture("02_Linearizacao_Quadratica.png","Figura 3 Deslocamento vertical em função de x² com ajuste pela origem e diagnóstico de intercepto livre.")
caption("Tabela 3 Parâmetros e estimativas condicionais")
table(["Análise","Coeficiente","v₀ (m/s)"],
      [["Logarítmica, n livre","n = "+num(lf["n"],3)+" ± "+num(lf["u_n"],3),"não aplicável"],
       ["Logarítmica, n = 2","A = "+num(lo["velocity"]["A_per_m"],3)+" m⁻¹",
        num(lo["velocity"]["v0_m_s"],3)+" ± "+num(lo["velocity"]["u_v0_fit_m_s"],3)],
       ["y = Ax² pela origem","A = "+num(sq["slope"],3)+" ± "+num(sq["slope_se"],3)+" m⁻¹",
        num(sq["velocity"]["v0_m_s"],3)+" ± "+num(sq["velocity"]["u_v0_fit_m_s"],3)],
       ["y = Ax² + B","B = "+num(diag["intercept"],4)+" m","diagnóstico"]])
para("O modelo quadrático pela origem fornece A = ("+num(sq["slope"],3)+" ± "+num(sq["slope_se"],3)+") m⁻¹. Aplicando g = 9,79 m/s², v₀ = ("+num(sq["velocity"]["v0_m_s"],3)+" ± "+num(sq["velocity"]["u_v0_fit_m_s"],3)+") m/s. A estimativa pelo logaritmo com n imposto em 2 é ("+num(lo["velocity"]["v0_m_s"],2)+" ± "+num(lo["velocity"]["u_v0_fit_m_s"],2)+") m/s. Esses valores usam as mesmas leituras, mas critérios de ajuste diferentes; sua discrepância evidencia dependência do modelo.")
para("Com intercepto livre, y = ("+num(diag["slope"],3)+" m⁻¹)x² "+num(diag["intercept"],4)+" m. O intercepto negativo não é uma correção física demonstrada da posição inicial e não foi subtraído dos dados. Entre as possíveis causas a investigar estão referências de leitura, saída não perfeitamente horizontal, variação da condição de soltura e efeitos de colisão; os dados disponíveis não identificam uma causa única.")
para("As barras dos gráficos representam apenas uₑₛₜ. Para uma incerteza instrumental uᵧ e uₓ conhecida, seria necessário combinar contribuições conforme o método da apostila: u(ȳ) = √[uₑₛₜ² + uᵧ²], u[ln(y/1 m)] ≈ u(ȳ)/ȳ e u(x²) ≈ 2|x|uₓ. Sem essas resoluções, não se deve atribuir cobertura estatística completa aos intervalos de v₀ apresentados.")

heading("5 CONCLUSÃO")
para("As medidas confirmadas mostram uma trajetória crescente e aproximadamente parabólica, mas o ajuste livre apresenta expoente "+num(lf["n"],2)+", acima do valor 2 previsto para lançamento horizontal ideal. Ao impor a relação quadrática, obtém-se v₀ ≈ "+num(sq["velocity"]["v0_m_s"],2)+" m/s pelo ajuste de y por x² na origem. A diferença em relação ao método logarítmico fixado e o comportamento dos resíduos exigem cautela: trata-se de uma estimativa condicionada ao modelo e às incertezas disponíveis. A análise experimental completa requer a resolução dos instrumentos, a altura da montagem e a folha de marcações indicada no roteiro.")
heading("REFERÊNCIAS")
para("IWAMOTO, W. A.; GUARANY, C. A.; FOSCHINI, M.; DI LORENZO, A. Guias e roteiros para Laboratório de Física Experimental I. Uberlândia: Instituto de Física, UFU, 2014. Capítulos 2 a 6 e 13. Apostila disponibilizada na disciplina.")
para("REGISTRO EXPERIMENTAL. Tabela de posições do lançamento horizontal, transcrita da folha enviada e confirmada por Heitor Yochida de Ávila em 17 out. 2026.")
doc.core_properties.title="Movimento de um projétil em duas dimensões"
doc.core_properties.author="Heitor Yochida de Ávila"
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
    # A fonte PDF não contém alguns subscritos; usar notação ASCII legível.
    for old,new in (("ₑₛₜ","_est"),("₀","0"),("₁","1"),("₂","2"),
                    ("⁻¹","^-1"),("√","sqrt"),("ȳ","y_med")):
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
    c.setFont("Arial",8);c.drawString(54,25,"Física Geral Experimental I  |  Capítulo 13")
    c.drawRightString(A4[0]-54,25,str(d.page))
def build(name,story):
    SimpleDocTemplate(str(ROOT/name),pagesize=A4,leftMargin=54,rightMargin=54,
                      topMargin=50,bottomMargin=48).build(story,onFirstPage=footer,onLaterPages=footer)
summary=[
 P("Capítulo 13  Movimento de um projétil","Title"),
 P("Resultados dos cálculos","Heading1"),
 P("Dez posições, 5 a 50 cm, com três leituras numéricas cada. Em 55 cm há uma leitura de 81,7 cm e duas observações “No chão”; essa posição não foi ajustada."),
 T(["Grandeza","Resultado"],[
  ["Expoente livre n",num(lf["n"],3)+" ± "+num(lf["u_n"],3)],
  ["A de y = Ax²",num(sq["slope"],3)+" ± "+num(sq["slope_se"],3)+" m⁻¹"],
  ["v₀ pelo ajuste quadrático",num(sq["velocity"]["v0_m_s"],3)+" ± "+num(sq["velocity"]["u_v0_fit_m_s"],3)+" m/s"],
  ["v₀ pelo ajuste logarítmico com n = 2",num(lo["velocity"]["v0_m_s"],3)+" ± "+num(lo["velocity"]["u_v0_fit_m_s"],3)+" m/s"],
  ["Intercepto do diagnóstico",num(diag["intercept"],4)+" ± "+num(diag["intercept_se"],4)+" m"],
 ],[240,245]),Spacer(1,18),
 P("Interpretação","Heading1"),
 P("g = 9,79 m/s² conforme o roteiro. Os parâmetros foram obtidos por mínimos quadrados ordinários. Os intervalos acima são erros padrão formais dos ajustes, não incertezas totais de medição. A incerteza instrumental de x e y não foi fornecida."),
 P("O expoente livre difere de 2 e os dois métodos quadráticos fornecem velocidades diferentes. Nenhuma leitura foi alterada; a estimativa de v₀ é condicional ao modelo ideal. A linha de 55 cm é preservada, mas não fornece três leituras numéricas para o mesmo tratamento."),
 P("Fonte: medidas confirmadas em 17/10/2026 e apostila LAB1, capítulo 13.","SmallLocal")
]
build("Resultados_Finais.pdf",summary)

detail=[P("Capítulo 13  Resolução dos cálculos","Title"),
 P("1 Dados originais","Heading1"),
 T(["x (cm)","y₁ (cm)","y₂ (cm)","y₃ (cm)"],data,[70,125,125,165]),
 P("As dez primeiras linhas têm três leituras. Em 55 cm, y₁ = 81,7 cm; as outras duas observações são “No chão”. Não se imputou valor nem se suprimiu a linha da fonte."),
 P("2 Médias e dispersão","Heading1"),
 P("ȳ = Σyᵢ/3; s = √[Σ(yᵢ−ȳ)²/(3−1)]; uₑₛₜ(ȳ) = s/√3. Esses termos estatísticos não incluem resolução dos instrumentos."),
 T(["x (cm)","ȳ (cm)","s (cm)","uₑₛₜ (cm)"],
   [[r["x_cm"],num(r["mean_cm"],5),"—" if r["s_cm"] is None else num(r["s_cm"],5),
     "—" if r["u_stat_cm"] is None else num(r["u_stat_cm"],5)] for r in rr],
   [65,125,145,150]),
 P("Para 20 cm: ȳ = (8,7 + 9,05 + 9,4)/3 = 9,0166667 cm; s = 0,3500000 cm; uₑₛₜ = 0,2020726 cm."),
 PageBreak(),
 P("3 Ajuste logarítmico","Heading1"),
 P("X = ln(x / 1 m); Y = ln(ȳ / 1 m); Y = nX + b. Os logaritmos são de razões adimensionais; as posições foram convertidas previamente de cm para m."),
 T(["x (cm)","ȳ (cm)","ln(x / 1 m)","ln(ȳ / 1 m)"],
   [[r["x_cm"],num(r["mean_cm"],4),num(r["ln_x"],6),num(r["ln_y"],6)] for r in rr[:10]],
   [62,95,160,168]),
 P("Mínimos quadrados ordinários: n = "+num(lf["n"],8)+", b = "+num(lf["intercept"],8)+
   ", erro padrão de n = "+num(lf["u_n"],8)+", R² = "+num(lf["r2"],7)+". O erro padrão utiliza a variância residual RSS/(N−2), com N = 10."),
 P("O coeficiente com n livre tem dimensão dependente do expoente. Como n difere de 2, não se infere v₀ constante diretamente desse coeficiente."),
 P("Fixando n = 2: b₂ = média[Y−2X] = "+num(lo["intercept"],8)+
   "; A = exp(b₂)/1 m = "+num(lo["velocity"]["A_per_m"],8)+
   " m⁻¹; v₀ = √[9,79/(2A)] = "+num(lo["velocity"]["v0_m_s"],8)+" m/s."),
 PageBreak(),
 P("4 Relação quadrática","Heading1"),
 P("Defina Z = x² em m². No modelo y = AZ pela origem, A = Σ(Zy)/Σ(Z²) = "+
   num(sq["slope"],8)+" m⁻¹. A variância residual estimada é RSS/(N−1); o erro padrão do coeficiente é "+
   num(sq["slope_se"],8)+" m⁻¹."),
 T(["x (cm)","x² (m²)","ȳ (m)","y−Ax² (m)"],
   [[r["x_cm"],num(r["x2_m2"],6),num(r["mean_m"],6),num(e,6)]
    for r,e in zip(rr[:10],sq["residuals"])],
   [65,125,125,170]),
 P("v₀ = √[g/(2A)] = "+num(sq["velocity"]["v0_m_s"],8)+" m/s. A propagação somente do erro padrão do ajuste fornece u(v₀) ≈ v₀ u(A)/(2A) = "+
   num(sq["velocity"]["u_v0_fit_m_s"],8)+" m/s. Isso não inclui incerteza em g, x, y ou condições de lançamento."),
 P("Diagnóstico com intercepto livre: y = ("+num(diag["slope"],8)+" m⁻¹)x² "+
   num(diag["intercept"],8)+" m, com erro padrão do intercepto "+
   num(diag["intercept_se"],8)+" m. Não corrigir as medições com esse intercepto sem evidência adicional."),
 P("5 Propagação a completar","Heading1"),
 P("Quando forem conhecidas as resoluções uₓ e uᵧ: u(ȳ) = √[uₑₛₜ² + uᵧ²]; u(x²) ≈ 2|x|uₓ; u[ln(x/1 m)] ≈ uₓ/x; u[ln(ȳ/1 m)] ≈ u(ȳ)/ȳ. O tratamento poderá então ser repetido com pesos e efeitos instrumentais justificados."),
 P("Fonte: tabela confirmada pelo estudante; apostila LAB1, capítulos 2–6 e 13. Scripts, fonte e JSON com precisão integral ficam em tmp.","SmallLocal")
]
build("Resolucao_Completa.pdf",detail)
report=[
 P("UNIVERSIDADE FEDERAL DE UBERLÂNDIA","Title"),Spacer(1,125),
 P("Relatório de Física Geral Experimental I","Title"),
 P("Movimento de um projétil em duas dimensões","Heading1"),
 Spacer(1,145),P("Heitor Yochida de Ávila"),P("Uberlândia 2026"),PageBreak(),
 P("Resumo","Heading1"),
 P("Foram analisadas três posições verticais para cada distância horizontal entre 5 e 50 cm. Em 55 cm, uma leitura foi 81,7 cm e duas indicaram “No chão”. O ajuste livre da lei de potência y = Kxⁿ resultou em n = "+
   num(lf["n"],3)+" ± "+num(lf["u_n"],3)+". Admitindo y = Ax² e g = 9,79 m/s², estimou-se v₀ = "+
   num(sq["velocity"]["v0_m_s"],3)+" m/s pelo ajuste quadrático na origem. A resolução dos instrumentos não foi informada; incertezas formais e estatísticas não incluem efeitos instrumentais."),
 P("Palavras-chave: lançamento horizontal; trajetória; linearização; regressão."),
 P("1 Introdução","Heading1"),
 P("No modelo de lançamento horizontal, x = v₀t e y = gt²/2. Eliminar t leva a y = [g/(2v₀²)]x². A comparação com uma lei de potência y = Kxⁿ verifica se o expoente n se aproxima do valor teórico 2. O capítulo 13 da apostila solicita gráficos da trajetória, linearização logarítmica e ajuste de y por x²."),
 P("Objetivo: analisar as medidas confirmadas e estimar v₀ sob hipóteses explícitas, preservando integralmente as leituras."),
 P("2 Método e fonte dos dados","Heading1"),
 P("A apostila descreve esfera liberada de uma rampa e anteparo com marcações verticais em várias distâncias horizontais. A tabela foi confirmada pelo estudante em 17/10/2026. Não foram fornecidas a altura da saída, a resolução dos instrumentos nem fotografias da montagem; não se atribuem procedimentos ou calibrações adicionais."),
 T(["x (cm)","y₁ (cm)","y₂ (cm)","y₃ (cm)"],data,[70,125,125,165]),
 P("Em 55 cm, duas ocorrências “No chão” são observações sem valor numérico. Só os dez conjuntos completos de 5 a 50 cm entraram nos ajustes. A leitura isolada de 81,7 cm permanece na fonte e na figura da trajetória."),
 P("3 Tratamento estatístico","Heading1"),
 P("Calculou-se ȳ = Σyᵢ/3, s = √[Σ(yᵢ−ȳ)²/2] e uₑₛₜ(ȳ) = s/√3. Os ajustes são mínimos quadrados ordinários porque não há incerteza instrumental completa de x e y. Os erros padrão dos parâmetros derivam dos resíduos e não representam cobertura total."),
 T(["x (cm)","ȳ (cm)","s (cm)","uₑₛₜ (cm)"],
   [[r["x_cm"],num(r["mean_cm"],3),"—" if r["s_cm"] is None else num(r["s_cm"],3),
     "—" if r["u_stat_cm"] is None else num(r["u_stat_cm"],3)] for r in rr],
   [65,125,145,150]),
 P("4 Resultados e discussão","Heading1"),
 RLImage(str(ROOT/"tmp/graficos/01_Trajetoria.png"),width=480,height=314),
 P("Figura 1. Trajetória medida; 55 cm aparece como leitura isolada, fora da regressão.","SmallLocal"),
 P("O conjunto é crescente, mas o desvio do modelo ideal e a dispersão de algumas tríades exigem análise dos resíduos."),
 RLImage(str(ROOT/"tmp/graficos/03_Linearizacao_Logaritmica.png"),width=480,height=314),
 P("Figura 2. Ajuste de ln(y/1 m) por ln(x/1 m).","SmallLocal"),
 P("O expoente livre foi n = "+num(lf["n"],3)+" ± "+num(lf["u_n"],3)+
   "; intercepto b = "+num(lf["intercept"],3)+" ± "+num(lf["intercept_se"],3)+
   "; R² = "+num(lf["r2"],4)+". Como n difere de 2, o coeficiente livre não permite inferir velocidade inicial constante sem impor outra hipótese."),
 RLImage(str(ROOT/"tmp/graficos/02_Linearizacao_Quadratica.png"),width=480,height=314),
 P("Figura 3. Linearização y por x² pela origem e com intercepto livre.","SmallLocal"),
 T(["Método","Parâmetro","v₀ (m/s)"],[
   ["Logarítmico n livre","n = "+num(lf["n"],3)+" ± "+num(lf["u_n"],3),"não aplicável"],
   ["Logarítmico n = 2","A = "+num(lo["velocity"]["A_per_m"],3)+" m⁻¹",
      num(lo["velocity"]["v0_m_s"],3)+" ± "+num(lo["velocity"]["u_v0_fit_m_s"],3)],
   ["Quadrático pela origem","A = "+num(sq["slope"],3)+" ± "+num(sq["slope_se"],3)+" m⁻¹",
      num(sq["velocity"]["v0_m_s"],3)+" ± "+num(sq["velocity"]["u_v0_fit_m_s"],3)]],
   [175,165,145]),
 P("No método direto, A = Σ(x²y)/Σ(x⁴) = "+num(sq["slope"],6)+
   " m⁻¹ e v₀ = √[g/(2A)] = "+num(sq["velocity"]["v0_m_s"],3)+
   " m/s, usando g = 9,79 m/s². A outra estimativa com n = 2 é "+
   num(lo["velocity"]["v0_m_s"],3)+" m/s. Como partem das mesmas leituras, não são verificações independentes; a diferença entre elas mostra a sensibilidade à forma do ajuste."),
 P("Um ajuste adicional y = Ax² + B fornece B = "+num(diag["intercept"],4)+
   " m, útil como diagnóstico. Ele não comprova uma correção de origem, que não foi aplicada. A resolução instrumental, o alinhamento, as condições de liberação e efeitos de colisão permanecem pontos a investigar. As barras de erro representam somente s/√3."),
 P("5 Conclusão","Heading1"),
 P("As medidas permitem construir a trajetória e as duas linearizações do roteiro. O expoente livre de "+
   num(lf["n"],2)+" excede o valor ideal 2; sob a hipótese quadrática, a velocidade inicial estimada pelo ajuste direto é cerca de "+
   num(sq["velocity"]["v0_m_s"],2)+" m/s. As conclusões dependem do modelo e não substituem uma análise completa de incertezas instrumentais. Os dados originais, inclusive as observações em 55 cm, foram preservados."),
 P("Referências","Heading1"),
 P("IWAMOTO, W. A.; GUARANY, C. A.; FOSCHINI, M.; DI LORENZO, A. Guias e roteiros para Laboratório de Física Experimental I. Uberlândia: Instituto de Física, UFU, 2014. Capítulos 2–6 e 13."),
 P("REGISTRO EXPERIMENTAL. Tabela confirmada por Heitor Yochida de Ávila em 17 out. 2026.")
]
build("Relatorio_Final.pdf",report)
print("Documentos gerados")

