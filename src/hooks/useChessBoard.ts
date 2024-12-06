import { useState } from 'react';

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

    const newPieces = pieces.map((row) => [...row]);
    newPieces[to.row][to.col] = piece;
    newPieces[from.row][from.col] = null;

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
  };

  const handleSquareClick = (row: number, col: number) => {
    if (selectedPiece) {
      if (selectedPiece.row === row && selectedPiece.col === col) {
        setSelectedPiece(null);
      } else {
        makeMove(selectedPiece, { row, col });
        setSelectedPiece(null);
      }
    } else if (pieces[row][col]) {
      setSelectedPiece({ row, col });
    }
  };

  const getSquareHighlight = (row: number, col: number) => {
    if (
      selectedPiece &&
      selectedPiece.row === row &&
      selectedPiece.col === col
    ) {
      return 'ring-2 ring-yellow-400';
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
  };
};
