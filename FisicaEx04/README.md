# Física Geral Experimental I — Trabalho 04

**Movimento de um projétil em duas dimensões**, capítulo 13 da apostila LAB1. Registro das medidas recebido e confirmado por Heitor em 17/10/2026. A data exata da prática e as resoluções dos instrumentos não foram informadas.

## Arquivos

- [Relatório de leitura](Relatorio_Final.pdf) e [versão editável](Relatorio_Final.docx).
- [Resolução completa](Resolucao_Completa.pdf) e [resumo dos resultados](Resultados_Finais.pdf).
- [Medidas originais](Tabela_Medidas_Originais.xlsx) e [planilha calculada](Tabela_Medidas_Calculadas.xlsx).
- [Transcrição conferida](refs/medidas_confirmadas.csv): 11 distâncias, 31 leituras numéricas e duas anotações “No chão”.
- [Trajetória](01_Trajetoria.pdf), [linearização quadrática](02_Linearizacao_Quadratica.pdf) e [linearização logarítmica](03_Linearizacao_Logaritmica.pdf).
- [Tratamento e resultados com precisão integral](tmp/calculos_verificados.json); [tabela de tratamento](tmp/tratamento.csv).
- Fonte teórica: [apostila LAB1](../apoio/referencias_gerais/Apostila_LAB1.pdf), capítulo 13, páginas impressas 59–63.

## Tratamento

As medidas x e y estão em centímetros, conforme confirmação do estudante. Para x = 5, 10, ..., 50 cm há três leituras de y. Para 55 cm, y1 = 81,7 cm e y2/y3 = “No chão”. Esta última linha permanece na fonte e no gráfico da trajetória, mas não entra nos ajustes por não ter três leituras numéricas.

Calculam-se média, desvio padrão amostral e s/√3 para cada tríade. Como a resolução dos instrumentos não foi fornecida, s/√3 é **somente a contribuição estatística**; não se inventou uma incerteza instrumental para x ou y. Os ajustes são mínimos quadrados ordinários, e seus erros padrão derivam dos resíduos. Nenhum dado numérico foi corrigido ou descartado para se aproximar da teoria.

O modelo logarítmico livre fornece n = 2,433 ± 0,050 em ln(y/1 m) = n ln(x/1 m) + b. O modelo ideal exige n = 2. Para obter v0, é preciso impor essa hipótese: com g = 9,79 m/s², a análise de y = Ax² pela origem dá v0 = (1,411 ± 0,014) m/s; com expoente 2 imposto no ajuste logarítmico, (1,583 ± 0,084) m/s. São estimativas **condicionais**, feitas com os mesmos dados e critérios diferentes, não verificações independentes. As incertezas são formais e não incluem efeitos instrumentais ou sistemáticos.

O diagnóstico adicional com intercepto livre dá B = (−0,0194 ± 0,0079) m em y = Ax² + B. Ele não autoriza corrigir as posições registradas. A divergência do expoente e a estrutura dos resíduos são discutidas no relatório.

## Pendências para fechamento experimental

Registrar a resolução ou incerteza da trena/régua em x e y, a altura da saída e, se disponível, a folha de marcações do papel branco solicitada pelo roteiro. Também confirmar a data da prática e os demais integrantes antes de completar a folha de rosto. Até lá, o relatório apresenta explicitamente essas limitações.
