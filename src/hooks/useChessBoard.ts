import { useState } from 'react';
import { useValidMoves } from './useValidMoves';

type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
type PieceColor = 'white' | 'black';

interface PieceState {
  type: PieceType;
  color: PieceColor;
}

interface Position {
  row: number;
  col: number;
}

interface Move {
  from: Position;
  to: Position;
  piece: {
    type: PieceType;
    color: PieceColor;
  };
}

const getInitialBoard = () => {
  const initialBoard: (PieceState | null)[][] = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null));

  // Initialize black pieces
  initialBoard[0] = [
    { type: 'rook', color: 'black' },
    { type: 'knight', color: 'black' },
    { type: 'bishop', color: 'black' },
    { type: 'queen', color: 'black' },
    { type: 'king', color: 'black' },
    { type: 'bishop', color: 'black' },
    { type: 'knight', color: 'black' },
    { type: 'rook', color: 'black' },
  ];
  initialBoard[1] = Array(8).fill({ type: 'pawn', color: 'black' });

  // Initialize white pieces
  initialBoard[6] = Array(8).fill({ type: 'pawn', color: 'white' });
  initialBoard[7] = [
    { type: 'rook', color: 'white' },
    { type: 'knight', color: 'white' },
    { type: 'bishop', color: 'white' },
    { type: 'queen', color: 'white' },
    { type: 'king', color: 'white' },
    { type: 'bishop', color: 'white' },
    { type: 'knight', color: 'white' },
    { type: 'rook', color: 'white' },
  ];

  return initialBoard;
};

export const useChessBoard = () => {
  const [pieces, setPieces] =
    useState<(PieceState | null)[][]>(getInitialBoard);
  const [moves, setMoves] = useState<Move[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const { getValidMoves } = useValidMoves(pieces, null);

  const handleMoveSelect = (index: number) => {
    if (index < -1 || index >= moves.length) return;

    setCurrentMoveIndex(index);
    if (index === -1) {
      setPieces(getInitialBoard());
    } else {
      // Replay moves up to the selected index
      const newBoard = getInitialBoard();
      for (let i = 0; i <= index; i++) {
        const move = moves[i];
        newBoard[move.to.row][move.to.col] = {
          type: move.piece.type,
          color: move.piece.color,
        };
        newBoard[move.from.row][move.from.col] = null;
      }
      setPieces(newBoard);
    }
  };

  const makeMove = (from: Position, to: Position) => {
    const piece = pieces[from.row][from.col];
    if (!piece) return;

    // Check if the move is valid
    const validMoves = getValidMoves(from.row, from.col);
    const isValidMove = validMoves.some(
      (move) => move.row === to.row && move.col === to.col
    );

    if (!isValidMove) return;

    const newPieces = pieces.map((row) => [...row]);
    newPieces[to.row][to.col] = piece;
    newPieces[from.row][from.col] = null;

    // Handle castling
    if (piece.type === 'king' && Math.abs(to.col - from.col) === 2) {
      const isKingsideCastle = to.col > from.col;
      const rookFromCol = isKingsideCastle ? 7 : 0;
      const rookToCol = isKingsideCastle ? 5 : 3;

      // Move the rook
      newPieces[to.row][rookToCol] = newPieces[to.row][rookFromCol];
      newPieces[to.row][rookFromCol] = null;
    }

    // If we're not at the latest move, truncate the move history
    const newMoves = moves.slice(0, currentMoveIndex + 1);
    newMoves.push({
      from,
      to,
      piece: { type: piece.type, color: piece.color },
    });

    setPieces(newPieces);
    setMoves(newMoves);
    setCurrentMoveIndex(newMoves.length - 1);
    setSelectedPiece(null);
    setValidMoves([]);
  };

  const handleSquareClick = (row: number, col: number) => {
    if (selectedPiece) {
      if (selectedPiece.row === row && selectedPiece.col === col) {
        // Clicking the same piece deselects it
        setSelectedPiece(null);
        setValidMoves([]);
      } else if (pieces[row][col]) {
        // Clicking another piece changes selection to that piece
        setSelectedPiece({ row, col });
        setValidMoves(getValidMoves(row, col));
      } else {
        // Clicking an empty square attempts to make a move
        makeMove(selectedPiece, { row, col });
        setSelectedPiece(null);
        setValidMoves([]);
      }
    } else if (pieces[row][col]) {
      setSelectedPiece({ row, col });
      setValidMoves(getValidMoves(row, col));
    }
  };

  const getSquareHighlight = (row: number, col: number) => {
    if (
      selectedPiece &&
      selectedPiece.row === row &&
      selectedPiece.col === col
    ) {
      return 'border border-yellow-400';
    }
    return '';
  };

  return {
    pieces,
    moves,
    currentMoveIndex,
    selectedPiece,
    handleMoveSelect,
    makeMove,
    handleSquareClick,
    getSquareHighlight,
    validMoves,
  };
};
