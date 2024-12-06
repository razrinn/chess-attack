import { useState, useEffect } from 'react';

type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
type PieceColor = 'white' | 'black';

interface PieceState {
  type: PieceType;
  color: PieceColor;
}

interface DominationCount {
  white: number;
  black: number;
}

export const useDomination = (pieces: (PieceState | null)[][]) => {
  const [domination, setDomination] = useState<DominationCount[][]>(() =>
    Array(8)
      .fill(null)
      .map(() => Array(8).fill({ white: 0, black: 0 }))
  );

  const isValidPosition = (row: number, col: number) => {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  };

  const addDomination = (
    newDomination: DominationCount[][],
    row: number,
    col: number,
    color: PieceColor
  ) => {
    if (isValidPosition(row, col)) {
      newDomination[row][col][color]++;
    }
  };

  const calculatePawnDomination = (
    newDomination: DominationCount[][],
    row: number,
    col: number,
    color: PieceColor
  ) => {
    const direction = color === 'white' ? -1 : 1;
    if (isValidPosition(row + direction, col - 1)) {
      addDomination(newDomination, row + direction, col - 1, color);
    }
    if (isValidPosition(row + direction, col + 1)) {
      addDomination(newDomination, row + direction, col + 1, color);
    }
  };

  const calculateRookDomination = (
    newDomination: DominationCount[][],
    row: number,
    col: number,
    color: PieceColor
  ) => {
    // Up
    for (let i = row - 1; i >= 0; i--) {
      addDomination(newDomination, i, col, color);
      if (pieces[i][col] !== null) break;
    }
    // Down
    for (let i = row + 1; i < 8; i++) {
      addDomination(newDomination, i, col, color);
      if (pieces[i][col] !== null) break;
    }
    // Left
    for (let j = col - 1; j >= 0; j--) {
      addDomination(newDomination, row, j, color);
      if (pieces[row][j] !== null) break;
    }
    // Right
    for (let j = col + 1; j < 8; j++) {
      addDomination(newDomination, row, j, color);
      if (pieces[row][j] !== null) break;
    }
  };

  const calculateKnightDomination = (
    newDomination: DominationCount[][],
    row: number,
    col: number,
    color: PieceColor
  ) => {
    const moves = [
      [-2, -1],
      [-2, 1],
      [-1, -2],
      [-1, 2],
      [1, -2],
      [1, 2],
      [2, -1],
      [2, 1],
    ];

    moves.forEach(([dRow, dCol]) => {
      addDomination(newDomination, row + dRow, col + dCol, color);
    });
  };

  const calculateBishopDomination = (
    newDomination: DominationCount[][],
    row: number,
    col: number,
    color: PieceColor
  ) => {
    // Up-Right
    for (let i = 1; row - i >= 0 && col + i < 8; i++) {
      addDomination(newDomination, row - i, col + i, color);
      if (pieces[row - i][col + i] !== null) break;
    }
    // Up-Left
    for (let i = 1; row - i >= 0 && col - i >= 0; i++) {
      addDomination(newDomination, row - i, col - i, color);
      if (pieces[row - i][col - i] !== null) break;
    }
    // Down-Right
    for (let i = 1; row + i < 8 && col + i < 8; i++) {
      addDomination(newDomination, row + i, col + i, color);
      if (pieces[row + i][col + i] !== null) break;
    }
    // Down-Left
    for (let i = 1; row + i < 8 && col - i >= 0; i++) {
      addDomination(newDomination, row + i, col - i, color);
      if (pieces[row + i][col - i] !== null) break;
    }
  };

  const calculateKingDomination = (
    newDomination: DominationCount[][],
    row: number,
    col: number,
    color: PieceColor
  ) => {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        addDomination(newDomination, row + i, col + j, color);
      }
    }
  };

  const calculateDomination = () => {
    const newDomination: DominationCount[][] = Array(8)
      .fill(null)
      .map(() =>
        Array(8)
          .fill(null)
          .map(() => ({ white: 0, black: 0 }))
      );

    pieces.forEach((row, rowIndex) => {
      row.forEach((piece, colIndex) => {
        if (!piece) return;

        switch (piece.type) {
          case 'pawn':
            calculatePawnDomination(
              newDomination,
              rowIndex,
              colIndex,
              piece.color
            );
            break;
          case 'rook':
            calculateRookDomination(
              newDomination,
              rowIndex,
              colIndex,
              piece.color
            );
            break;
          case 'knight':
            calculateKnightDomination(
              newDomination,
              rowIndex,
              colIndex,
              piece.color
            );
            break;
          case 'bishop':
            calculateBishopDomination(
              newDomination,
              rowIndex,
              colIndex,
              piece.color
            );
            break;
          case 'queen':
            calculateRookDomination(
              newDomination,
              rowIndex,
              colIndex,
              piece.color
            );
            calculateBishopDomination(
              newDomination,
              rowIndex,
              colIndex,
              piece.color
            );
            break;
          case 'king':
            calculateKingDomination(
              newDomination,
              rowIndex,
              colIndex,
              piece.color
            );
            break;
        }
      });
    });

    setDomination(newDomination);
  };

  const getDominationStyle = (count: DominationCount) => {
    if (count.white === 0 && count.black === 0) return '';
    if (count.white > count.black) return 'bg-blue-500/30';
    if (count.black > count.white) return 'bg-red-500/30';
    return 'bg-purple-500/30';
  };

  const getDominationText = (count: DominationCount) => {
    if (count.white === 0 && count.black === 0) return '';
    if (count.white === 0) return `B${count.black}`;
    if (count.black === 0) return `W${count.white}`;
    return `W${count.white}:B${count.black}`;
  };

  useEffect(() => {
    calculateDomination();
  }, [pieces]);

  return {
    domination,
    getDominationStyle,
    getDominationText,
  };
};
