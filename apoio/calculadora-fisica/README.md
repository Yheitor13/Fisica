# Calculadora de tabelas de Física Experimental

Ferramenta gratuita para construir progressivamente tabelas de medidas e resultados. Funciona no navegador, inclusive abrindo `index.html` localmente, sem dependências externas, instalação, conta, backend ou envio de dados.

## Utilização

1. Digite as medidas, cole células de uma planilha ou importe CSV com cabeçalhos. Cada coluna possui nome e unidade editáveis. Tabulação e ponto e vírgula permitem números com vírgula decimal; CSV separado por vírgulas exige ponto decimal ou campos entre aspas.
2. Em **Escolha o cálculo**, selecione uma fórmula e associe suas variáveis às colunas.
3. Informe o nome e a unidade do resultado. Ative a propagação e selecione as incertezas quando necessário. Para uma grandeza exata, escolha **0 (exata)** explicitamente.
4. Crie o valor e a incerteza juntos ou escolha **Somente a incerteza** para complementar uma coluna já existente.
5. Exporte CSV, XLSX ou copie a tabela. Por padrão, a exportação usa precisão completa. A opção de arredondamento é explícita.
6. Salve uma sessão JSON antes de fechar a aba para recuperar medidas e fórmulas. Não há salvamento automático nem armazenamento remoto.

As colunas originais não são substituídas por cálculos. São editáveis pelo usuário, e suas alterações recalculam as colunas dependentes. Colagem, exclusão e substituição de tabela exigem confirmação. Colunas calculadas são somente leitura nos valores. **Desfazer cálculo** remove apenas a última coluna calculada; **Refazer** a restaura. Outras alterações encerram o histórico de refazer.

## Cálculos disponíveis

- Soma, subtração, multiplicação, divisão, potência e produto com expoentes exatos.
- Soma dos quadrados, incluindo D² = d1² + d2².
- Média, mínimo, máximo, número de medidas, desvio padrão amostral e desvio padrão da média.
- Desvios assinados e absolutos em relação à média.
- Erro absoluto, relativo e percentual em relação a uma coluna de referência.
- Quadrado, cubo, raiz, inverso, logaritmo natural e decimal.
- Fórmulas personalizadas com +, −, *, /, ^, parênteses, π/pi, e, sqrt, ln, log10, abs, exp, sin e cos.

Na estatística, cada coluna representa uma série de medidas. Células vazias são ignoradas, mas valores inválidos são rejeitados. Média e desvios globais são repetidos nas linhas preenchidas; os desvios individuais variam por linha. Desvio padrão e erro da média exigem pelo menos duas medidas. Para a média de repetições em colunas distintas, use uma expressão como `(t1+t2+t3)/3`.

Fórmulas aceitam `D2 = d1² + d2²` ou apenas a expressão. Use colchetes para nomes com espaços ou símbolos, como `[D²]`. Prefira multiplicação explícita (`pi * D^2 * h / 4`) para evitar ambiguidades. São aceitos `πD²h/4` e `2x` quando os nomes das colunas identificam os fatores. Nomes completos de colunas têm precedência sobre uma possível multiplicação. Vírgula decimal é aceita nas constantes; não há separador de milhares.

## Propagação e confiabilidade

A propagação de primeira ordem é `u(f) = sqrt(sum((df/dxi * uxi)^2))`, para variáveis independentes. As derivadas são calculadas por diferenciação automática das operações matemáticas, sem aproximações por diferenças finitas. Não há `eval`, `Function` nem execução de JavaScript digitado pelo usuário.

Para D²: `u(D²) = hypot(2*d1*ud1, 2*d2*ud2)`. Multiplicação e divisão usam as derivadas diretas, evitando a singularidade artificial das fórmulas relativas quando o numerador é zero. Se a mesma coluna é usada duas vezes, suas derivadas são somadas antes da propagação. Colunas derivadas que compartilham medidas não podem ser combinadas como independentes: use a expressão completa em termos das medidas originais. Correlações entre medidas originais distintas não são inferidas; o usuário deve verificar a hipótese de independência.

Incertezas são absolutas e não negativas. A ferramenta não interpreta resolução instrumental como incerteza automaticamente. Derivadas inexistentes (por exemplo, sqrt em zero ou abs em zero), divisões por zero, logaritmos não positivos e resultados não finitos são sinalizados. A propagação linear de x² em x=0 resulta em zero; nessa situação, termos de ordem superior podem dominar e a aproximação deve ser avaliada antes de relatar a incerteza.

Unidades são informadas manualmente, sem conversão nem análise dimensional. Logaritmos exigem argumentos adimensionais; normalize a grandeza pela unidade de referência antes de aplicá-los. Trigonometria usa radianos. Expoentes parametrizados são exatos.

Os cálculos usam números de ponto flutuante de dupla precisão, sem arredondamento intermediário. Casas decimais e algarismos significativos afetam os resultados exibidos; os campos de entrada preservam a digitação original. Valores muito pequenos podem aparecer como zero no formato fixo: use algarismos significativos para consultá-los. A exportação arredondada, quando selecionada, altera os valores do arquivo exportado, não os valores internos.

Limites: 10.000 linhas, 100 colunas, arquivos de até 5 MB e expressões de até 1.000 caracteres/256 tokens. Fórmulas inválidas não criam colunas parcialmente. Exportações são bloqueadas enquanto houver células inválidas. O XLSX contém valores e unidades, sem fórmulas executáveis; use a sessão JSON para preservar o histórico dos cálculos.

## Base metodológica

Material da disciplina: [Aula de propagação, linearização e regressão](../../FisicaEx02/refs/Aula3-PropagacaoLinearizacao.pdf), slides 2 e 13, e [Apostila de Física Experimental I](../referencias_gerais/Apostila_LAB1.pdf), capítulos 2–5. As fórmulas de estatística e propagação seguem esses métodos. Os exemplos geométricos são dados demonstrativos, não novas medições dos relatórios.

## Desenvolvimento e publicação

- `engine.js`: leitura numérica, parser, derivadas automáticas, estatística e CSV.
- `app.js`: tabela, dependências, resultados, importação, exportação e sessão.
- `xlsx.js`: exportação OOXML/ZIP com células numéricas e strings literais.
- `engine.test.cjs`: testes matemáticos e de entrada, executados com `node --test apoio/calculadora-fisica/engine.test.cjs`.

O construtor `apoio/portal/build.cjs` inclui este aplicativo em `/calculadora-fisica/`. O fluxo do GitHub Pages executa os testes e publica o site. Não é necessário instalar pacotes para usar o aplicativo.
