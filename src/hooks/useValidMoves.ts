import { Move, PieceState, Position } from '../types';

export const useValidMoves = (
  pieces: (PieceState | null)[][],
  lastPawnMove: Move | null
) => {
  const isValidPosition = (row: number, col: number) => {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  };

  const isEnemyPiece = (
    row: number,
    col: number,
    currentColor: 'white' | 'black'
  ) => {
    const piece = pieces[row][col];
    return piece && piece.color !== currentColor;
  };

  const getPawnMoves = (row: number, col: number, color: 'white' | 'black') => {
    const moves: Position[] = [];
    const direction = color === 'white' ? -1 : 1;
    const startRow = color === 'white' ? 6 : 1;

    // Forward move
    if (
      isValidPosition(row + direction, col) &&
      !pieces[row + direction][col]
    ) {
      moves.push({ row: row + direction, col });

      // Double move from starting position
      if (
        row === startRow &&
        isValidPosition(row + 2 * direction, col) &&
        !pieces[row + 2 * direction][col]
      ) {
        moves.push({ row: row + 2 * direction, col });
      }
    }

    // Regular captures
    const captureSquares = [
      { row: row + direction, col: col - 1 },
      { row: row + direction, col: col + 1 },
    ];

    captureSquares.forEach(({ row: r, col: c }) => {
      if (isValidPosition(r, c) && isEnemyPiece(r, c, color)) {
        moves.push({ row: r, col: c });
      }
    });

    // En passant
    if (
      lastPawnMove &&
      row === (color === 'white' ? 3 : 4) && // Check if pawn is on correct rank
      Math.abs(lastPawnMove.from.row - lastPawnMove.to.row) === 2 && // Check if last move was a double pawn push
      lastPawnMove.to.row === row && // Check if enemy pawn is on same rank
      Math.abs(col - lastPawnMove.to.col) === 1 && // Check if enemy pawn is on adjacent file
      lastPawnMove.piece.color !== color
    ) {
      // Check if it was enemy's pawn
      moves.push({ row: row + direction, col: lastPawnMove.to.col });
    }

    return moves;
  };

  const getRookMoves = (row: number, col: number, color: 'white' | 'black') => {
    const moves: Position[] = [];
    const directions = [
      [-1, 0], // up
      [1, 0], // down
      [0, -1], // left
      [0, 1], // right
    ];

    directions.forEach(([dRow, dCol]) => {
      let currentRow = row + dRow;
      let currentCol = col + dCol;

      while (isValidPosition(currentRow, currentCol)) {
        if (!pieces[currentRow][currentCol]) {
          moves.push({ row: currentRow, col: currentCol });
        } else if (isEnemyPiece(currentRow, currentCol, color)) {
          moves.push({ row: currentRow, col: currentCol });
          break;
        } else {
          break;
        }
        currentRow += dRow;
        currentCol += dCol;
      }
    });

    return moves;
  };

  const getKnightMoves = (
    row: number,
    col: number,
    color: 'white' | 'black'
  ) => {
    const moves: Position[] = [];
    const knightMoves = [
      [-2, -1],
      [-2, 1],
      [-1, -2],
      [-1, 2],
      [1, -2],
      [1, 2],
      [2, -1],
      [2, 1],
    ];

    knightMoves.forEach(([dRow, dCol]) => {
      const newRow = row + dRow;
      const newCol = col + dCol;

      if (
        isValidPosition(newRow, newCol) &&
        (!pieces[newRow][newCol] || isEnemyPiece(newRow, newCol, color))
      ) {
        moves.push({ row: newRow, col: newCol });
      }
    });

    return moves;
  };

  const getBishopMoves = (
    row: number,
    col: number,
    color: 'white' | 'black'
  ) => {
    const moves: Position[] = [];
    const directions = [
      [-1, -1], // up-left
      [-1, 1], // up-right
      [1, -1], // down-left
      [1, 1], // down-right
    ];

    directions.forEach(([dRow, dCol]) => {
      let currentRow = row + dRow;
      let currentCol = col + dCol;

      while (isValidPosition(currentRow, currentCol)) {
        if (!pieces[currentRow][currentCol]) {
          moves.push({ row: currentRow, col: currentCol });
        } else if (isEnemyPiece(currentRow, currentCol, color)) {
          moves.push({ row: currentRow, col: currentCol });
          break;
        } else {
          break;
        }
        currentRow += dRow;
        currentCol += dCol;
      }
    });

    return moves;
  };

  const getQueenMoves = (
    row: number,
    col: number,
    color: 'white' | 'black'
  ) => {
    return [
      ...getRookMoves(row, col, color),
      ...getBishopMoves(row, col, color),
    ];
  };

  const getKingMoves = (row: number, col: number, color: 'white' | 'black') => {
    const moves: Position[] = [];
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    directions.forEach(([dRow, dCol]) => {
      const newRow = row + dRow;
      const newCol = col + dCol;

      if (
        isValidPosition(newRow, newCol) &&
        (!pieces[newRow][newCol] || isEnemyPiece(newRow, newCol, color))
      ) {
        moves.push({ row: newRow, col: newCol });
      }
    });

    // TODO: Add castling logic here

    return moves;
  };

  const getValidMoves = (row: number, col: number): Position[] => {
    const piece = pieces[row][col];
    if (!piece) return [];

    switch (piece.type) {
      case 'pawn':
        return getPawnMoves(row, col, piece.color);
      case 'rook':
        return getRookMoves(row, col, piece.color);
      case 'knight':
        return getKnightMoves(row, col, piece.color);
      case 'bishop':
        return getBishopMoves(row, col, piece.color);
      case 'queen':
        return getQueenMoves(row, col, piece.color);
      case 'king':
        return getKingMoves(row, col, piece.color);
      default:
        return [];
    }
  };

  return { getValidMoves };
};
