# Desafio de testes: Sudoku Binário 6 x 6

Este repositório tem **apenas os casos de teste** (Jest). O desafio é implementar `src/sudokuBinario.js` até que todos passem.

```bash
npm install
npm test
```

> Sem a implementação, os testes falham com `Cannot find module`, e isso é esperado.

## Regras (Takuzu / Binairo)

Cada célula vale `0`, `1` ou `null` (vazia). Uma grade resolvida segue três regras:

1. Não pode haver **três números iguais seguidos** em uma linha ou coluna.
2. Cada linha e cada coluna tem **três 0 e três 1**.
3. Não existem **duas linhas iguais** nem **duas colunas iguais**.

Em grades parciais, nenhuma linha ou coluna pode passar de três 0 ou três 1. Linhas ou colunas repetidas só contam quando as duas estão completas.

## API esperada (`src/sudokuBinario.js`, CommonJS)

| Export | Descrição |
|---|---|
| `TAMANHO` (6), `VAZIO` (`null`) | Constantes |
| `temTresConsecutivos(linha)` | `boolean` |
| `contagemValida(linha)` | Nenhum valor aparece mais de 3 vezes |
| `linhasDuplicadas(g)`, `colunasDuplicadas(g)` | Comparam só linhas ou colunas completas |
| `ehValido(g)` | A grade (parcial ou completa) não viola nenhuma regra |
| `estaCompleto(g)`, `estaResolvido(g)` | Completa, e completa e válida |
| `resolver(g)` | Nova grade resolvida, ou `null`. Não altera a grade recebida |
| `contarSolucoes(g, limite = 2)` | Para de contar ao atingir o limite |
| `gerarSolucao(rng?)` | Grade completa e válida |
| `gerarPuzzle(rng?)` | `{ puzzle, solucao }`, com solução única |
| `SudokuBinario` | Classe do jogo (veja abaixo) |

`new SudokuBinario(gradeInicial)`: as células preenchidas na grade inicial ficam **fixas**.

- Métodos: `jogar(l, c, 0 | 1 | null)`, `limpar(l, c)`, `obterValor(l, c)`, `obterGrade()` (cópia), `ehFixa(l, c)`, `ehValido()`, `estaCompleto()`, `estaResolvido()`.
- Uma grade que não é 6 x 6, ou que tem valores diferentes de `0`, `1` e `null`, lança erro.
- Coordenadas fora da grade lançam `RangeError`.
