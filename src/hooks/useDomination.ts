import { useState, useEffect } from 'react';
import { PieceColor, PieceType } from '../types';

interface PieceState {
  type: PieceType;
  color: PieceColor;
}

interface DominationCount {
  white: number;
  black: number;
  whitePieces: { type: PieceType; value: number }[];
  blackPieces: { type: PieceType; value: number }[];
}

const PIECE_VALUES = {
  pawn: 1,
  bishop: 3,
  knight: 3,
  rook: 5,
  queen: 9,
  king: 0,
};

export const useDomination = (pieces: (PieceState | null)[][]) => {
  const [domination, setDomination] = useState<DominationCount[][]>(() =>
    Array(8)
      .fill(null)
      .map(() =>
        Array(8)
          .fill(null)
          .map(() => ({
            white: 0,
            black: 0,
            whitePieces: [],
            blackPieces: [],
          }))
      )
  );

  const isValidPosition = (row: number, col: number) => {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  };

  const addDomination = (
    newDomination: DominationCount[][],
    row: number,
    col: number,
    color: PieceColor,
    pieceType: PieceType
  ) => {
    if (isValidPosition(row, col)) {
      newDomination[row][col][color]++;
      newDomination[row][col][`${color}Pieces`].push({
        type: pieceType,
        value: PIECE_VALUES[pieceType],
      });
    }
  };

  const calculatePawnDomination = (
    newDomination: DominationCount[][],
    row: number,
    col: number,
    color: PieceColor
  ) => {
    const direction = color === 'white' ? -1 : 1;

    // Only calculate attack squares (diagonals)
    const attackSquares = [
      { row: row + direction, col: col - 1 },
      { row: row + direction, col: col + 1 },
    ];

    attackSquares.forEach(({ row: newRow, col: newCol }) => {
      if (isValidPosition(newRow, newCol)) {
        addDomination(newDomination, newRow, newCol, color, 'pawn');
      }
    });
  };

  const calculateRookDomination = (
    newDomination: DominationCount[][],
    row: number,
    col: number,
    color: PieceColor
  ) => {
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
        const pieceAtSquare = pieces[currentRow][currentCol];

        // Add domination to this square
        addDomination(newDomination, currentRow, currentCol, color, 'rook');

        // Stop if we hit any piece (after adding domination to that square)
        if (pieceAtSquare !== null) {
          break;
        }

        currentRow += dRow;
        currentCol += dCol;
      }
    });
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
      const newRow = row + dRow;
      const newCol = col + dCol;
      if (isValidPosition(newRow, newCol)) {
        addDomination(newDomination, newRow, newCol, color, 'knight');
      }
    });
  };

  const calculateBishopDomination = (
    newDomination: DominationCount[][],
    row: number,
    col: number,
    color: PieceColor
  ) => {
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
        // Add domination to this square
        addDomination(newDomination, currentRow, currentCol, color, 'bishop');

        // Stop if we hit any piece (after adding domination to that square)
        if (pieces[currentRow][currentCol] !== null) {
          break;
        }

        currentRow += dRow;
        currentCol += dCol;
      }
    });
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
        addDomination(newDomination, row + i, col + j, color, 'king');
      }
    }
  };

  const calculateQueenDomination = (
    newDomination: DominationCount[][],
    row: number,
    col: number,
    color: PieceColor
  ) => {
    const directions = [
      [-1, -1], // up-left
      [-1, 0], // up
      [-1, 1], // up-right
      [0, -1], // left
      [0, 1], // right
      [1, -1], // down-left
      [1, 0], // down
      [1, 1], // down-right
    ];

    directions.forEach(([dRow, dCol]) => {
      let currentRow = row + dRow;
      let currentCol = col + dCol;

      while (isValidPosition(currentRow, currentCol)) {
        // Add domination to this square
        addDomination(newDomination, currentRow, currentCol, color, 'queen');

        // Stop if we hit any piece (after adding domination to that square)
        if (pieces[currentRow][currentCol] !== null) {
          break;
        }

        currentRow += dRow;
        currentCol += dCol;
      }
    });
  };

  const calculateDomination = () => {
    const newDomination: DominationCount[][] = Array(8)
      .fill(null)
      .map(() =>
        Array(8)
          .fill(null)
          .map(() => ({
            white: 0,
            black: 0,
            whitePieces: [],
            blackPieces: [],
          }))
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
            calculateQueenDomination(
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
