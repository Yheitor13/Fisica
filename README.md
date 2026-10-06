# Física Experimental — UFU

**[Abrir o portal dos trabalhos](https://yheitor13.github.io/Fisica/)** · [GráficoLab](https://yheitor13.github.io/Fisica/graficolab/)

Relatórios e materiais de Física Geral Experimental I, turma LabFis1_Eng_2026-2. O portal reúne os documentos finais e os principais materiais de EX01 e EX02, sem exigir navegação pelas pastas do GitHub.

| Trabalho | Conteúdo | Acesso |
| --- | --- | --- |
| [EX01](FisicaEx01/) | Medidas dimensionais, volumes e propagação de incertezas; prática de 15/09/2026 | [Relatório PDF](FisicaEx01/Relatório_Final.pdf) · [Word](FisicaEx01/Relatório_Final.docx) |
| [EX02](FisicaEx02/) | Distância e tempo, linearização e ajuste ponderado; prática de 29/09/2026 | [Relatório PDF](FisicaEx02/Relatorio_Final.pdf) · [Word](FisicaEx02/Relatorio_Final.docx) |

## Organização

```text
UFU/
└── Física Experimental/
    ├── apoio/
    │   ├── referencias_gerais/
    │   ├── programa-graficos/
    │   └── portal/
    ├── FisicaEx01/
    └── FisicaEx02/
```

Cada exercício mantém os documentos finais na raiz, fontes em `refs/` e registros de desenvolvimento em `tmp/`. A pasta [apoio](apoio/) reúne os materiais compartilhados e o código das páginas. Os arquivos de apoio são conservados para consulta e reprodução; para ler ou entregar um trabalho, comece pelo relatório final. Os arquivos técnicos do Git e da publicação permanecem na raiz do repositório.

## Continuidade entre os trabalhos

O EX02 cita o EX01 como base do tratamento anterior à linearização: média, desvio padrão amostral, incerteza da média e combinação em quadratura. A aplicação utiliza os tempos e as incertezas próprias do segundo experimento. Não reutiliza medidas dimensionais, modelos de volume ou incertezas do paquímetro.

Os três gráficos do EX02 foram produzidos no [GráficoLab](apoio/programa-graficos/), desenvolvido para esse trabalho e citado na metodologia e nas referências. O aplicativo permite inserir X, vX, Y e vY, exibir barras de incerteza, ajustar uma reta ou desenhar uma curva com parâmetros informados e exportar figuras. O [portal](apoio/portal/) oferece acesso geral aos dois trabalhos e aos materiais.

Os nomes e caminhos internos de EX01 e EX02 foram preservados. A página inicial do GitHub Pages passou a ser o portal; o GráficoLab fica em `/graficolab/`. Atualizações enviadas para `main` publicam automaticamente a versão revisada dos documentos e das páginas.
