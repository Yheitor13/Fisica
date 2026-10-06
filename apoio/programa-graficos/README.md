# Calculadora de gráficos

**Versão 1.2 — 05/10/2026.** Interface simplificada; anteriormente denominado GráficoLab. Desenvolvido para a elaboração dos gráficos do trabalho 02 de Física Geral Experimental I.

**[Abrir o programa](https://yheitor13.github.io/Fisica/graficolab/)**

Aplicativo gratuito para representar medidas experimentais com barras de incerteza horizontais e verticais, ajustar uma reta opcional e exportar figuras para relatórios. HTML, CSS e JavaScript; todo o processamento ocorre no navegador. Não exige cadastro, instalação, banco de dados ou servidor de processamento.

## Como usar

1. Digite na tabela, cole quatro colunas do Excel, ou importe um CSV. A ordem sem cabeçalho é **X | vX | Y | vY**.
2. Preencha título, nomes dos eixos e unidades. Para valores já linearizados, use os rótulos correspondentes à transformação que você calculou.
3. Se desejar, marque **Exibir reta de regressão** e escolha o método.
4. Clique em **Gerar / atualizar gráfico**. Edições pendentes bloqueiam a exportação para evitar baixar um gráfico desatualizado.
5. Use **Ampliar região**, **Mover visão**, a roda do mouse ou **Restaurar visão**. Passe o cursor nos pontos para consultar as quatro grandezas.
6. Exporte em **PNG** (3600 × 2400 pixels) ou **SVG** vetorial. A exportação preserva a região visível e inclui apenas a figura: título, eixos, legenda, pontos, barras e ajuste quando ativo. Restaure a visão antes de exportar se quiser todos os pontos.

A tabela, o gráfico e os campos de apresentação iniciam vazios; o ajuste inicia desligado. Para carregar um exemplo, escolha a opção desejada e clique em **Exemplo EX02**. Para reproduzir a reta do relatório, ative a regressão e selecione **pesos 1/vY²**. Para iniciar outro conjunto, use **Limpar** e ajuste os rótulos. Os botões Limpar, Exemplo, importação e bloco de colagem substituem a tabela. A colagem diretamente numa célula substitui quatro colunas a partir da linha selecionada, preservando as linhas seguintes que não forem abrangidas. Para substituir todo o conjunto, prefira o bloco de colagem ou a importação.

**Salve o CSV antes de fechar a página.** Não há armazenamento automático: os dados permanecem apenas na memória desta aba. O CSV preserva os quatro valores numéricos, mas não as configurações de título, unidades ou ajuste.

## Significado das colunas

| Coluna | Significado |
| --- | --- |
| X | Valor horizontal, na escala escolhida pelo usuário. |
| vX | Incerteza absoluta de X, na mesma unidade de X. Barra de X − vX a X + vX. |
| Y | Valor vertical. |
| vY | Incerteza absoluta de Y, na mesma unidade de Y. Barra de Y − vY a Y + vY. |

**vX e vY não são velocidades.** O usuário define se os valores representam desvios padrão ou outra convenção de incerteza, e deve identificá-la no relatório. O programa não os converte em intervalos de confiança e não calcula logaritmos, quadrados ou outras transformações automaticamente. Todas as quatro células são obrigatórias em uma linha preenchida; incerteza nula deve ser digitada como 0. Linhas inteiramente vazias são ignoradas; linhas parcialmente preenchidas ou inválidas bloqueiam a geração.

## Formato de entrada

Aceita ponto ou vírgula decimal, sinal e notação científica (`1,2e-3`). Não use separadores de milhares. CSV pode usar ponto e vírgula, tabulação ou vírgula separando campos. Para vírgula decimal, use ponto e vírgula ou tabulação como delimitador (ou campos entre aspas num CSV com vírgulas).

```csv
X;vX;Y;vY
2,50;0,05;4,80;0,10
3,00;0,05;5,75;0,12
4,00;0,05;7,90;0,10
```

Cabeçalhos são opcionais. Quando presentes, devem conter X, vX, Y, vY exatamente uma vez, sem distinção de maiúsculas; a ordem pode variar, pois o programa remapeia as colunas pelos nomes. São aceitos até 10.000 linhas e arquivos de até 2 MB. Cabeçalhos com unidades devem ser removidos ou renomeados; informe as unidades nos campos da interface.

## Regressão e limites científicos

Modelo: **Y = aX + b**. O ajuste requer ao menos dois pontos com valores X distintos.

- **Sem ponderação:** pesos wᵢ = 1. Minimiza a soma dos quadrados dos resíduos verticais.
- **Ponderado por vY:** pesos wᵢ = 1/vYᵢ²; exige vY > 0 em todos os pontos. É o método do relatório 02.

Com médias ponderadas X̄ e Ȳ, o cálculo usa `a = Σwᵢ(Xᵢ−X̄)(Yᵢ−Ȳ) / Σwᵢ(Xᵢ−X̄)²` e `b = Ȳ − aX̄`. O indicador exibido é `R² = 1 − Σwᵢ(Yᵢ−Ŷᵢ)² / Σwᵢ(Yᵢ−Ȳ)²`, usando os mesmos pesos do ajuste. Para Y constante, R² é indefinido e assim é identificado. Dois pontos distintos definem uma reta, mas não permitem avaliar dispersão residual.

**vX é representado visualmente, mas não entra nos ajustes.** Quando a incerteza horizontal for relevante para a análise, use um método apropriado que considere os dois eixos. Este programa não executa regressão ortogonal/York, não estima incertezas dos coeficientes e não determina se o modelo é fisicamente válido. R² não é teste de validade física. A interface mostra até sete algarismos significativos para consulta; o cálculo usa precisão completa de ponto flutuante, sem arredondar entradas. Arredonde os resultados no relatório conforme as incertezas do experimento.

O gráfico permite zoom e deslocamento, mas não arrastar pontos, barras, títulos ou a reta. A legenda não oculta séries ao clicar. Mudanças numéricas só vêm da tabela/importação.

## Executar localmente

Baixe este repositório e abra **apoio/programa-graficos/index.html** no navegador. Mantenha as subpastas junto dele. Funciona sem internet: a biblioteca Plotly está incluída em `vendor/`; não há fontes remotas, analytics, chamadas a APIs ou envio das medições.

Opcionalmente, para desenvolvimento, execute `python -m http.server 8080 --directory apoio/programa-graficos` na raiz do repositório e acesse `http://localhost:8080`. Para testar os cálculos com Node.js: `node --test apoio/programa-graficos/tests/data.test.cjs`. Usuários do programa não precisam instalar Python nem Node.

## Publicar no GitHub Pages

O fluxo [`.github/workflows/pages.yml`](../../.github/workflows/pages.yml) testa os cálculos e publica o portal na página inicial, o programa em `graficolab/` e os documentos finais de ambos os trabalhos.

1. Em **Settings → Pages → Build and deployment**, selecione **GitHub Actions**.
2. Envie as alterações para `main` ou execute o fluxo **Publicar portal de Física** em **Actions → Run workflow**.
3. Aguarde o trabalho de publicação terminar. Neste repositório, o endereço é `https://yheitor13.github.io/Fisica/graficolab/`.

Em um fork, habilite Actions e Pages e atualize os links deste README e da interface para a sua conta. Não são necessários secrets nem serviços pagos. Consulte a [documentação oficial do GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Organização

```text
apoio/programa-graficos/
  index.html              Interface
  favicon.svg
  css/style.css           Aparência e adaptação para celular
  js/data.js              Leitura, validação e regressão
  js/graph.js             Gráfico e exportação
  js/script.js            Interação com a tabela e controles
  js/example.js           Exemplo pré-calculado, sem transformação em execução
  exemplos/               CSV e documentação da origem
  tests/data.test.cjs      Testes numéricos e de entrada
  vendor/                 Plotly e licença MIT
```

Plotly.js basic **3.6.0**, distribuído localmente sob licença MIT. Origem: [bundle oficial](https://cdn.plot.ly/plotly-basic-3.6.0.min.js). Referências da implementação: [barras de erro](https://plotly.com/javascript/error-bars/), [configuração de interação](https://plotly.com/javascript/configuration-options/) e [exportação de imagens](https://plotly.com/javascript/static-image-export/).


## Reproduzir os três gráficos do relatório 02

Selecione o tipo em **Gráfico do exemplo EX02** e clique em **Exemplo EX02** para carregar:

1. **Dados antes da linearização:** X = tempo médio (s), Y = distância (cm), vX = incerteza do tempo médio e vY = 1 cm. Apenas pontos e barras.
2. **Dados linearizados:** X = ln(t̄/1 s), Y = ln(x/1 cm), ambos adimensionais. Ative a regressão e selecione pesos 1/vY²; atualize o gráfico.
3. **Curva reconstruída na escala original:** mesmos dados do primeiro gráfico, com C = 69,93083066019229 cm, n = 1,0491426034754439 e X₀ = 1 s. A curva Y = C(X/X₀)ⁿ é desenhada somente no intervalo medido. Não é uma segunda regressão nem uma transformação automática da tabela.

Na opção **Curva de potência com parâmetros informados**, também é possível inserir C, n e X₀ de outra análise. C usa a unidade de Y, X₀ usa a unidade de X, e n é adimensional. Exigem-se X e X₀ positivos e pelo menos dois X distintos. A reta e a curva são opções mutuamente exclusivas. O traçado usa 301 posições, sem alterar as medições. A anotação da curva mostra C, n e X₀, com as unidades informadas nos eixos; X e Y na fórmula são as coordenadas horizontal e vertical.

Os gráficos do relatório foram exportados pela interface em PNG e SVG. As versões PDF foram obtidas a partir dos mesmos SVGs, sem modificar os dados ou os elementos das figuras. A exportação usa fontes ampliadas para leitura ao inserir uma figura com largura de 16 cm no relatório. O CSV de dados originais está em `exemplos/dados-originais-ex02.csv`.

A reprodução gráfica não recalcula as incertezas dos coeficientes, qui-quadrado ou propagação: esses resultados continuam documentados no relatório. Fotografias, equações e tabelas do relatório são independentes do aplicativo.

[Voltar ao portal de Física Experimental](https://yheitor13.github.io/Fisica/)
