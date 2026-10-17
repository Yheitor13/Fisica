# F�sica Geral Experimental I - Trabalho 04

**Movimento de um proj�til em duas dimens�es**, cap�tulo 13 da apostila LAB1. Registro das medidas recebido e confirmado por Heitor em 17/10/2026. A data exata da pr�tica e as resolu��es dos instrumentos n�o foram informadas.

## Arquivos

- [Relat�rio de leitura](Relatorio_Final.pdf) e [vers�o edit�vel](Relatorio_Final.docx).
- [Resolu��o completa](Resolucao_Completa.pdf) e [resumo dos resultados](Resultados_Finais.pdf).
- [Medidas originais](Tabela_Medidas_Originais.xlsx) e [planilha calculada](Tabela_Medidas_Calculadas.xlsx).
- [Transcri��o conferida](refs/medidas_confirmadas.csv): 11 dist�ncias, 31 leituras num�ricas e duas anota��es "No ch�o".
- [Trajet�ria](01_Trajetoria.pdf), [lineariza��o quadr�tica](02_Linearizacao_Quadratica.pdf) e [lineariza��o logar�tmica](03_Linearizacao_Logaritmica.pdf).
- [Tratamento e resultados com precis�o integral](tmp/calculos_verificados.json); [tabela de tratamento](tmp/tratamento.csv).
- Fonte te�rica: [apostila LAB1](../apoio/referencias_gerais/Apostila_LAB1.pdf), cap�tulo 13, p�ginas impressas 59-63.

## Tratamento

As medidas x e y est�o em cent�metros, conforme confirma��o do estudante. Para x = 5, 10, ..., 50 cm h� tr�s leituras de y. Para 55 cm, y1 = 81,7 cm e y2/y3 = "No ch�o". Esta �ltima linha permanece na fonte e no gr�fico da trajet�ria, mas n�o entra nos ajustes por n�o ter tr�s leituras num�ricas.

Calculam-se m�dia, desvio padr�o amostral e s/V3 para cada tr�ade. Como a resolu��o dos instrumentos n�o foi fornecida, s/V3 � **somente a contribui��o estat�stica**; n�o se inventou uma incerteza instrumental para x ou y. Os ajustes s�o m�nimos quadrados ordin�rios, e seus erros padr�o derivam dos res�duos. Nenhum dado num�rico foi corrigido ou descartado para se aproximar da teoria.

O modelo logar�tmico livre fornece n = 2,433 � 0,050 em ln(y/1 m) = n ln(x/1 m) + b. O modelo ideal exige n = 2. Para obter v0, � preciso impor essa hip�tese: com g = 9,79 m/s�, a an�lise de y = Ax� pela origem d� v0 = (1,411 � 0,014) m/s; com expoente 2 imposto no ajuste logar�tmico, (1,583 � 0,084) m/s. S�o estimativas **condicionais**, feitas com os mesmos dados e crit�rios diferentes, n�o verifica��es independentes. As incertezas s�o formais e n�o incluem efeitos instrumentais ou sistem�ticos.

O diagn�stico adicional com intercepto livre d� B = (-0,0194 � 0,0079) m em y = Ax� + B. Ele n�o autoriza corrigir as posi��es registradas. A diverg�ncia do expoente e a estrutura dos res�duos s�o discutidas no relat�rio.

## Pend�ncias para fechamento experimental

Registrar a resolu��o ou incerteza da trena/r�gua em x e y, a altura da sa�da e, se dispon�vel, a folha de marca��es do papel branco solicitada pelo roteiro. Tamb�m confirmar a data da pr�tica e os demais integrantes antes de completar a folha de rosto. At� l�, o relat�rio apresenta explicitamente essas limita��es.
