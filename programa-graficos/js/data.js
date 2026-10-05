/* Parsing and calculation are independent of the interface and never transform X or Y. */
(function (root) {
  'use strict';
  const columns = ['X', 'vX', 'Y', 'vY'];
  const MAX_ROWS = 10000;
  function number(value, row, column) {
    const text = String(value).trim().replace(/\u2212/g, '-');
    if (!/^[+-]?(?:\d+(?:[.,]\d*)?|[.,]\d+)(?:e[+-]?\d+)?$/i.test(text)) {
      throw new Error(`Linha ${row}, ${column}: informe um número válido (ex.: 2,5 ou 1e-3).`);
    }
    const n = Number(text.replace(',', '.'));
    if (!Number.isFinite(n)) throw new Error(`Linha ${row}, ${column}: valor fora do intervalo numérico.`);
    if (column.startsWith('v') && n < 0) throw new Error(`Linha ${row}, ${column}: a incerteza não pode ser negativa.`);
    return n;
  }
  function validate(matrix) {
    if (matrix.length > MAX_ROWS) throw new Error(`O limite é de ${MAX_ROWS} linhas.`);
    const points = [];
    matrix.forEach((row, i) => {
      if (row.every(v => String(v).trim() === '')) return;
      if (row.length !== 4) throw new Error(`Linha ${i + 1}: são necessárias 4 colunas: X, vX, Y, vY.`);
      const values = row.map((v, j) => number(v, i + 1, columns[j]));
      const [x, vx, y, vy] = values;
      if (![x + vx, x - vx, y + vy, y - vy].every(Number.isFinite)) {
        throw new Error(`Linha ${i + 1}: valores grandes demais para representar as barras.`);
      }
      points.push({x, vx, y, vy});
    });
    if (!points.length) throw new Error('Preencha pelo menos uma linha com X, vX, Y e vY.');
    return points;
  }
  function splitLine(line, delimiter) {
    let quoted = false, cell = '', cells = [];
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (quoted && line[i + 1] === '"') { cell += '"'; i++; }
        else quoted = !quoted;
      } else if (c === delimiter && !quoted) { cells.push(cell.trim()); cell = ''; }
      else cell += c;
    }
    if (quoted) throw new Error('Há aspas sem fechamento nos dados.');
    cells.push(cell.trim());
    return cells;
  }
  function parse(text) {
    if (text.length > 2000000) throw new Error('Use um arquivo de até 2 MB.');
    const lines = text.replace(/^\uFEFF/, '').split(/\r?\n|\r/).filter(line => line.trim());
    if (!lines.length) throw new Error('Cole ou importe os dados primeiro.');
    const first = lines[0];
    const delimiter = first.includes('\t') ? '\t' : first.includes(';') ? ';' : ',';
    let matrix = lines.map(line => splitLine(line, delimiter));
    let order = [0, 1, 2, 3];
    const header = matrix[0].map(c => c.toLowerCase().trim());
    if (header.some(c => ['x', 'vx', 'y', 'vy'].includes(c))) {
      if (header.length !== 4 || new Set(header).size !== 4 || !['x', 'vx', 'y', 'vy'].every(c => header.includes(c))) {
        throw new Error('O cabeçalho deve conter X, vX, Y e vY, uma vez cada.');
      }
      order = ['x', 'vx', 'y', 'vy'].map(c => header.indexOf(c));
      matrix.shift();
    }
    matrix = matrix.map((row, i) => {
      if (row.length !== 4) throw new Error(`Linha de dados ${i + 1}: esperadas 4 colunas. Com vírgula decimal, separe as colunas por ponto e vírgula ou tabulação.`);
      return order.map(j => row[j]);
    });
    validate(matrix);
    return matrix;
  }
  function regression(points, method = 'ordinary') {
    if (points.length < 2) throw new Error('O ajuste precisa de pelo menos dois pontos com X distintos.');
    if (!['ordinary', 'weighted'].includes(method)) throw new Error('Método de ajuste desconhecido.');
    const weighted = method === 'weighted';
    if (weighted && points.some(p => p.vy <= 0)) throw new Error('Para usar pesos 1/vY², todas as incertezas vY precisam ser maiores que zero.');
    // Normalize weights, then center coordinates to reduce cancellation and overflow.
    const minError = weighted ? points.reduce((m, p) => Math.min(m, p.vy), Infinity) : 1;
    const weights = points.map(p => weighted ? (minError / p.vy) ** 2 : 1);
    if (weights.some(w => w === 0)) throw new Error('As incertezas diferem demais entre si para um ajuste numericamente confiável.');
    const sumW = weights.reduce((a, b) => a + b, 0);
    const x0 = points[0].x, y0 = points[0].y;
    const mx = points.reduce((s, p, i) => s + weights[i] * (p.x - x0), 0) / sumW;
    const my = points.reduce((s, p, i) => s + weights[i] * (p.y - y0), 0) / sumW;
    let sxx = 0, sxy = 0, syy = 0;
    points.forEach((p, i) => {
      const dx = (p.x - x0) - mx, dy = (p.y - y0) - my;
      sxx += weights[i] * dx * dx;
      sxy += weights[i] * dx * dy;
      syy += weights[i] * dy * dy;
    });
    if (sxx === 0) throw new Error('Não é possível ajustar uma reta: todos os valores X são iguais.');
    const slope = sxy / sxx;
    const intercept = (y0 - slope * x0) + (my - slope * mx);
    const sse = points.reduce((s, p, i) => s + weights[i] * (((p.y - y0) - my) - slope * ((p.x - x0) - mx)) ** 2, 0);
    const r2 = syy === 0 ? null : 1 - sse / syy;
    if (![slope, intercept, sxx, syy, sse, ...(r2 === null ? [] : [r2])].every(Number.isFinite)) {
      throw new Error('Escala numérica excessiva para o ajuste. Revise as unidades dos valores.');
    }
    return {slope, intercept, r2, weighted, predict: x => y0 + my + slope * ((x - x0) - mx)};
  }
  function csv(points) {
    return '\uFEFFX;vX;Y;vY\r\n' + points.map(p => [p.x, p.vx, p.y, p.vy].map(n => String(n).replace('.', ',')).join(';')).join('\r\n') + '\r\n';
  }
  function powerCurve(points, c, n, x0) {
    if (![c, n, x0].every(Number.isFinite) || x0 <= 0) throw new Error('Informe C e n finitos e uma referência X₀ positiva.');
    if (points.some(p => p.x <= 0)) throw new Error('A curva de potência exige valores X positivos.');
    const min = points.reduce((m, p) => Math.min(m, p.x), Infinity);
    const max = points.reduce((m, p) => Math.max(m, p.x), -Infinity);
    if (!(max > min)) throw new Error('A curva precisa de pelo menos dois valores X distintos.');
    const x = Array.from({length: 301}, (_, i) => min + (max - min) * i / 300);
    const y = x.map(value => c * (value / x0) ** n);
    if (![...x, ...y].every(Number.isFinite)) throw new Error('Os parâmetros da curva excedem o intervalo numérico.');
    return {x, y, c, n, x0};
  }
  const api = {columns, MAX_ROWS, number, validate, parse, regression, csv, powerCurve};
  root.LabData = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
