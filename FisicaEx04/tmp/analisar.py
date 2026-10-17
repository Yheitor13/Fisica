from pathlib import Path
import csv, json, math
import numpy as np
from reportlab.pdfgen import canvas
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "FisicaEx04"
TMP = OUT / "tmp"
PLOTS = TMP / "graficos"
for d in (OUT, TMP, PLOTS, OUT / "refs"):
    d.mkdir(parents=True, exist_ok=True)

# Dados conferidos por Heitor em 17/10/2026, unidades cm.
RAW = [
    (5, .15, .2, .3),
    (10, 1.4, 1.5, 1.7),
    (15, 3.1, 3.85, 4.0),
    (20, 8.7, 9.05, 9.4),
    (25, 13.05, 13.2, 13.8),
    (30, 18.8, 20.1, 20.7),
    (35, 28.6, 29.15, 29.95),
    (40, 32.7, 36.7, 40.15),
    (45, 48.6, 49.35, 53.0),
    (50, 63.35, 64.4, 67.35),
    (55, 81.7, None, None),
]
DISPLAY = [
    ("5","0,15","0,2","0,3"),
    ("10","1,4","1,5","1,7"),
    ("15","3,1","3,85","4,0"),
    ("20","8,7","9,05","9,4"),
    ("25","13,05","13,2","13,8"),
    ("30","18,8","20,1","20,7"),
    ("35","28,6","29,15","29,95"),
    ("40","32,7","36,7","40,15"),
    ("45","48,6","49,35","53,0"),
    ("50","63,35","64,4","67,35"),
    ("55","81,7","No ch�o","No ch�o"),
]
with (OUT / "refs" / "medidas_confirmadas.csv").open("w", encoding="utf-8-sig", newline="") as f:
    w = csv.writer(f, delimiter=";")
    w.writerow(["x_cm", "y1_cm", "y2_cm", "y3_cm"])
    w.writerows(DISPLAY)

rows = []
for x, *ys in RAW:
    valid = [y for y in ys if y is not None]
    mean = float(np.mean(valid))
    sd = float(np.std(valid, ddof=1)) if len(valid) > 1 else None
    sem = sd / math.sqrt(len(valid)) if sd is not None else None
    rows.append(dict(x_cm=x, measurements_cm=ys, n=len(valid), mean_cm=mean,
                     s_cm=sd, u_stat_cm=sem, x_m=x/100, mean_m=mean/100,
                     ln_x=math.log(x/100), ln_y=math.log(mean/100),
                     x2_m2=(x/100)**2))

# Apenas linhas com pelo menos 3 lan�amentos completos entram nos ajustes.
fitrows = rows[:10]
X = np.array([r["x_m"] for r in fitrows])
Y = np.array([r["mean_m"] for r in fitrows])
Z = X**2
Lx, Ly = np.log(X), np.log(Y)
def fit_with_intercept(x,y):
    A = np.column_stack([x, np.ones_like(x)])
    beta = np.linalg.lstsq(A,y,rcond=None)[0]
    residual = y-A@beta
    rss = float(residual@residual)
    cov = rss/(len(x)-2)*np.linalg.inv(A.T@A)
    return dict(slope=float(beta[0]), intercept=float(beta[1]),
                slope_se=float(math.sqrt(cov[0,0])), intercept_se=float(math.sqrt(cov[1,1])),
                cov=float(cov[0,1]), rss=rss,
                r2=float(1-rss/np.sum((y-np.mean(y))**2)),
                residuals=residual.tolist())
def fit_origin(x,y):
    b = float(x@y/(x@x))
    res = y-b*x
    rss = float(res@res)
    se = math.sqrt(rss/(len(x)-1)/(x@x))
    return dict(slope=b,slope_se=se,rss=rss,residuals=res.tolist())

logfree=fit_with_intercept(Lx,Ly)
direct=fit_origin(Z,Y)
diagnostic=fit_with_intercept(Z,Y)
b_fixed=float(np.mean(Ly-2*Lx))
res_fixed=Ly-(2*Lx+b_fixed)
se_b=math.sqrt(float(res_fixed@res_fixed)/(len(X)-1)/len(X))
g=9.79
def velocity(A,uA):
    v=math.sqrt(g/(2*A))
    return dict(A_per_m=A,u_A_per_m=uA,v0_m_s=v,u_v0_fit_m_s=v*uA/(2*A))
res={
    "source":"Tabela confirmada pelo usu�rio em 17/10/2026; x e y em cm.",
    "g_assumed_m_s2":g,
    "instrumental_uncertainty":"N�o informada; u_stat � apenas a incerteza estat�stica da m�dia.",
    "rows":rows,
    "model_log_free":{**logfree,"n":logfree["slope"],"u_n":logfree["slope_se"]},
    "model_log_n2":{"intercept":b_fixed,"intercept_se":se_b,"rss":float(res_fixed@res_fixed),
                    "velocity":velocity(math.exp(b_fixed),math.exp(b_fixed)*se_b)},
    "model_square_origin":{**direct,"velocity":velocity(direct["slope"],direct["slope_se"])},
    "model_square_intercept":{**diagnostic,"velocity_slope_only":velocity(diagnostic["slope"],diagnostic["slope_se"])},
    "excluded_from_fits":"x=55 cm: s� y1=81,7 cm; y2 e y3 anotados como No ch�o.",
}
(TMP / "calculos_verificados.json").write_text(json.dumps(res,ensure_ascii=False,indent=2,allow_nan=False),encoding="utf-8")
with (TMP / "tratamento.csv").open("w",encoding="utf-8-sig",newline="") as f:
    w=csv.writer(f,delimiter=";")
    w.writerow(["x_cm","n","media_y_cm","desvio_amostral_cm","incerteza_estatistica_media_cm","x_m","media_y_m","x2_m2","ln_x_m","ln_y_m"])
    for r in rows:
        w.writerow([r[k] for k in ("x_cm","n","mean_cm","s_cm","u_stat_cm","x_m","mean_m","x2_m2","ln_x","ln_y")])

def graph(name,title,xlabel,ylabel,points,curves,xlim,ylim,excluded=None):
    W,H=1300,850
    im=Image.new("RGB",(W,H),"white")
    d=ImageDraw.Draw(im)
    font=ImageFont.truetype(r"C:\Windows\Fonts\arial.ttf",23)
    small=ImageFont.truetype(r"C:\Windows\Fonts\arial.ttf",18)
    left,top,right,bottom=125,95,1210,735
    def xy(x,y):
        return left+(x-xlim[0])/(xlim[1]-xlim[0])*(right-left),bottom-(y-ylim[0])/(ylim[1]-ylim[0])*(bottom-top)
    d.text((left,30),title,font=font,fill="#172c45")
    for i in range(6):
        x=xlim[0]+i*(xlim[1]-xlim[0])/5
        y=ylim[0]+i*(ylim[1]-ylim[0])/5
        px,_=xy(x,ylim[0]);_,py=xy(xlim[0],y)
        d.line((px,top,px,bottom),fill="#e0e6ed",width=1)
        d.line((left,py,right,py),fill="#e0e6ed",width=1)
        d.text((px-25,bottom+9),f"{x:.2f}",font=small,fill="#293c50")
        d.text((35,py-12),f"{y:.2f}",font=small,fill="#293c50")
    d.line((left,top,left,bottom,right,bottom),fill="#293c50",width=3)
    d.text(((left+right)//2-90,H-58),xlabel,font=font,fill="#172c45")
    d.text((25,top-40),ylabel,font=small,fill="#172c45")
    for color,label,func in curves:
        seq=[xy(x,func(x)) for x in np.linspace(*xlim,450)]
        d.line(seq,fill=color,width=4)
    for x,y,u in points:
        px,py=xy(x,y)
        if u is not None:
            _,lo=xy(x,y-u);_,hi=xy(x,y+u)
            d.line((px,lo,px,hi),fill="#17375e",width=2)
            d.line((px-7,lo,px+7,lo),fill="#17375e",width=2)
            d.line((px-7,hi,px+7,hi),fill="#17375e",width=2)
        d.ellipse((px-6,py-6,px+6,py+6),fill="#17375e")
    if excluded:
        px,py=xy(*excluded)
        d.line((px-8,py-8,px+8,py+8),fill="#ad6127",width=4)
        d.line((px+8,py-8,px-8,py+8),fill="#ad6127",width=4)
    for i,(color,label,_) in enumerate(curves):
        d.line((left+20+i*320,top+35,left+65+i*320,top+35),fill=color,width=4)
        d.text((left+72+i*320,top+23),label,font=small,fill="#293c50")
    im.save(PLOTS/(name+".png"))
    c=canvas.Canvas(str(OUT/(name+".pdf")),pagesize=(720,470))
    c.drawImage(str(PLOTS/(name+".png")),0,0,width=720,height=470)
    c.save()

points=[(r["x_m"],r["mean_m"],r["u_stat_cm"]/100) for r in fitrows]
graph("01_Trajetoria","Trajet�ria medida","x (m)","y (m)",points,
      [("#2f7d69","modelo quadr�tico",lambda x:direct["slope"]*x*x)],(0,.58),(0,.90),(.55,.817))
graph("02_Linearizacao_Quadratica","Lineariza��o quadr�tica","x� (m�)","y (m)",
      [(x*x,y,u) for x,y,u in points],
      [("#2f7d69","pela origem",lambda z:direct["slope"]*z),
       ("#ad6127","intercepto livre",lambda z:diagnostic["slope"]*z+diagnostic["intercept"])],
      (0,.27),(0,.78))
graph("03_Linearizacao_Logaritmica","Lineariza��o logar�tmica","ln(x / 1 m)","ln(y / 1 m)",
      [(math.log(x),math.log(y),None) for x,y,u in points],
      [("#2f7d69","expoente livre",lambda x:logfree["slope"]*x+logfree["intercept"]),
       ("#ad6127","expoente 2",lambda x:2*x+b_fixed)],
      (-3.2,-.55),(-6.8,0))
print(json.dumps({k:res[k] for k in ("model_log_free","model_log_n2","model_square_origin","model_square_intercept")},ensure_ascii=False))

