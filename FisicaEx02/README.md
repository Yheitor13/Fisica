# Física Experimental 02 — Linearização

**Etapa atual:** relatório concluído em 05/10/2026, no padrão do trabalho 01, com dados conferidos, gráficos, quatro fotografias e revisão visual das 19 páginas. Participantes atualizados conforme solicitação do usuário.

## Arquivos

- [medidas_fisicaEX02.xlsx](medidas_fisicaEX02.xlsx): planilha editável com as medições corrigidas pelo usuário.
- [Foto original](dados/foto_medidas_2026-09-29.jpg): registro bruto, originalmente denominado IMG_20260929_174507.jpg.
- [Referências específicas](refs/): destino dos próximos materiais deste trabalho.
- [Referências gerais](../referencias_gerais/): apostila, aulas e orientações comuns.

## Dados confirmados e pendências

- Cada linha identifica uma distância: x₁ = 10 cm, x₂ = 20 cm, x₃ = 30 cm, até x₉ = 90 cm. Os índices identificam pontos, não repetições da mesma distância.
- As colunas t₁, t₂ e t₃ registram três tempos de cada ponto.
- Na versão salva e conferida em 29/09/2026, o terceiro tempo do ponto 2 é **0,2971**, corrigido pelo usuário. Preservar esse valor; não restaurar a transcrição anterior 0,2871.
- Tempos em segundos, conforme anotação do usuário na planilha. Incertezas informadas pelo usuário: 1 cm para a distância e 0,0001 s para o tempo. A natureza dessas incertezas e o significado da anotação 10⁻³ na foto serão conferidos com o roteiro antes dos cálculos.
- A planilha permanece a fonte editável das medidas; consultar sempre sua versão mais recente.

## Relação com o trabalho 01

Consultar o [primeiro trabalho](../FisicaEx01/) como base de tratamento de medidas e incertezas. O usuário indicou continuidade entre os experimentos. Registrar aqui os dados ou resultados efetivamente reutilizados e sua origem após receber o roteiro; não presumir quais serão necessários.

## Próxima etapa

Relatório atualizado com as fotografias, identificação dos três participantes, lista de figuras, sumário e paginação conferidos.

## Arquivos de cálculo - 29/09/2026

- [Resolução completa](Resolucao_Completa.pdf): médias e incertezas dos nove pontos, propagação logarítmica, somatórios, ajuste ponderado, gráficos e verificações (16 páginas).
- [Resultados finais](Resultados_Finais.pdf): tabelas e parâmetros arredondados, condições do ajuste e gráficos (3 páginas).

Aplicada a regressão do slide 16 com pesos 1/σY². Hipótese: 0,0001 s é a contribuição instrumental do tempo. As incertezas horizontais são exibidas, mas não entram no ajuste da aula. Resultado: n = 1,05 ± 0,02; C = (69,9 ± 0,4) cm no modelo x = C(t/1 s)^n. Não foi calculado g, pois o modelo de queda livre do exemplo não corresponde ao expoente encontrado.


## Relatório e gráficos — 05/10/2026

- [Relatório final em PDF](Relatorio_Final.pdf) — 19 páginas, com quatro tabelas, três gráficos e quatro fotografias organizadas em duas figuras.
- [Relatório editável em Word](Relatorio_Final.docx) — capa, turma, docente, estilos e margens no padrão do trabalho 01; conteúdo do segundo experimento, com três participantes e suas matrículas atualizados.
- [Dados antes da linearização](graficos/01_Dados_Antes_da_Linearizacao.pdf).
- [Linearização e reta ajustada](graficos/02_Linearizacao_e_Reta_Ajustada.pdf).
- [Curva ajustada na escala original](graficos/03_Curva_Ajustada_Escala_Original.pdf).
- Os três gráficos também estão disponíveis em PNG de 300 dpi na mesma pasta.
- [Cálculos conferidos](calculos_verificados.json) — valores completos, incertezas, parâmetros e hash da planilha utilizada.

O usuário confirmou a prática em **29/09/2026** e o uso de um sistema de redução de atrito por ar com sensores para acompanhar o deslocamento de um objeto em diferentes distâncias. A metodologia incorpora essas informações. Nenhuma fotografia do primeiro trabalho foi reutilizada.

O primeiro relatório foi utilizado como referência de apresentação, participantes e escrita. Nenhuma medida ou resultado físico do trabalho 01 foi transportado para o trabalho 02. Referências comuns pertinentes foram mantidas; a referência específica de Sousa foi adaptada ao material de linearização (arquivo Aula3, título interno “Aula 2 – Laboratório de Física 1”, 19 slides, sem data identificada).

Validação: releitura da planilha salva, regressão recalculada e conferida por solução independente de mínimos quadrados, preservação dos dados corrigidos, conferência dos nomes e matrículas, margens e estilos, equações editáveis, listas/sumário e revisão visual de todas as páginas do PDF exportado pelo Word.


## Inclusão das fotografias e atualização dos participantes — 05/10/2026

As quatro fotografias de [Fotos Experimento.zip](Fotos%20Experimento.zip) foram incluídas na seção 3.1 Registros fotográficos. A Figura 1 apresenta o trilho e a fonte de ar; a Figura 2 apresenta os sensores e o painel de medição. Os gráficos passaram a Figuras 3, 4 e 5. Fontes, referência do acervo, lista de figuras, sumário e paginação foram atualizados.

Participantes atuais, com matrículas na ordem confirmada pelo usuário:

- Heitor Yochida de Ávila — 12612ETE002.
- Sofia Skolimoski — 12621ETE001.
- Tiago de Almeida Raile — 12621EAU003.

Arthur e Enzo e suas duas matrículas foram removidos do relatório e das propriedades dos arquivos. Medições, tabelas, equações e resultados foram preservados. Fotografias incorporadas sem cortes ou alterações de conteúdo. PDF final com 19 páginas, conferido visualmente.
