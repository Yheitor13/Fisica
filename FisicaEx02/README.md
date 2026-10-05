# Física Geral Experimental I — Trabalho 02

Relatório sobre **linearização da relação entre distância e tempo**, em experimento com sistema de redução de atrito por ar e sensores, realizado em **29 de setembro de 2026**.

**[Abrir o relatório final (PDF)](Relatorio_Final.pdf)** · [Versão editável (DOCX)](Relatorio_Final.docx) · [Medidas originais](refs/medidas_fisicaEX02.xlsx)

O relatório tem 19 páginas, quatro tabelas, três gráficos e quatro fotografias organizadas em duas figuras. Participantes: Heitor Yochida de Ávila (12612ETE002), Sofia Skolimoski (12621ETE001) e Tiago de Almeida Raile (12621EAU003).

## Arquivos principais

| Arquivo | Para que serve |
| --- | --- |
| [Relatorio_Final.pdf](Relatorio_Final.pdf) | Leitura e entrega do relatório completo, revisado com as fotografias e os três participantes. |
| [Relatorio_Final.docx](Relatorio_Final.docx) | Edição do relatório. |
| [Resolucao_Completa.pdf](Resolucao_Completa.pdf) | Desenvolvimento dos cálculos, médias, incertezas e regressão. |
| [Resultados_Finais.pdf](Resultados_Finais.pdf) | Consulta aos resultados numéricos. |
| [Tabela_Medidas_Originais.xlsx](Tabela_Medidas_Originais.xlsx) | Apresentação das medidas originais. |
| [Tabela_Medidas_Calculadas.xlsx](Tabela_Medidas_Calculadas.xlsx) | Apresentação das médias e incertezas. |
| [01_Dados_Antes_da_Linearizacao.pdf](01_Dados_Antes_da_Linearizacao.pdf) | Gráfico dos dados em escala original. |
| [02_Linearizacao_e_Reta_Ajustada.pdf](02_Linearizacao_e_Reta_Ajustada.pdf) | Gráfico linearizado e reta ajustada. |
| [03_Curva_Ajustada_Escala_Original.pdf](03_Curva_Ajustada_Escala_Original.pdf) | Curva reconstruída na escala original. |

## Organização

- [refs/](refs/) — material da aula, planilha original editável, foto das medições e [fotografias do experimento](refs/Fotos/).
- [tmp/](tmp/) — cálculos em precisão completa, imagens dos gráficos e versões anteriores de apoio.
- [Referências gerais](../referencias_gerais/) — apostila, aulas comuns e orientações da disciplina.

A estrutura segue o padrão do trabalho 01: arquivos finais na raiz, fontes em `refs/` e materiais de desenvolvimento em `tmp/`. Os nomes dos relatórios foram mantidos para preservar seus links. Todos os arquivos preexistentes foram conservados.

## Dados e método

A fonte editável das medidas é [refs/medidas_fisicaEX02.xlsx](refs/medidas_fisicaEX02.xlsx), aba Medidas. Consultar sempre sua versão salva antes de refazer qualquer análise. Cada linha corresponde a uma distância, de 10 a 90 cm; as três colunas de tempo são repetições da mesma condição. A terceira leitura de tempo do ponto 2 é **0,2971 s**, corrigida pelo usuário; não restaurar a transcrição anterior de 0,2871 s.

Adotou-se σx = 1 cm e contribuição instrumental do tempo de 0,0001 s. A incerteza do tempo médio combina s/√3 com essa contribuição em quadratura. A anotação 10⁻³ da fotografia original continua sem interpretação confirmada e não entra no cálculo.

A transformação usa X = ln(t̄/1 s) e Y = ln(x/1 cm), com σX = σt/t̄ e σY = σx/x. A regressão segue o slide 16 do material de Sousa, com pesos 1/σY², sem incorporar o erro horizontal ao ajuste nem reescalar as incertezas pelo qui-quadrado reduzido. Obtiveram-se n = 1,05 ± 0,02 e C = (69,9 ± 0,4) cm em x = C(t/1 s)ⁿ. Não se calculou g.

## Referência de apresentação e revisão

O trabalho 01 serviu de referência de estrutura, estilo e tratamento de incertezas. Nenhuma medida ou resultado físico desse experimento foi transportado para o trabalho 02. As referências comuns pertinentes foram mantidas, e o material específico de linearização foi identificado pelo título interno: “Aula 2 – Laboratório de Física 1”, de Lucas Soares Sousa, 19 slides, sem data identificada, disponibilizado como Aula3-PropagacaoLinearizacao.pdf.

O PDF e o Word foram revisados em 05/10/2026: fotografias incorporadas, identificação dos participantes corrigida, sumário e listas atualizados, tabelas e equações preservadas e 19 páginas conferidas visualmente. Os documentos auxiliares de cálculo não substituem o relatório final.

A antiga pasta `trab02` no histórico do GitHub foi consolidada nesta `FisicaEx02`. Sua planilha anterior foi arquivada em [tmp/historico/medidas_trab02.xlsx](tmp/historico/medidas_trab02.xlsx); a fotografia original idêntica já está em `refs/`. A nota interna da planilha atual aponta para o novo local da fotografia.

## Gerar novos gráficos

Use o **[GráficoLab](https://yheitor13.github.io/Fisica/)**, também disponível em [programa-graficos/](../programa-graficos/). O botão Exemplo EX02 carrega os nove pontos já linearizados deste trabalho, com vX e vY propagados. Para reproduzir a reta do relatório, marque a regressão, escolha **pesos 1/vY²** e atualize o gráfico. O programa não faz a linearização automaticamente. Permite exportar PNG (3600 × 2400 pixels) e SVG vetorial.


## Gráficos produzidos no GráficoLab

As Figuras 3, 4 e 5 do PDF e do Word foram substituídas por exportações do **GráficoLab 1.1** em 05/10/2026. O aplicativo foi desenvolvido especificamente para a elaboração dos gráficos deste trabalho, fato registrado na metodologia e na referência bibliográfica. As fontes das três figuras identificam o programa. O relatório mantém 19 páginas, quatro tabelas, quatro fotografias e as mesmas equações e resultados.

Os PDFs individuais na raiz correspondem às novas figuras. PNGs de 3600 × 2400 pixels e SVGs vetoriais estão em [tmp/relatorio/graficos/](tmp/relatorio/graficos/); o registro dos dados exportados está em [tmp/relatorio/exportacoes_graficolab.json](tmp/relatorio/exportacoes_graficolab.json).

Para reproduzir, escolha o tipo em **Gráfico do exemplo EX02** e clique em **Exemplo EX02**. Os dados originais são apresentados como pontos com barras; na versão linearizada, ative a reta com pesos 1/vY²; a opção de curva original usa os coeficientes já calculados, sem realizar nova regressão. O programa continua sem transformar os dados automaticamente. A exportação ampliou as fontes para legibilidade no relatório.
