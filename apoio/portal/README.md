# Portal de Física Experimental

Página simples de acesso aos dois trabalhos, aos materiais de consulta e à Calculadora de gráficos.

- Portal: https://yheitor13.github.io/Fisica/
- Calculadora de gráficos: https://yheitor13.github.io/Fisica/calculadora-de-grafico/
- Os READMEs e os arquivos completos permanecem disponíveis no GitHub.

O portal é HTML e CSS, sem dependências, cadastro ou processamento remoto. Os relatórios e gráficos PDF abrem diretamente no navegador. Word e planilhas são oferecidos para download. Fotografias e materiais de desenvolvimento são acessíveis pelos links do repositório, sem duplicá-los na publicação.

## Publicação

O fluxo `.github/workflows/pages.yml` testa a Calculadora de gráficos e executa `node apoio/portal/build.cjs`. O construtor monta `.pages/` com o portal, o programa em `calculadora-de-grafico/`, os documentos finais e os PDFs de apoio. Verifica todos os links locais do portal antes de publicar. `.pages/` é apenas uma cópia de publicação e não deve entrar no Git.

Para conferir localmente, na raiz do repositório:

```sh
node apoio/portal/build.cjs
python -m http.server 8080 --directory .pages
```

Abra http://localhost:8080. Também é possível abrir `.pages/index.html` diretamente, sem servidor. Para atualizar links ou textos, edite `index.html`; para alterar a aparência, edite `style.css`. Os caminhos de EX01 e EX02 mantêm os nomes históricos dos arquivos.
