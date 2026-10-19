# Site dos trabalhos de Física

[Site publicado](https://yheitor13.github.io/Fisica/)

## Conteúdo e navegação

- Quatro relatórios com acesso direto ao PDF.
- Contas e fórmulas recolhidas dentro do cartão de cada trabalho.
- Duas calculadoras: Física Experimental e gráficos.
- Apostila e materiais de consulta.

Planilhas, Word, fotos e figuras avulsas ficam acessíveis no repositório, sem ocupar a página inicial. Endereços de documentos publicados anteriormente permanecem compatíveis. Os arquivos originais dos experimentos não são movidos pelo construtor.

## Aparência e acessibilidade

HTML e CSS sem dependências externas. Layout em duas colunas no computador e uma no celular, navegação sem menu escondido, títulos hierárquicos, link de salto para o conteúdo, foco visível e controles com área de toque confortável. Os links abrem na mesma aba para manter a navegação previsível. O desenho da trajetória é decorativo.

Referências de projeto: [layout responsivo GOV.UK](https://design-system.service.gov.uk/styles/layout/) e [estrutura de página W3C](https://www.w3.org/WAI/tutorials/page-structure/).

## Publicação

O workflow `.github/workflows/pages.yml` testa as duas calculadoras, monta o site e publica no GitHub Pages. Inclui EX01 a EX04. Para conferir localmente:

```sh
node apoio/portal/build.cjs
python -m http.server 8080 --directory .pages
```

O construtor verifica os links locais da página. `.pages/` é gerada e ignorada pelo Git. Edite `index.html` para conteúdo e `style.css` para apresentação.
