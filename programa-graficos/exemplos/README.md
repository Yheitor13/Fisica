# Origem do exemplo EX02

O arquivo `dados-exemplo.csv` contém os nove pontos já linearizados do trabalho 02, prática de 29/09/2026: distância e tempo de um objeto sobre sistema de redução de atrito por ar com sensores.

Fonte: [planilha salva, aba Medidas, A6:E14](https://github.com/Yheitor13/Fisica/blob/main/FisicaEx02/refs/medidas_fisicaEX02.xlsx). Dados conferidos em 05/10/2026. A terceira leitura de tempo do ponto 2 é 0,2971 s. Distâncias em centímetros (10 a 90), três tempos em segundos por distância. A planilha original e o relatório não são modificados pelo programa.

O exemplo foi preparado com média dos três tempos; desvio padrão amostral s; σt = √(s²/3 + (0,0001 s)²); σx = 1 cm. A transformação previamente calculada é X = ln(t̄/1 s), Y = ln(x/1 cm), vX = σt/t̄ e vY = σx/x. Todos os valores do CSV são, portanto, adimensionais. A anotação 10⁻³ da fotografia não foi usada, por não haver interpretação confirmada.

Os mesmos números estão incorporados em `js/example.js` para permitir abrir o programa diretamente como arquivo, sem servidor. Nenhuma linearização é feita automaticamente pelo aplicativo.

Selecionando o ajuste ponderado por 1/vY², os resultados esperados são:

- Coeficiente angular: 1,0491426034754439.
- Intercepto: 4,247506620097855.
- R² ponderado: 0,9991171911338197.

O ajuste ignora a contribuição horizontal, conforme o método documentado no [relatório 02](https://github.com/Yheitor13/Fisica/blob/main/FisicaEx02/Relatorio_Final.pdf). A interpretação física, as incertezas dos coeficientes e as condições de validade permanecem no relatório. Estas incertezas e condições pertencem a este experimento; não devem ser transportadas automaticamente para outras práticas.


## Escala original e curva reconstruída

`dados-originais-ex02.csv` contém X = t̄ em segundos, vX = σt em segundos, Y = x em centímetros e vY = σx = 1 cm. Esses números foram recalculados a partir da mesma planilha salva e comparados aos registros conferidos. `js/example.js` incorpora também esse conjunto e os coeficientes de precisão completa.

A opção de curva usa os coeficientes C e n já obtidos pela regressão ponderada dos logaritmos: Y = C(X/X₀)ⁿ, com X₀ = 1 s. É uma reconstrução do mesmo modelo, não uma nova regressão dos dados originais. As barras permanecem as incertezas das medidas, sem faixa de confiança da curva.
