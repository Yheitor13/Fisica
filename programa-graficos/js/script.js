(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const body = $('rows'), plot = $('plot');
  let dirty = false, busy = false, isExample = true;
  const exportButtons = [$('export-png'), $('export-svg')];
  function status(message, kind = '') { $('status').textContent = message; $('status').className = kind; }
  function markDirty() {
    dirty = true;
    exportButtons.forEach(b => b.disabled = true);
    $('plot-state').textContent = 'Atualização pendente';
    status('Há alterações. Clique em Gerar / atualizar gráfico para aplicá-las.', 'pending');
  }
  function changedData() { isExample = false; $('example-note').hidden = true; markDirty(); }
  function refreshCount() {
    $('row-count').textContent = `${body.children.length} linhas`;
    [...body.children].forEach((row, i) => {
      row.firstChild.textContent = i + 1;
      row.querySelectorAll('input').forEach((input, j) => input.setAttribute('aria-label', `Linha ${i + 1}, ${LabData.columns[j]}`));
      row.querySelector('button').setAttribute('aria-label', `Excluir linha ${i + 1}`);
    });
  }
  function addRow(values = ['', '', '', '']) {
    if (body.children.length >= LabData.MAX_ROWS) throw new Error(`O limite é de ${LabData.MAX_ROWS} linhas.`);
    const row = document.createElement('tr');
    row.appendChild(document.createElement('td'));
    values.forEach(value => {
      const cell = document.createElement('td'), input = document.createElement('input');
      input.type = 'text'; input.inputMode = 'decimal'; input.value = value;
      input.autocomplete = 'off'; input.spellcheck = false;
      cell.appendChild(input); row.appendChild(cell);
    });
    const cell = document.createElement('td'), remove = document.createElement('button');
    remove.type = 'button'; remove.className = 'remove-row'; remove.textContent = '×';
    remove.addEventListener('click', () => { row.remove(); if (!body.children.length) addRow(); refreshCount(); changedData(); });
    cell.appendChild(remove); row.appendChild(cell); body.appendChild(row);
  }
  function setRows(matrix) { body.replaceChildren(); matrix.forEach(addRow); refreshCount(); }
  function readRows() {
    body.querySelectorAll('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));
    const matrix = [...body.children].map(row => [...row.querySelectorAll('input')].map(input => input.value));
    try { return LabData.validate(matrix); }
    catch (error) {
      const cell = /Linha (\d+), (vX|vY|X|Y):/.exec(error.message);
      if (cell) {
        const input = body.children[Number(cell[1]) - 1].querySelectorAll('input')[LabData.columns.indexOf(cell[2])];
        input.setAttribute('aria-invalid', 'true'); input.focus();
      }
      throw error;
    }
  }
  function methodHelp() {
    $('method').disabled = !$('fit').checked;
    $('method-help').textContent = $('method').value === 'weighted'
      ? 'Pesos 1/vY²: exige vY > 0. O ajuste considera apenas vY; vX é exibido nas barras, mas não entra no cálculo. R² usa os mesmos pesos.'
      : 'Sem ponderação: todos os pontos têm o mesmo peso. vX e vY aparecem nas barras de incerteza, mas não entram no cálculo.';
  }
  async function generate() {
    if (busy) return;
    busy = true; $('generate').disabled = true;
    exportButtons.forEach(b => b.disabled = true);
    try {
      const points = readRows();
      if ($('fit').checked && $('curve').checked) throw new Error('Escolha a reta de regressão ou a curva informada, uma de cada vez.');
      const curve = $('curve').checked ? LabData.powerCurve(points, LabData.number($('curve-c').value, 'da curva', 'C'), LabData.number($('curve-n').value, 'da curva', 'n'), LabData.number($('curve-x0').value, 'da curva', 'X₀')) : null;
      const fit = $('fit').checked ? LabData.regression(points, $('method').value) : null;
      await LabGraph.draw(plot, points, {title: $('title').value, xLabel: $('x-label').value, xUnit: $('x-unit').value, yLabel: $('y-label').value, yUnit: $('y-unit').value, curve}, fit);
      $('fit-results').hidden = !fit;
      if (fit) {
        $('equation').textContent = LabGraph.equation(fit);
        $('slope').textContent = LabGraph.format(fit.slope);
        $('intercept').textContent = LabGraph.format(fit.intercept);
        $('r2').textContent = LabGraph.format(fit.r2);
        $('r2-label').textContent = fit.weighted ? 'R² ponderado' : 'R²';
        $('fit-kind').textContent = fit.weighted ? 'Pesos 1/vY²' : 'Sem ponderação';
      }
      $('zoom-mode').setAttribute('aria-pressed', 'true'); $('pan-mode').setAttribute('aria-pressed', 'false');
      dirty = false;
      $('plot-state').textContent = `${points.length} pontos${isExample ? ' · EX02' : ''}`;
      status(`${points.length} pontos representados. ${fit ? 'Ajuste calculado.' : curve ? 'Curva desenhada com os parâmetros informados; sem novo ajuste.' : 'Regressão desativada.'}`);
      exportButtons.forEach(b => b.disabled = false);
    } catch (error) { dirty = true; $('plot-state').textContent = 'Revise os dados'; status(error.message, 'error'); }
    finally { busy = false; $('generate').disabled = false; }
  }
  function replaceData(matrix) { setRows(matrix); changedData(); }
  function loadExample() {
    const view = $('example-view').value;
    setRows(view === 'linear' ? window.EX02_DATA : window.EX02_ORIGINAL);
    isExample = true; $('example-note').hidden = false;
    $('title').value = 'Linearização da relação distância–tempo';
    $('x-label').value = 'ln(t̄ / 1 s)'; $('y-label').value = 'ln(x / 1 cm)';
    $('x-unit').value = ''; $('y-unit').value = '';
    if (view !== 'linear') {
      $('title').value = view === 'curve' ? 'Lei de potência na escala original' : 'Dados antes da linearização';
      $('x-label').value = 'Tempo médio t̄'; $('x-unit').value = 's';
      $('y-label').value = 'Distância x'; $('y-unit').value = 'cm';
      $('example-note').textContent = 'EX02 — prática de 29/09/2026. Tempos médios em segundos; distâncias em centímetros. vX = σt e vY = 1 cm. A curva usa C e n obtidos no ajuste logarítmico ponderado; não é um novo ajuste.';
    } else {
      $('example-note').textContent = 'EX02 — prática de 29/09/2026. X = ln(t̄/1 s), Y = ln(x/1 cm), ambos adimensionais; vX e vY já propagados. Consulte exemplos/README.md para a origem e o método.';
    }
    $('curve').checked = view === 'curve';
    $('curve-c').value = window.EX02_CURVE.c; $('curve-n').value = window.EX02_CURVE.n; $('curve-x0').value = 1;
    $('fit').checked = false; $('method').value = 'ordinary'; methodHelp(); markDirty(); generate();
  }
  $('generate').addEventListener('click', generate);
  body.addEventListener('input', changedData);
  $('add-row').addEventListener('click', () => { try { addRow(); refreshCount(); changedData(); body.lastChild.querySelector('input').focus(); } catch (e) { status(e.message, 'error'); } });
  $('clear').addEventListener('click', () => { replaceData([['', '', '', '']]); });
  $('example').addEventListener('click', loadExample);
  ['title', 'x-label', 'x-unit', 'y-label', 'y-unit'].forEach(id => $(id).addEventListener('input', markDirty));
  ['curve', 'curve-c', 'curve-n', 'curve-x0'].forEach(id => $(id).addEventListener('input', markDirty));
  ['fit', 'method'].forEach(id => $(id).addEventListener('change', () => { methodHelp(); markDirty(); }));
  $('import').addEventListener('click', () => $('file').click());
  $('file').addEventListener('change', async () => {
    const file = $('file').files[0]; if (!file) return;
    try {
      if (file.size > 2000000) throw new Error('Use um arquivo de até 2 MB.');
      replaceData(LabData.parse(await file.text()));
      status(`Arquivo ${file.name} carregado. Atualize o gráfico.`, 'pending');
    } catch (e) { status(e.message, 'error'); }
    finally { $('file').value = ''; }
  });
  $('apply-paste').addEventListener('click', () => {
    try { replaceData(LabData.parse($('paste-data').value)); } catch (e) { status(e.message, 'error'); }
  });
  body.addEventListener('paste', event => {
    const text = event.clipboardData.getData('text');
    if (!/[\t\r\n;]/.test(text)) return;
    event.preventDefault();
    try {
      const matrix = LabData.parse(text);
      const startRow = [...body.children].indexOf(event.target.closest('tr'));
      if (startRow + matrix.length > LabData.MAX_ROWS) throw new Error(`O limite é de ${LabData.MAX_ROWS} linhas.`);
      matrix.forEach((values, i) => {
        if (!body.children[startRow + i]) addRow();
        body.children[startRow + i].querySelectorAll('input').forEach((input, j) => input.value = values[j]);
      });
      refreshCount(); changedData();
    } catch (e) { status(e.message, 'error'); }
  });
  $('save-data').addEventListener('click', () => {
    try {
      const url = URL.createObjectURL(new Blob([LabData.csv(readRows())], {type: 'text/csv;charset=utf-8'}));
      const a = document.createElement('a'); a.href = url; a.download = 'dados-experimentais.csv'; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) { status(e.message, 'error'); }
  });
  ['zoom', 'pan'].forEach(mode => $(mode + '-mode').addEventListener('click', () => {
    if (!plot.data) return;
    Plotly.relayout(plot, {dragmode: mode});
    $('zoom-mode').setAttribute('aria-pressed', String(mode === 'zoom')); $('pan-mode').setAttribute('aria-pressed', String(mode === 'pan'));
  }));
  $('reset').addEventListener('click', () => { if (plot.data) Plotly.relayout(plot, {'xaxis.autorange': true, 'yaxis.autorange': true}); });
  ['png', 'svg'].forEach(type => $('export-' + type).addEventListener('click', async () => {
    if (dirty || busy || !plot.data) return;
    busy = true; exportButtons.forEach(b => b.disabled = true);
    try { await LabGraph.exportImage(plot, type); status(`Gráfico exportado em ${type.toUpperCase()}${type === 'png' ? ' (3600 × 2400 pixels)' : ' vetorial'}.`); }
    catch (e) { status('Não foi possível exportar: ' + e.message, 'error'); }
    finally { busy = false; exportButtons.forEach(b => b.disabled = dirty); }
  }));
  loadExample();
})();
