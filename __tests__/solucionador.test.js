const {
  ehValido,
  estaResolvido,
  resolver,
  contarSolucoes,
  gerarSolucao,
  gerarPuzzle,
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

const PUZZLE = [
  [_, _, _, _, _, _],
  [_, 1, _, 0, 0, _],
  [_, _, _, _, _, _],
  [_, _, _, _, _, _],
  [_, 0, _, _, _, 0],
  [1, _, _, 1, _, 0],
];

const SEM_SOLUCAO = [
  [0, _, 0, _, 0, _],
  [0, _, 0, _, 0, _],
  [_, _, _, _, _, _],
  [_, _, _, _, _, _],
  [_, _, _, _, _, _],
  [_, _, _, _, _, _],
];

const vazia = () => Array.from({ length: 6 }, () => Array(6).fill(_));
const copia = (g) => g.map((l) => [...l]);

function rngComSemente(semente) {
  let s = semente;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

describe('resolver', () => {
  test('resolve o puzzle de solução única', () => {
    expect(resolver(PUZZLE)).toEqual(SOLUCAO);
  });

  test('não altera a grade recebida', () => {
    const g = copia(PUZZLE);
    resolver(g);
    expect(g).toEqual(PUZZLE);
  });

  test('mantém as pistas originais', () => {
    const r = resolver(PUZZLE);
    PUZZLE.forEach((linha, l) => linha.forEach((v, c) => {
      if (v !== null) expect(r[l][c]).toBe(v);
    }));
  });

  test('grade já resolvida retorna ela mesma (cópia)', () => {
    const r = resolver(SOLUCAO);
    expect(r).toEqual(SOLUCAO);
    expect(r).not.toBe(SOLUCAO);
  });

  test('resolve a grade vazia com alguma solução válida', () => {
    expect(estaResolvido(resolver(vazia()))).toBe(true);
  });

  test('retorna null quando não existe solução', () => {
    expect(ehValido(SEM_SOLUCAO)).toBe(true);
    expect(resolver(SEM_SOLUCAO)).toBeNull();
  });

  test('retorna null para grade que já viola as regras', () => {
    const g = vazia();
    g[0] = [1, 1, 1, _, _, _];
    expect(resolver(g)).toBeNull();
  });

  test('lança erro para grade com formato inválido', () => {
    expect(() => resolver([[0]])).toThrow();
  });
});

describe('contarSolucoes', () => {
  test('puzzle bem formado tem exatamente 1 solução', () => {
    expect(contarSolucoes(PUZZLE)).toBe(1);
  });

  test('grade sem solução retorna 0', () => {
    expect(contarSolucoes(SEM_SOLUCAO)).toBe(0);
  });

  test('para de contar ao atingir o limite (padrão 2)', () => {
    expect(contarSolucoes(vazia())).toBe(2);
    expect(contarSolucoes(vazia(), 10)).toBe(10);
  });

  test('grade resolvida tem 1 solução', () => {
    expect(contarSolucoes(SOLUCAO)).toBe(1);
  });
});

describe('gerarSolucao', () => {
  test('gera uma grade 6 x 6 completa e válida', () => {
    const g = gerarSolucao();
    expect(g).toHaveLength(6);
    g.forEach((l) => expect(l).toHaveLength(6));
    expect(estaResolvido(g)).toBe(true);
  });

  test('é determinística para o mesmo rng', () => {
    expect(gerarSolucao(rngComSemente(5))).toEqual(gerarSolucao(rngComSemente(5)));
  });

  test('gera grades variadas', () => {
    const vistas = new Set();
    for (let i = 1; i <= 10; i++) vistas.add(JSON.stringify(gerarSolucao(rngComSemente(i * 97))));
    expect(vistas.size).toBeGreaterThan(1);
  });
});

describe('gerarPuzzle', () => {
  const { puzzle, solucao } = gerarPuzzle(rngComSemente(2024));

  test('retorna { puzzle, solucao } no formato 6 x 6', () => {
    expect(puzzle).toHaveLength(6);
    expect(solucao).toHaveLength(6);
  });

  test('a solução é válida e completa', () => {
    expect(estaResolvido(solucao)).toBe(true);
  });

  test('o puzzle tem células vazias e é válido', () => {
    expect(puzzle.flat().some((v) => v === null)).toBe(true);
    expect(ehValido(puzzle)).toBe(true);
  });

  test('as pistas do puzzle batem com a solução', () => {
    puzzle.forEach((linha, l) => linha.forEach((v, c) => {
      if (v !== null) expect(v).toBe(solucao[l][c]);
    }));
  });

  test('o puzzle tem solução única, igual à solução retornada', () => {
    expect(contarSolucoes(puzzle)).toBe(1);
    expect(resolver(puzzle)).toEqual(solucao);
  });
});
