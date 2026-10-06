(function () {
  'use strict';
  const format = n => n === null ? 'Não definido (Y constante)' : new Intl.NumberFormat('pt-BR', {maximumSignificantDigits: 7}).format(n);
  const escape = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const label = (name, unit) => escape(name || '') + (unit.trim() ? ` (${escape(unit.trim())})` : '');
  const equation = fit => `Y = ${format(fit.slope)} X ${fit.intercept < 0 ? '−' : '+'} ${format(Math.abs(fit.intercept))}`;
  async function draw(element, points, settings, fit) {
    if (!window.Plotly) throw new Error('A biblioteca de gráficos não carregou. Confira se a pasta vendor acompanha o programa.');
    const errors = values => ({type: 'data', array: values, visible: true, symmetric: true, color: '#56786b', thickness: 1.3, width: 4});
    const traces = [{x: points.map(p => p.x), y: points.map(p => p.y), customdata: points.map(p => [p.vx, p.vy]),
      type: 'scatter', mode: 'markers', name: 'Dados experimentais',
      marker: {color: '#155e52', size: 7, line: {color: '#fff', width: .6}},
      error_x: errors(points.map(p => p.vx)), error_y: errors(points.map(p => p.vy)),
      hovertemplate: 'X: %{x:.8g}<br>vX: %{customdata[0]:.8g}<br>Y: %{y:.8g}<br>vY: %{customdata[1]:.8g}<extra>Dados experimentais</extra>'}];
    if (fit) {
      const min = points.reduce((m, p) => Math.min(m, p.x), Infinity);
      const max = points.reduce((m, p) => Math.max(m, p.x), -Infinity);
      traces.push({x: [min, max], y: [fit.predict(min), fit.predict(max)], type: 'scatter', mode: 'lines', name: 'Ajuste linear', line: {color: '#c77948', width: 2}, hoverinfo: 'skip'});
    }
    if (settings.curve) {
      traces.push({x: settings.curve.x, y: settings.curve.y, type: 'scatter', mode: 'lines', name: 'Curva reconstruída', line: {color: '#c77948', width: 2}, hoverinfo: 'skip'});
    }
    const annotation = fit ? equation(fit) + ` · R²${fit.weighted ? ' ponderado' : ''} = ${format(fit.r2)}`
      : settings.curve ? `C = ${format(settings.curve.c)} ${settings.yUnit} · n = ${format(settings.curve.n)} · X₀ = ${format(settings.curve.x0)} ${settings.xUnit}` : '';
    const axis = {showgrid: true, gridcolor: '#e8ede9', gridwidth: 1, zeroline: false, showline: true, mirror: true, linecolor: '#8a9990', linewidth: 1, ticks: 'outside', tickcolor: '#8a9990', ticklen: 5, automargin: true, exponentformat: 'power', tickfont: {size: 11}, fixedrange: false};
    const layout = {autosize: true, paper_bgcolor: '#fff', plot_bgcolor: '#fff', font: {family: 'Arial, sans-serif', size: 13, color: '#334c40'}, separators: ',.',
      title: {text: escape(settings.title), font: {size: 16}, x: .5, xanchor: 'center', y: .97, yanchor: 'top', yref: 'container', automargin: false},
      margin: {l: 75, r: 35, t: 100, b: 105},
      xaxis: {...axis, title: {text: label(settings.xLabel, settings.xUnit), standoff: 18}},
      yaxis: {...axis, title: {text: label(settings.yLabel, settings.yUnit), standoff: 16}},
      showlegend: true, legend: {orientation: 'h', x: .5, xanchor: 'center', y: .01, yref: 'container', yanchor: 'bottom', font: {size: 11}, itemclick: false, itemdoubleclick: false},
      hovermode: 'closest', dragmode: 'zoom',
      annotations: annotation ? [{text: escape(annotation), xref: 'paper', yref: 'paper', x: .5, y: 1.04, xanchor: 'center', yanchor: 'bottom', showarrow: false, font: {size: 11, color: '#8f512e'}}] : []};
    await Plotly.react(element, traces, layout, {responsive: true, editable: false, scrollZoom: true, displayModeBar: false, displaylogo: false, doubleClick: 'reset', showTips: false});
  }
  async function exportImage(element, type) {
    // Render a separate export layout: readable at a 16 cm report width,
    // while preserving the current viewport and leaving the on-screen plot intact.
    const target = document.createElement('div');
    target.style.cssText = 'position:fixed;left:-20000px;width:1200px;height:800px';
    document.body.appendChild(target);
    try {
      const layout = JSON.parse(JSON.stringify(element.layout));
      layout.width = 1200; layout.height = 800; layout.autosize = false;
      layout.font.size = 24; layout.title.font.size = 28;
      layout.margin = {l: 125, r: 50, t: 140, b: 145};
      for (const name of ['xaxis', 'yaxis']) {
        layout[name].range = [...element._fullLayout[name].range];
        layout[name].autorange = false; layout[name].tickfont = {size: 22};
        layout[name].title.font = {size: 24};
      }
      layout.legend.font.size = 22;
      layout.annotations.forEach(a => { a.font.size = 22; });
      const data = JSON.parse(JSON.stringify(element.data));
      data.forEach(t => { if (t.marker) t.marker.size = 10; for (const key of ['error_x','error_y']) if (t[key]) {t[key].width = 5;t[key].thickness = 1.8;} });
      await Plotly.newPlot(target, data, layout, {staticPlot: true});
      await Plotly.downloadImage(target, {format: type, filename: 'grafico-experimental', width: 1200, height: 800, scale: type === 'png' ? 3 : 1});
    } finally { Plotly.purge(target); target.remove(); }
  }
  window.LabGraph = {draw, exportImage, format, equation};
})();
