# Site dos trabalhos de Física

[Site publicado](https://yheitor13.github.io/labfisica/)

## Conteúdo e navegação

- Lista de pastas EX01 a EX04, com relatórios em PDF.
- Relatórios, contas e fórmulas dentro de cada pasta expansível.
- Duas calculadoras: Física Experimental e gráficos.
- Apostila e materiais de consulta.

Planilhas, Word, fotos e figuras avulsas ficam acessíveis no repositório, sem ocupar a página inicial. Endereços de documentos publicados anteriormente permanecem compatíveis. Os arquivos originais dos experimentos não são movidos pelo construtor.

## Aparência e acessibilidade

HTML e CSS sem dependências externas. Índice compacto com aparência de gerenciador de arquivos, sem apresentação ou ilustrações. Pastas expansíveis, títulos hierárquicos, link de salto para o conteúdo, foco visível e controles com área de toque confortável. Os links abrem na mesma aba. As duas calculadoras ficam no topo; no celular, os links se organizam em uma coluna.

Referências de projeto: [layout responsivo GOV.UK](https://design-system.service.gov.uk/styles/layout/) e [estrutura de página W3C](https://www.w3.org/WAI/tutorials/page-structure/).

## Publicação

O workflow `.github/workflows/pages.yml` testa as duas calculadoras, monta o site e publica no GitHub Pages. Inclui EX01 a EX04. Para conferir localmente:

```sh
node apoio/portal/build.cjs
python -m http.server 8080 --directory .pages
```

O construtor verifica os links locais da página. `.pages/` é gerada e ignorada pelo Git. Edite `index.html` para conteúdo e `style.css` para apresentação.
