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
  capturedPiece?: {
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
  const [lastPawnMove, setLastPawnMove] = useState<Move | null>(null);
  const { getValidMoves, isKingInCheck, isCheckmate } = useValidMoves(
    pieces,
    lastPawnMove
  );
  const { playSound } = useChessSound();
  const [isInCheck, setIsInCheck] = useState<'white' | 'black' | null>(null);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [currentTurn, setCurrentTurn] = useState<'white' | 'black'>('white');
  const [promotionPending, setPromotionPending] = useState<{
    from: Position;
    to: Position;
  } | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const resetGame = () => {
    setPieces(getInitialBoard());
    setMoves([]);
    setCurrentMoveIndex(-1);
    setSelectedPiece(null);
    setValidMoves([]);
    setIsInCheck(null);
    setIsGameOver(false);
    setCurrentTurn('white');
    setLastPawnMove(null);
  };

  const handleMoveSelect = (index: number) => {
    if (index < -1 || index >= moves.length) return;

    // Clear piece selection when navigating history
    setSelectedPiece(null);
    setValidMoves([]);

    // Play move sound when going back to start position
    if (index === -1 && currentMoveIndex !== -1) {
      playSound('move');
    }

    // Play appropriate sound when navigating to a new move
    if (index !== currentMoveIndex && index >= 0) {
      const move = moves[index];
      const prevMove = index > 0 ? moves[index - 1] : null;

      const isEnPassant =
        move.piece.type === 'pawn' &&
        Math.abs(move.from.col - move.to.col) === 1 && // Diagonal move
        Math.abs(move.from.row - move.to.row) === 1 && // One square forward
        prevMove &&
        prevMove.piece.type === 'pawn' &&
        Math.abs(prevMove.from.row - prevMove.to.row) === 2;

      const isCastling =
        move.piece.type === 'king' &&
        Math.abs(move.to.col - move.from.col) === 2;

      // Get the board state before this move
      const prevBoard = getInitialBoard();
      for (let i = 0; i < index; i++) {
        const prevMove = moves[i];
        prevBoard[prevMove.to.row][prevMove.to.col] = {
          type: prevMove.piece.type,
          color: prevMove.piece.color,
        };
        prevBoard[prevMove.from.row][prevMove.from.col] = null;
      }

      if (isCastling) {
        playSound('castle');
      } else if (isEnPassant || prevBoard[move.to.row][move.to.col] !== null) {
        playSound('capture');
      } else {
        playSound('move');
      }
    }

    setCurrentMoveIndex(index);

    if (index === -1) {
      setPieces(getInitialBoard());
      setCurrentTurn('white');
      setIsInCheck(null);
      setIsGameOver(false);
      setLastPawnMove(null);
      return;
    }

    // Replay moves up to the selected index
    const newBoard = getInitialBoard();
    let lastPawn = null;

    for (let i = 0; i <= index; i++) {
      const move = moves[i];
      const isCastling =
        move.piece.type === 'king' &&
        Math.abs(move.to.col - move.from.col) === 2;

      // Check if this move is an en passant capture
      const prevMove = i > 0 ? moves[i - 1] : null;
      const isEnPassant =
        move.piece.type === 'pawn' &&
        Math.abs(move.from.col - move.to.col) === 1 && // Diagonal move
        Math.abs(move.from.row - move.to.row) === 1 && // One square forward
        !newBoard[move.to.row][move.to.col] && // No piece at target square
        prevMove &&
        prevMove.piece.type === 'pawn' &&
        Math.abs(prevMove.from.row - prevMove.to.row) === 2 && // Previous move was a double pawn push
        prevMove.to.col === move.to.col && // Same column as captured pawn
        prevMove.to.row === move.from.row; // Same rank as capturing pawn

      // Make the move
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

      // Handle en passant capture
      if (isEnPassant) {
        newBoard[move.from.row][move.to.col] = null;
      }

      // Track last pawn move for en passant
      if (
        i === index &&
        move.piece.type === 'pawn' &&
        Math.abs(move.from.row - move.to.row) === 2
      ) {
        lastPawn = move;
      }
    }

    // Update all state at once
    setPieces(newBoard);
    setLastPawnMove(lastPawn);

    // Set turn to opposite of last played move
    const lastMove = moves[index];
    setCurrentTurn(lastMove.piece.color === 'white' ? 'black' : 'white');

    // Update check status for the current position
    const opponentColor = lastMove.piece.color === 'white' ? 'black' : 'white';
    if (isKingInCheck(newBoard, opponentColor)) {
      setIsInCheck(opponentColor);
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

    // Handle en passant capture
    const isEnPassant =
      piece.type === 'pawn' &&
      Math.abs(from.col - to.col) === 1 && // Diagonal move
      Math.abs(from.row - to.row) === 1 && // One square forward
      lastPawnMove && // There was a previous pawn move
      lastPawnMove.to.col === to.col && // Moving to the same column as the last pawn
      lastPawnMove.to.row === from.row && // The enemy pawn is on the same rank
      lastPawnMove.piece.color !== piece.color; // It was enemy's pawn

    const capturedPiece: PieceState | undefined =
      newPieces[to.row][to.col] ||
      (isEnPassant
        ? {
            type: 'pawn' as const,
            color: piece.color === 'white' ? 'black' : 'white',
          }
        : undefined);

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
      capturedPiece,
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

    if (piece.type === 'pawn' && Math.abs(from.row - to.row) === 2) {
      setLastPawnMove({
        from,
        to,
        piece: {
          type: 'pawn',
          color: piece.color,
        },
      });
    } else {
      setLastPawnMove(null);
    }
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
    isFlipped,
    setIsFlipped,
  };
};
