# Física — trabalhos experimentais

| Projeto | Conteúdo |
| --- | --- |
| [Trabalho 01](FisicaEx01/) | Medidas, volumes e propagação de incertezas |
| [Trabalho 02](FisicaEx02/) | Linearização |

**Programa de gráficos:** [Abrir a Calculadora de gráficos](https://yheitor13.github.io/Fisica/calculadora-de-grafico/)

**Tabela experimental e cálculos:** [Abrir a Calculadora de Física Experimental](https://yheitor13.github.io/Fisica/calculadora-fisica/) — fórmulas, estatística, propagação de incertezas, linearização e exportação CSV/XLSX.

**Site dos trabalhos:** [Abrir e compartilhar o índice de Física](https://yheitor13.github.io/Fisica/)

Acesse cada trabalho para consultar relatórios, cálculos, planilhas, gráficos e materiais do experimento.

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

Os três gráficos do EX02 foram produzidos na [Calculadora de gráficos](apoio/programa-graficos/), desenvolvida para esse trabalho e citada na metodologia e nas referências. O aplicativo permite inserir X, vX, Y e vY, exibir barras de incerteza, ajustar uma reta ou desenhar uma curva com parâmetros informados e exportar figuras. O [portal](apoio/portal/) oferece acesso geral aos dois trabalhos e aos materiais.

Os nomes e caminhos internos de EX01 e EX02 foram preservados. A página inicial do GitHub Pages passou a ser o portal; a Calculadora de gráficos fica em `/calculadora-de-grafico/`. Atualizações enviadas para `main` publicam automaticamente a versão revisada dos documentos e das páginas.
