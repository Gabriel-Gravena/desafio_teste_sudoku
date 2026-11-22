/**
 * Sudoku Binário 6 x 6 — classe de jogo.
 *
 * new SudokuBinario(gradeInicial): células preenchidas na grade inicial são FIXAS.
 */
const { SudokuBinario } = require('../src/sudokuBinario');

const _ = null;

const SOLUCAO = [
  [0, 0, 1, 0, 1, 1],
  [0, 1, 1, 0, 0, 1],
  [1, 0, 0, 1, 1, 0],
  [0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0],
  [1, 1, 0, 1, 0, 0],
];

const PUZZLE = [
  [_, _, _, _, _, _],
  [_, 1, _, 0, 0, _],
  [_, _, _, _, _, _],
  [_, _, _, _, _, _],
  [_, 0, _, _, _, 0],
  [1, _, _, 1, _, 0],
];

const copia = (g) => g.map((l) => [...l]);

function preencherComSolucao(jogo) {
  SOLUCAO.forEach((linha, l) => linha.forEach((v, c) => {
    if (!jogo.ehFixa(l, c)) jogo.jogar(l, c, v);
  }));
}

describe('criação', () => {
  test('aceita uma grade 6 x 6 válida', () => {
    expect(() => new SudokuBinario(PUZZLE)).not.toThrow();
  });

  test('rejeita grade com tamanho errado', () => {
    expect(() => new SudokuBinario([[0, 1], [1, 0]])).toThrow();
  });

  test('rejeita grade com valores inválidos', () => {
    const g = copia(PUZZLE);
    g[0][0] = 7;
    expect(() => new SudokuBinario(g)).toThrow();
  });

  test('rejeita grade inicial que já viola as regras', () => {
    const g = copia(PUZZLE);
    g[0] = [1, 1, 1, _, _, _];
    expect(() => new SudokuBinario(g)).toThrow();
  });

  test('não guarda referência para a grade original', () => {
    const g = copia(PUZZLE);
    const jogo = new SudokuBinario(g);
    g[0][0] = 1;
    expect(jogo.obterValor(0, 0)).toBeNull();
  });
});

describe('células fixas', () => {
  const jogo = new SudokuBinario(PUZZLE);

  test('ehFixa identifica as pistas iniciais', () => {
    expect(jogo.ehFixa(1, 1)).toBe(true);
    expect(jogo.ehFixa(5, 0)).toBe(true);
    expect(jogo.ehFixa(0, 0)).toBe(false);
  });

  test('não é possível alterar uma célula fixa', () => {
    expect(() => jogo.jogar(1, 1, 0)).toThrow();
    expect(() => jogo.jogar(1, 1, null)).toThrow();
    expect(jogo.obterValor(1, 1)).toBe(1);
  });
});

describe('jogar', () => {
  let jogo;
  beforeEach(() => { jogo = new SudokuBinario(PUZZLE); });

  test('preenche uma célula vazia com 0 ou 1', () => {
    jogo.jogar(0, 0, 0);
    jogo.jogar(0, 1, 1);
    expect(jogo.obterValor(0, 0)).toBe(0);
    expect(jogo.obterValor(0, 1)).toBe(1);
  });

  test('permite sobrescrever uma jogada anterior', () => {
    jogo.jogar(0, 0, 0);
    jogo.jogar(0, 0, 1);
    expect(jogo.obterValor(0, 0)).toBe(1);
  });

  test('null apaga a célula; limpar faz o mesmo', () => {
    jogo.jogar(0, 0, 1);
    jogo.jogar(0, 0, null);
    expect(jogo.obterValor(0, 0)).toBeNull();
    jogo.jogar(0, 1, 1);
    jogo.limpar(0, 1);
    expect(jogo.obterValor(0, 1)).toBeNull();
  });

  test.each([2, -1, '0', '1', true, undefined, 0.5])('rejeita o valor %p', (valor) => {
    expect(() => jogo.jogar(0, 0, valor)).toThrow();
  });

  test('lança RangeError fora da grade', () => {
    expect(() => jogo.jogar(6, 0, 1)).toThrow(RangeError);
    expect(() => jogo.jogar(0, 6, 1)).toThrow(RangeError);
    expect(() => jogo.jogar(-1, 0, 1)).toThrow(RangeError);
    expect(() => jogo.obterValor(0, 9)).toThrow(RangeError);
    expect(() => jogo.ehFixa(9, 0)).toThrow(RangeError);
  });

  test('permite jogadas que quebram as regras, mas ehValido acusa', () => {
    jogo.jogar(0, 0, 1);
    jogo.jogar(0, 1, 1);
    jogo.jogar(0, 2, 1);
    expect(jogo.ehValido()).toBe(false);
  });

  test('obterGrade retorna uma cópia', () => {
    const g = jogo.obterGrade();
    g[0][0] = 1;
    expect(jogo.obterValor(0, 0)).toBeNull();
    expect(jogo.obterGrade()).toEqual(PUZZLE);
  });
});

describe('fim de jogo', () => {
  test('o puzzle inicial não está resolvido', () => {
    const jogo = new SudokuBinario(PUZZLE);
    expect(jogo.estaCompleto()).toBe(false);
    expect(jogo.estaResolvido()).toBe(false);
    expect(jogo.ehValido()).toBe(true);
  });

  test('preenchendo com a solução, o jogo fica resolvido', () => {
    const jogo = new SudokuBinario(PUZZLE);
    preencherComSolucao(jogo);
    expect(jogo.estaCompleto()).toBe(true);
    expect(jogo.estaResolvido()).toBe(true);
    expect(jogo.obterGrade()).toEqual(SOLUCAO);
  });

  test('grade completa com um erro não está resolvida', () => {
    const jogo = new SudokuBinario(PUZZLE);
    preencherComSolucao(jogo);
    jogo.jogar(0, 0, 1);
    expect(jogo.estaCompleto()).toBe(true);
    expect(jogo.estaResolvido()).toBe(false);
  });

  test('apagar uma célula de um jogo resolvido o torna incompleto', () => {
    const jogo = new SudokuBinario(PUZZLE);
    preencherComSolucao(jogo);
    jogo.limpar(0, 0);
    expect(jogo.estaResolvido()).toBe(false);
  });
});
