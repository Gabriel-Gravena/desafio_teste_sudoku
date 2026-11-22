/**
 * Sudoku Binário (Takuzu / Binairo) 6 x 6 — regras.
 *
 * Cada célula vale 0, 1 ou null (vazia). Uma grade resolvida obedece:
 *   1. No máximo DOIS números iguais seguidos (sem 000 ou 111) em linhas e colunas;
 *   2. Cada linha e cada coluna tem a mesma quantidade de 0 e 1 (3 de cada);
 *   3. Não existem duas linhas iguais nem duas colunas iguais.
 * Em grades parciais, as regras valem para o que já foi preenchido:
 *   - nenhuma linha/coluna pode ter mais de 3 zeros ou mais de 3 uns;
 *   - linhas/colunas duplicadas só contam quando ambas estão completas.
 */
const {
  TAMANHO,
  VAZIO,
  temTresConsecutivos,
  contagemValida,
  linhasDuplicadas,
  colunasDuplicadas,
  ehValido,
  estaCompleto,
  estaResolvido,
} = require('../src/sudokuBinario');

const _ = null;

const SOLUCAO = [
  [0, 0, 1, 0, 1, 1],
  [0, 1, 1, 0, 0, 1],
  [1, 0, 0, 1, 1, 0],
  [0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0],
  [1, 1, 0, 1, 0, 0],
];

const vazia = () => Array.from({ length: 6 }, () => Array(6).fill(_));
const copia = (g) => g.map((l) => [...l]);

describe('constantes', () => {
  test('tamanho 6 e célula vazia = null', () => {
    expect(TAMANHO).toBe(6);
    expect(VAZIO).toBeNull();
  });
});

describe('temTresConsecutivos', () => {
  test.each([
    [[0, 0, 0, 1, 1, 1], true],
    [[1, 0, 1, 1, 1, 0], true],
    [[0, 1, 1, 0, 0, 0], true],
    [[0, 0, 1, 1, 0, 1], false],
    [[0, 1, 0, 1, 0, 1], false],
    [[1, 1, _, 1, 1, _], false],
    [[_, _, _, _, _, _], false],
    [[_, 1, 1, 1, _, _], true],
  ])('%j => %s', (linha, esperado) => {
    expect(temTresConsecutivos(linha)).toBe(esperado);
  });
});

describe('contagemValida', () => {
  test.each([
    [[0, 0, 1, 1, 0, 1], true],
    [[0, 0, 0, 1, 1, 1], true], // contagem ok (a regra de 3 seguidos é outra)
    [[0, 0, 1, 0, 0, 1], false], // 4 zeros
    [[1, 1, 0, 1, 1, 1], false], // 5 uns
    [[0, _, 0, _, 0, _], true],
    [[1, _, 1, 1, _, 1], false],
    [[_, _, _, _, _, _], true],
  ])('%j => %s', (linha, esperado) => {
    expect(contagemValida(linha)).toBe(esperado);
  });
});

describe('linhasDuplicadas / colunasDuplicadas', () => {
  test('solução válida não tem duplicadas', () => {
    expect(linhasDuplicadas(SOLUCAO)).toBe(false);
    expect(colunasDuplicadas(SOLUCAO)).toBe(false);
  });

  test('detecta duas linhas completas iguais', () => {
    const g = vazia();
    g[0] = [0, 1, 0, 1, 0, 1];
    g[4] = [0, 1, 0, 1, 0, 1];
    expect(linhasDuplicadas(g)).toBe(true);
  });

  test('linhas incompletas não contam como duplicadas', () => {
    const g = vazia();
    g[0] = [0, 1, 0, 1, 0, _];
    g[1] = [0, 1, 0, 1, 0, _];
    expect(linhasDuplicadas(g)).toBe(false);
  });

  test('detecta duas colunas completas iguais', () => {
    const g = vazia();
    [1, 1, 0, 1, 0, 0].forEach((v, l) => { g[l][0] = v; g[l][5] = v; });
    expect(colunasDuplicadas(g)).toBe(true);
    expect(linhasDuplicadas(g)).toBe(false);
  });
});

describe('ehValido', () => {
  test('grade vazia é válida', () => {
    expect(ehValido(vazia())).toBe(true);
  });

  test('a solução de referência é válida', () => {
    expect(ehValido(SOLUCAO)).toBe(true);
  });

  test('grade parcial sem conflitos é válida', () => {
    const g = vazia();
    g[0] = [0, 0, 1, _, _, _];
    g[1][0] = 1;
    expect(ehValido(g)).toBe(true);
  });

  test('três iguais seguidos na linha é inválido', () => {
    const g = vazia();
    g[2] = [_, 1, 1, 1, _, _];
    expect(ehValido(g)).toBe(false);
  });

  test('três iguais seguidos na coluna é inválido', () => {
    const g = vazia();
    g[3][4] = 0;
    g[4][4] = 0;
    g[5][4] = 0;
    expect(ehValido(g)).toBe(false);
  });

  test('mais de 3 zeros numa linha é inválido', () => {
    const g = vazia();
    g[0] = [0, _, 0, 0, _, 0];
    expect(ehValido(g)).toBe(false);
  });

  test('mais de 3 uns numa coluna é inválido', () => {
    const g = vazia();
    [1, _, 1, 1, _, 1].forEach((v, l) => { g[l][2] = v; });
    expect(ehValido(g)).toBe(false);
  });

  test('linhas completas iguais tornam a grade inválida', () => {
    const g = vazia();
    g[0] = [0, 1, 1, 0, 0, 1];
    g[3] = [0, 1, 1, 0, 0, 1];
    expect(ehValido(g)).toBe(false);
  });

  test('colunas completas iguais tornam a grade inválida', () => {
    const g = vazia();
    [0, 1, 0, 0, 1, 1].forEach((v, l) => { g[l][1] = v; g[l][3] = v; });
    expect(ehValido(g)).toBe(false);
  });

  test('não altera a grade recebida', () => {
    const g = copia(SOLUCAO);
    ehValido(g);
    expect(g).toEqual(SOLUCAO);
  });

  test('lança erro para grade que não é 6 x 6', () => {
    expect(() => ehValido([[0, 1], [1, 0]])).toThrow();
    expect(() => ehValido(SOLUCAO.slice(0, 5))).toThrow();
    expect(() => ehValido(SOLUCAO.map((l) => l.slice(0, 5)))).toThrow();
    expect(() => ehValido(null)).toThrow();
  });

  test('lança erro para valores diferentes de 0, 1 e null', () => {
    const g = vazia();
    g[0][0] = 2;
    expect(() => ehValido(g)).toThrow();
    g[0][0] = '1';
    expect(() => ehValido(g)).toThrow();
    g[0][0] = undefined;
    expect(() => ehValido(g)).toThrow();
  });
});

describe('estaCompleto / estaResolvido', () => {
  test('grade vazia não está completa nem resolvida', () => {
    expect(estaCompleto(vazia())).toBe(false);
    expect(estaResolvido(vazia())).toBe(false);
  });

  test('solução válida está completa e resolvida', () => {
    expect(estaCompleto(SOLUCAO)).toBe(true);
    expect(estaResolvido(SOLUCAO)).toBe(true);
  });

  test('basta uma célula vazia para não estar completa', () => {
    const g = copia(SOLUCAO);
    g[5][5] = _;
    expect(estaCompleto(g)).toBe(false);
    expect(estaResolvido(g)).toBe(false);
  });

  test('grade completa mas inválida não está resolvida', () => {
    const g = copia(SOLUCAO);
    g[0][0] = 1; // linha 0 passa a ter 4 uns
    expect(estaCompleto(g)).toBe(true);
    expect(estaResolvido(g)).toBe(false);
  });

  test('grade completa com contagem certa mas linhas repetidas não está resolvida', () => {
    const g = [
      [0, 0, 1, 0, 1, 1],
      [0, 0, 1, 0, 1, 1],
      [1, 1, 0, 1, 0, 0],
      [1, 1, 0, 1, 0, 0],
      [0, 0, 1, 0, 1, 1],
      [1, 1, 0, 1, 0, 0],
    ];
    expect(estaResolvido(g)).toBe(false);
  });
});
