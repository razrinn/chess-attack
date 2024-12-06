import { useState } from 'react';
import { useValidMoves } from './useValidMoves';
import { useChessSound } from './useChessSound';

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

const simulateMove = (
  from: Position,
  to: Position,
  currentPieces: (PieceState | null)[][]
): (PieceState | null)[][] => {
  const newPieces = currentPieces.map((row) => [...row]);
  const piece = newPieces[from.row][from.col];
  newPieces[to.row][to.col] = piece;
  newPieces[from.row][from.col] = null;
  return newPieces;
};

export const useChessBoard = () => {
  const [pieces, setPieces] =
    useState<(PieceState | null)[][]>(getInitialBoard);
  const [moves, setMoves] = useState<Move[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const { getValidMoves, isKingInCheck, isCheckmate } = useValidMoves(
    pieces,
    null
  );
  const { playSound } = useChessSound();
  const [isInCheck, setIsInCheck] = useState<'white' | 'black' | null>(null);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [currentTurn, setCurrentTurn] = useState<'white' | 'black'>('white');
  const [promotionPending, setPromotionPending] = useState<{
    from: Position;
    to: Position;
  } | null>(null);

  const resetGame = () => {
    setPieces(getInitialBoard());
    setMoves([]);
    setCurrentMoveIndex(-1);
    setSelectedPiece(null);
    setValidMoves([]);
    setIsInCheck(null);
    setIsGameOver(false);
    setCurrentTurn('white');
  };

  const handleMoveSelect = (index: number) => {
    if (index < -1 || index >= moves.length) return;

    // Play move sound when navigating moves
    if (index !== currentMoveIndex) {
      playSound('move');
    }

    setCurrentMoveIndex(index);

    if (index === -1) {
      setPieces(getInitialBoard());
      setCurrentTurn('white');
      setIsInCheck(null);
      setIsGameOver(false);
      return;
    }

    // Replay moves up to the selected index
    const newBoard = getInitialBoard();
    for (let i = 0; i <= index; i++) {
      const move = moves[i];
      const isCastling =
        move.piece.type === 'king' &&
        Math.abs(move.to.col - move.from.col) === 2;

      newBoard[move.to.row][move.to.col] = {
        type: move.piece.type,
        color: move.piece.color,
      };
      newBoard[move.from.row][move.from.col] = null;

      // Handle castling rook movement
      if (isCastling) {
        const isKingsideCastle = move.to.col > move.from.col;
        const rookFromCol = isKingsideCastle ? 7 : 0;
        const rookToCol = isKingsideCastle ? 5 : 3;
        newBoard[move.to.row][rookToCol] = newBoard[move.to.row][rookFromCol];
        newBoard[move.to.row][rookFromCol] = null;
      }
    }

    setPieces(newBoard);

    // Set turn to opposite of last played move
    const lastMove = moves[index];
    setCurrentTurn(lastMove.piece.color === 'white' ? 'black' : 'white');

    // Update check status for the current position
    const opponentColor = lastMove.piece.color === 'white' ? 'black' : 'white';
    if (isKingInCheck(newBoard, opponentColor)) {
      setIsInCheck(opponentColor);
      // Only set game over if this is the latest move
      if (isCheckmate(newBoard, opponentColor) && index === moves.length - 1) {
        setIsGameOver(true);
      }
    } else {
      setIsInCheck(null);
    }
  };

  const makeMove = (
    from: Position,
    to: Position,
    promotionPiece?: PieceType
  ) => {
    const piece = pieces[from.row][from.col];
    if (!piece) return;

    // Check if it's the correct player's turn
    if (piece.color !== currentTurn) return;

    // Check if the move is valid
    const validMoves = getValidMoves(from.row, from.col);
    const isValidMove = validMoves.some(
      (move) => move.row === to.row && move.col === to.col
    );

    if (!isValidMove) return;

    // Check for pawn promotion
    const isPromotion = piece.type === 'pawn' && (to.row === 0 || to.row === 7);

    if (isPromotion && !promotionPiece) {
      setPromotionPending({ from, to });
      return;
    }

    // Simulate the move and check if it leaves own king in check
    const simulatedBoard = simulateMove(from, to, pieces);
    if (isKingInCheck(simulatedBoard, piece.color)) {
      return; // Move would leave/put own king in check
    }

    const newPieces = pieces.map((row) => [...row]);
    const capturedPiece = newPieces[to.row][to.col];

    // Set the piece, handling promotion if necessary
    newPieces[to.row][to.col] = isPromotion
      ? { type: promotionPiece!, color: piece.color }
      : piece;
    newPieces[from.row][from.col] = null;

    // Handle castling
    if (piece.type === 'king' && Math.abs(to.col - from.col) === 2) {
      const isKingsideCastle = to.col > from.col;
      const rookFromCol = isKingsideCastle ? 7 : 0;
      const rookToCol = isKingsideCastle ? 5 : 3;

      newPieces[to.row][rookToCol] = newPieces[to.row][rookFromCol];
      newPieces[to.row][rookFromCol] = null;
      playSound('castle');
    } else if (capturedPiece) {
      playSound('capture');
    } else if (isPromotion) {
      playSound('promote');
    } else {
      playSound('move');
    }

    // Update move history
    const newMoves = moves.slice(0, currentMoveIndex + 1);
    newMoves.push({
      from,
      to,
      piece: {
        type: isPromotion ? promotionPiece! : piece.type,
        color: piece.color,
      },
    });

    // Check for check condition before updating state
    const opponentColor = piece.color === 'white' ? 'black' : 'white';
    const willBeInCheck = isKingInCheck(newPieces, opponentColor);

    // Play check sound and update state
    if (willBeInCheck) {
      playSound('check');
      setIsInCheck(opponentColor);
      if (isCheckmate(newPieces, opponentColor)) {
        setIsGameOver(true);
        playSound('gameEnd');
      }
    } else {
      setIsInCheck(null);
    }

    // Update all state
    setPieces(newPieces);
    setMoves(newMoves);
    setCurrentMoveIndex(newMoves.length - 1);
    setSelectedPiece(null);
    setValidMoves([]);
    setPromotionPending(null);

    setCurrentTurn(opponentColor);
  };

  const handleSquareClick = (row: number, col: number) => {
    // Don't allow moves if game is over
    if (isGameOver) return;

    if (selectedPiece) {
      if (selectedPiece.row === row && selectedPiece.col === col) {
        // Clicking the same piece deselects it
        setSelectedPiece(null);
        setValidMoves([]);
      } else if (
        validMoves.some((move) => move.row === row && move.col === col)
      ) {
        // If the clicked square is a valid move (including captures), make the move
        makeMove(selectedPiece, { row, col });
      } else if (pieces[row][col]?.color === currentTurn) {
        // Clicking another piece of the same color changes selection to that piece
        setSelectedPiece({ row, col });
        setValidMoves(getValidMoves(row, col));
      } else {
        // Clicking an invalid square deselects the current piece
        setSelectedPiece(null);
        setValidMoves([]);
      }
    } else {
      // Initial piece selection
      const piece = pieces[row][col];
      if (piece && piece.color === currentTurn) {
        setSelectedPiece({ row, col });
        setValidMoves(getValidMoves(row, col));
      }
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
    isInCheck,
    isGameOver,
    currentTurn,
    resetGame,
    promotionPending,
  };
};
