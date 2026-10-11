# Física Geral Experimental I — Trabalho 03

**Queda livre**, capítulo 12 da apostila. Experimento de **06/10/2026**. Participantes confirmados: Heitor Yochida de Ávila (12612ETE002), Sofia Skolimoski (12621ETE001) e Tiago de Almeida Raile (12621EAU003).

## Estado do trabalho

Medidas conferidas pelo usuário, contas, gráficos e relatório final concluídos. O relatório segue a estrutura dos trabalhos 01 e 02, com 17 páginas, cinco tabelas e cinco gráficos.

## Arquivos

- [Relatório final (PDF)](Relatorio_Final.pdf): versão de leitura e entrega.
- [Relatório final (Word)](Relatorio_Final.docx): versão editável.
- [Resolução completa](Resolucao_Completa.pdf): fórmulas, substituições, tabelas, somatórios, ajustes e interpretação das incertezas.
- [Resultados dos cálculos](Resultados_Finais.pdf): resumo numérico e limitações.
- [Medidas originais](Tabela_Medidas_Originais.xlsx): apresentação da tabela conferida.
- [Planilha calculada](Tabela_Medidas_Calculadas.xlsx): fórmulas editáveis, com Resultados, Tratamento, Logaritmos e Quadrados.
- [Fonte editável](refs/medidas_fisicaEX03.xlsx): ler sempre a versão salva antes de nova análise.
- Cinco PDFs de gráficos na raiz; PNG e SVG em [tmp/graficos](tmp/graficos/).
- [Apostila](../apoio/referencias_gerais/Apostila_LAB1.pdf): pp. 54–58 do capítulo 12.

O relatório contém capa, folha de rosto, resumo, listas e sumário, fundamentação, metodologia, resultados e discussão, conclusão e referências. A montagem é descrita conforme o roteiro; as fotografias fornecidas registram apenas as anotações de medidas, não o aparelho.

## Medidas e incertezas

17 alturas de 10 a 90 cm, em passos de 5 cm; três tempos por altura. Transcrição confirmada em 09/10/2026. Tempos em segundos, com quatro casas decimais. Altura **sem incerteza considerada**, conforme instrução expressa do usuário. Contribuição instrumental do tempo: **0,0001 s**. Não importar a incerteza de altura do EX02.

Média, desvio padrão amostral, s/√3 e combinação em quadratura com 0,0001 s seguem o método dos trabalhos anteriores. Não se divide novamente a contribuição instrumental por √3. Dados não arredondados durante as contas; nenhuma altura ou tempo foi corrigido ou excluído.

## Ajustes e resultados

A altura é convertida de cm para m. Como só o tempo tem incerteza considerada, a regressão ponderada usa a orientação inversa: ln(t/1 s) por ln(d/1 m), ou t² por d. Não usar pesos 1/u[ln(d)]², que seriam indefinidos.

- Expoente livre: n = 2,108 ± 0,002; C = (5,31 ± 0,01) m em d = C(t/1 s)^n. A incerteza de C inclui a covariância entre inclinação e intercepto.
- Impondo n = 2 no ajuste logarítmico: g = (9,468 ± 0,003) m/s²; χ² reduzido = 347,177.
- Modelo t² = a₀d pela origem: g = (9,475 ± 0,003) m/s²; χ² reduzido = 320,831.
- Diagnóstico com t² = ad+b: g = (9,878 ± 0,007) m/s²; b = (0,00448 ± 0,00006) s²; χ² reduzido = 3,079.

São **incertezas formais, sem reescala**, não uma demonstração de precisão física. Os resíduos excedem as incertezas. Não interpretar 2C como g no modelo de expoente livre. O intercepto é diagnóstico e não autoriza modificar as alturas. As duas estimativas restritas usam as mesmas medidas, portanto não são independentes.

O roteiro pede gráficos d por t e d por t²; ambos são fornecidos, além dos gráficos inversos usados no ajuste numérico. O ajuste substitui a determinação manual por papel milimetrado; não afirmar que os coeficientes foram medidos manualmente.

## Calculadoras e verificação

A [Calculadora de Física](../apoio/calculadora-fisica/) inclui Queda livre — EX03. A [Calculadora de gráficos](../apoio/programa-graficos/) inclui cinco exemplos EX03; as figuras foram exportadas por ela em 3600 × 2400 pixels e SVG. As tabelas X, vX, Y, vY ficam em tmp.

Conferência independente por NumPy a partir da fonte salva: [registro](tmp/verificacao_independente.json). A planilha de fórmulas, o módulo JavaScript e a verificação independente concordam. Os scripts de reprodução ficam em tmp; as fotografias das anotações, em refs/Fotos. Não há fotografias da montagem fornecidas até esta etapa.
