# Física Geral Experimental I — Relatório T0

Relatório acadêmico da Universidade Federal de Uberlândia sobre **medidas dimensionais, determinação de volumes e propagação de incertezas**. Este repositório reúne o trabalho final, os materiais de referência e os arquivos produzidos durante a elaboração. Todos os arquivos originais foram preservados.

**[Abrir o relatório final (PDF)](Relatório_Final.pdf)** · [Versão editável (DOCX)](Relatório_Final.docx) · [Roteiro da atividade](refs/Trabalho_FG1.pdf)

## Visão geral

Foram estudadas quatro peças: uma bateria cilíndrica, uma arruela e duas peças com ressalto e furo, sendo uma delas também com corte plano. O trabalho apresenta as medições, o tratamento estatístico, a modelagem geométrica dos volumes e a propagação das incertezas. Consulte o PDF final para os dados, resultados, hipóteses e conclusões completos.

## Arquivos principais

| Arquivo | Para que serve |
| --- | --- |
| [`Relatório_Final.pdf`](Relatório_Final.pdf) | Leitura e entrega do relatório completo. |
| [`Relatório_Final.docx`](Relatório_Final.docx) | Edição do relatório. |
| [`Tabelas_Relatório.pdf`](Tabelas_Relatório.pdf) | Consulta às tabelas. |
| [`Equações_do_Relatório.pdf`](Equações_do_Relatório.pdf) e [`Fórmulas_Relatório.pdf`](Fórmulas_Relatório.pdf) | Consulta à notação e às fórmulas. |
| [`Resolucao.pdf.pdf`](Resolucao.pdf.pdf) e [`Resultados_finais.pdf.pdf`](Resultados_finais.pdf.pdf) | Resolução e resultados em arquivos auxiliares. |

Os dois últimos arquivos têm `.pdf.pdf` no nome original; a extensão foi mantida para preservar os arquivos sem alterações.

## Como o projeto está organizado

- [`refs/`](refs) — roteiro, apostila, aulas de apoio, fotografias das medições, modelo DOCX e [instruções de trabalho](refs/INSTRUCOES_TRABALHO_FISICA.md).
- [`tmp/relatoriot0/`](tmp/relatoriot0) — scripts para cálculos e geração de documentos, HTMLs e imagens usadas na conferência.
- [`tmp/template/`](tmp/template) — adaptação do modelo de relatório, manifesto e registros da revisão visual.
- [`tmp/README.md`](tmp/README.md) — guia dos arquivos de desenvolvimento e de revisão.

A pasta `tmp/` contém o processo de construção. Ela foi preservada integralmente para permitir a consulta às etapas intermediárias; **o ponto de partida para ler o trabalho é `Relatório_Final.pdf`**.

## Método em resumo

Para cada dimensão medida três vezes, o desenvolvimento calcula a média, o desvio padrão e a incerteza estatística da média. A contribuição instrumental é combinada à estatística e, em seguida, as incertezas das dimensões são propagadas para os volumes segundo os modelos geométricos adotados no relatório. O roteiro em `refs/Trabalho_FG1.pdf` e o relatório final são as referências para interpretar cada medida e hipótese.

## Sobre os scripts

Os scripts em `tmp/` registram etapas diferentes da produção; não há um único comando validado para reconstruir o pacote inteiro. Alguns caminhos são específicos do Windows, inclusive fontes em `C:/Windows/Fonts/`, e há dependências como `reportlab` e ferramentas de renderização. Para consultar ou entregar o relatório, não é necessário executá-los.

> **Escopo:** este repositório documenta um trabalho acadêmico. Os PDFs auxiliares, scripts e imagens de conferência complementam o relatório final; não devem ser tratados como uma versão mais recente dele.

## Referências compartilhadas

Consulte [referencias_gerais](../referencias_gerais/) para os materiais comuns aos próximos trabalhos. O acervo deste projeto foi preservado como registro histórico.
