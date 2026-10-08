# Tabelas e cálculos de Física Experimental I

Aplicativo para transformar medidas em tabelas de resultados, seguindo o tratamento usado nos relatórios 01 e 02 e nos capítulos 2–5 da apostila. Funciona no navegador, sem conta, instalação ou envio das medidas a um servidor.

## Como usar

1. Preencha a tabela: um nome na primeira coluna e as leituras repetidas nas seguintes. Para testar, clique em **Usar exemplo do trabalho 1**.
2. Marque os resultados: **média**, **DP**, **incerteza da média** ou **incerteza total**. As três primeiras opções já vêm selecionadas. A incerteza instrumental só é solicitada quando necessária.
3. Clique em **Calcular** e depois em **Copiar tabela** ou **Baixar Excel**.

A unidade comum fica abaixo da tabela. Colagem e importação, edição de colunas, resultados adicionais, organização das leituras, fórmulas e outros cálculos ficam em opções recolhidas. O exemplo do trabalho 01 configura a incerteza de cada peça automaticamente. Carregá-lo guarda a entrada anterior, recuperável em **Editar colunas e outras opções → Voltar à tabela anterior**.

A tabela calculada só aparece depois do cálculo e é invalidada quando as medidas ou a configuração mudam. CSV, precisão de exibição e continuação em outra etapa ficam em **Mais opções do resultado**. A sessão pode ser salva e aberta no final da página.

Vírgula e ponto decimal são aceitos. Para colar números com vírgula, separe as colunas com tabulação ou ponto e vírgula. Os cabeçalhos devem ser diferentes entre si. Limites: 10.000 linhas, 100 colunas, arquivos de 5 MB. Campos não numéricos podem identificar as linhas; colunas selecionadas para cálculo precisam conter números válidos. No resumo por coluna, células vazias são ignoradas e N registra a contagem utilizada.

## Procedimentos disponíveis

- N, média, DP amostral, incerteza da média, incerteza instrumental, incerteza total, mínimo, máximo, incerteza relativa e percentual, apresentação valor ± incerteza.
- Desvios assinados, absolutos e quadráticos de cada leitura em relação à média.
- Combinação de incertezas estatística e instrumental em quadratura.
- Volumes de paralelepípedo, cilindro, arruela, peça com ressalto/furo e peça com corte do relatório 01; propagação nas expressões completas, incluindo dimensões compartilhadas.
- Propagação na soma dos quadrados, produto, razão e diferença de grandezas independentes.
- Linearização das duas coordenadas por ln, log10, quadrado ou inverso, com propagação das incertezas. A saída X, vX, Y, vY pode ser usada na Calculadora de gráficos.
- Regressão linear ponderada por 1/σY²: tabela de pesos e produtos, valores ajustados e resíduos; tabela separada com a, σa, b, σb, χ², graus de liberdade e χ² reduzido.
- Retorno da regressão em logaritmos naturais à lei y = C(x/xref)^n, com n = a, C = yref exp(b) e σC = Cσb.

A interface não oferece um editor genérico de fórmulas. As leis dos experimentos posteriores da apostila e a propagação com covariâncias não estão automatizadas.

## Fontes e hipóteses

A [apostila](../referencias_gerais/Apostila_LAB1.pdf), equações 2.1–2.4, define média, DP com divisor N−1, incerteza estatística s/√N e combinação instrumental. As páginas 10–11 orientam a apresentação com um algarismo significativo na incerteza e o mesmo nível decimal no valor. A equação 3.1 fundamenta a propagação de primeira ordem para variáveis independentes. Os capítulos 4 e 5 e os slides 13 e 16 do [material da aula](../../FisicaEx02/refs/Aula3-PropagacaoLinearizacao.pdf) fundamentam linearização e regressão. Os modelos geométricos seguem o [relatório 01](../../FisicaEx01/Relatório_Final.pdf).

O ajuste considera somente incertezas verticais positivas. Não utiliza σX nem reescala as incertezas dos coeficientes pelo χ² reduzido. Com dois pontos, o ajuste existe, mas χ² reduzido é indefinido. Não há estimativa automática de aceleração da gravidade.

A propagação usa diferenciação automática e as expressões completas dos modelos, sem executar código digitado. Duas grandezas independentes não podem apontar para a mesma coluna. Grandezas derivadas que compartilham dados originais podem ser correlacionadas: não devem ser combinadas sob a hipótese de independência. O modelo de corte exige uma corda menor que o diâmetro da base e um corte que não atinja o ressalto ou o furo.

DP e incerteza da média exigem N ≥ 2. A incerteza relativa é indefinida quando o valor é zero. Dimensões geométricas devem ser positivas. Não há conversão automática de unidades. Nos logaritmos, a referência deve ser positiva e expressa na unidade da grandeza. A unidade informada em C é a mesma de y; x continua normalizado por xref.

Os cálculos mantêm a precisão completa até a apresentação. O seletor de precisão altera apenas a exibição; exportar números arredondados exige marcar a opção correspondente. A coluna textual valor ± incerteza já contém o arredondamento da apresentação. CSV protege textos que possam ser interpretados como fórmulas; XLSX contém valores e textos literais. A tabela de coeficientes da regressão tem exportação CSV própria.

## Exemplos e sessões

**Apostila:** medidas 0,680, 0,660 e 0,670 m, com incerteza instrumental 0,005 m. Resultado apresentado: (0,670 ± 0,008) m.

**Trabalho 01:** as 16 dimensões das quatro peças, com três leituras cada, foram conferidas na Tabela 1 do relatório final. Todas estão em centímetros. A coluna instrumental contém 0,001 cm para a bateria e 0,005 cm para arruela e peças com ressalto, conforme a metodologia do próprio relatório. O exemplo já seleciona somente as três leituras para calcular média, DP, incerteza da média e incerteza total. A segunda leitura de L é 1,31 cm. O trabalho 02 não aparece no seletor de exemplos.

Salvar sessão guarda medidas e configuração em JSON versão 2. Ao abrir, o usuário recalcula a tabela. Não há salvamento automático. Sessões da antiga calculadora genérica não são carregadas nesta versão; seus dados podem ser importados pelo CSV exportado anteriormente. A cópia de tabelas anteriores permanece somente na aba aberta.

## Verificação e publicação

- `engine.js`: números, estatística, expressões internas e diferenciação automática.
- `lab.js`: métodos da disciplina e validação dos modelos.
- `app.js`: entrada, seleção dos procedimentos, resultados, exportação e sessão.
- `xlsx.js`: exportador OOXML/ZIP sem dependências externas.
- `engine.test.cjs` e `lab.test.cjs`: testes de matemática, validação e reprodução dos resultados do EX02. Executar `node --test apoio/calculadora-fisica/*.test.cjs`.

O construtor `apoio/portal/build.cjs` inclui o aplicativo em `/calculadora-fisica/`; o fluxo do GitHub Pages testa e publica as alterações. A validação desta revisão também conferiu no navegador o fluxo completo do EX02, importação, exportação XLSX com precisão completa, recuperação de sessão, mensagens de erro e apresentação em celular.
