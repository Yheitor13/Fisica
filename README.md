# Física Geral Experimental I — Relatório T0

Trabalho acadêmico de medidas dimensionais e determinação de volumes com propagação de incertezas, desenvolvido na Universidade Federal de Uberlândia. Este repositório reúne a versão de entrega, os materiais consultados e o histórico de construção do relatório.

## Comece por aqui

- [Relatório final em PDF](Relatório_Final.pdf) — versão para leitura e entrega.
- [Relatório final em DOCX](Relatório_Final.docx) — versão editável.
- [Roteiro do trabalho](refs/Trabalho_FG1.pdf) — enunciado e orientações da atividade.
- [Fotos das medições](refs/Fotos) — registros dos objetos e da medição.

## Organização

| Local | Conteúdo |
| --- | --- |
| Raiz | Relatório final e PDFs complementares com equações, fórmulas, resolução, resultados e tabelas. |
| [`refs/`](refs) | Roteiro, apostila, aulas, fotografias, instruções de apoio e modelo de formatação. |
| [`tmp/relatoriot0/`](tmp/relatoriot0) | Scripts Python, arquivos HTML e imagens de revisão usados no desenvolvimento dos cálculos e dos PDFs. |
| [`tmp/template/`](tmp/template) | Scripts e registros da adaptação do modelo DOCX, além de imagens de conferência de páginas. |

Os arquivos em `tmp/` documentam etapas de produção e revisão. **Para consultar ou enviar o trabalho, use `Relatório_Final.pdf`**. Os PDFs auxiliares da raiz não substituem o relatório completo. Alguns têm a extensão literal `.pdf.pdf`, mantida para preservar os arquivos originais.

## Conteúdo do experimento

O trabalho examina uma bateria cilíndrica, uma arruela e duas peças com ressalto e furo, uma delas também com corte plano. A partir de três medidas por dimensão, o desenvolvimento calcula médias, desvios padrão, incertezas estatísticas e instrumentais e a propagação das incertezas para os volumes. As hipóteses geométricas e os resultados completos devem ser conferidos no relatório final e no roteiro.

## Reprodução e observações

Os scripts em `tmp/` são o registro do processo de elaboração, não uma rotina única de geração. Alguns referenciam fontes em `C:/Windows/Fonts/` e dependem de pacotes como `reportlab`, além de ferramentas para renderização de documentos e páginas. Verifique caminhos e dependências antes de executá-los em outro computador. A versão final pode ser aberta diretamente sem executar código.

O repositório [`Trabalho-Fisica-Experimental01`](https://github.com/Yheitor13/Trabalho-Fisica-Experimental01) contém uma cópia dos mesmos arquivos de entrega e referência; este é o repositório mais completo para continuar o trabalho.
