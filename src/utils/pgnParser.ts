import { Move, PieceType, PieceColor, PieceState, Position } from '../types';

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

const getSquarePosition = (square: string) => {
  const file = FILES.indexOf(square[0].toLowerCase());
  const rank = RANKS.indexOf(square[1]);
  return { row: rank, col: file };
};

const getPieceType = (notation: string): PieceType => {
  switch (notation.toUpperCase()) {
    case 'K':
      return 'king';
    case 'Q':
      return 'queen';
    case 'R':
      return 'rook';
    case 'B':
      return 'bishop';
    case 'N':
      return 'knight';
    default:
      return 'pawn';
  }
};

const canPieceReachSquare = (
  board: (PieceState | null)[][],
  from: Position,
  to: Position,
  pieceType: PieceType,
  color: PieceColor
): boolean => {
  const dx = to.col - from.col;
  const dy = to.row - from.row;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  switch (pieceType) {
    case 'pawn': {
      const direction = color === 'white' ? -1 : 1;
      const startRow = color === 'white' ? 6 : 1;

      // Regular move
      if (dx === 0 && dy === direction && !board[to.row][to.col]) {
        return true;
      }
      // Double move from start
      if (
        dx === 0 &&
        dy === 2 * direction &&
        from.row === startRow &&
        !board[to.row][to.col] &&
        !board[from.row + direction][from.col]
      ) {
        return true;
      }
      // Capture
      if (absDx === 1 && dy === direction) {
        return board[to.row][to.col] !== null;
      }
      return false;
    }
    case 'knight':
      return (absDx === 2 && absDy === 1) || (absDx === 1 && absDy === 2);
    case 'bishop':
      return absDx === absDy && !isPathBlocked(board, from, to);
    case 'rook':
      return (dx === 0 || dy === 0) && !isPathBlocked(board, from, to);
    case 'queen':
      return (
        (dx === 0 || dy === 0 || absDx === absDy) &&
        !isPathBlocked(board, from, to)
      );
    case 'king':
      return absDx <= 1 && absDy <= 1;
    default:
      return false;
  }
};

const isPathBlocked = (
  board: (PieceState | null)[][],
  from: Position,
  to: Position
): boolean => {
  const dx = Math.sign(to.col - from.col);
  const dy = Math.sign(to.row - from.row);
  let currentRow = from.row + dy;
  let currentCol = from.col + dx;

  while (currentRow !== to.row || currentCol !== to.col) {
    if (board[currentRow][currentCol] !== null) {
      return true;
    }
    currentRow += dy;
    currentCol += dx;
  }

  return false;
};

export const parsePGN = (pgn: string): Move[] => {
  const moves: Move[] = [];
  const cleanPGN = pgn
    .replace(/\{[^}]*\}/g, '') // Remove comments (including clock annotations)
    .replace(/\([^)]*\)/g, '') // Remove variations
    .replace(/\d+\./g, '') // Remove move numbers
    .replace(/\[[^\]]*\]/g, '') // Remove headers
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/1-0|0-1|1\/2-1\/2|\*/g, '') // Remove game result
    .trim();

  const moveNotations = cleanPGN.split(' ').filter(Boolean);
  let currentColor: PieceColor = 'white';
  const board = getInitialBoard();
  let lastPawnMove: Move | null = null;

  for (const notation of moveNotations) {
    if (!notation) continue;

    // Handle castling
    if (notation === 'O-O' || notation === 'O-O-O') {
      const isKingside = notation === 'O-O';
      const row = currentColor === 'white' ? 7 : 0;
      const move = {
        piece: { type: 'king' as const, color: currentColor },
        from: { row, col: 4 },
        to: { row, col: isKingside ? 6 : 2 },
      };
      moves.push(move);

      // Update board state for both king and rook
      board[row][isKingside ? 6 : 2] = { type: 'king', color: currentColor };
      board[row][4] = null;
      // Move rook
      const rookFromCol = isKingside ? 7 : 0;
      const rookToCol = isKingside ? 5 : 3;
      board[row][rookToCol] = { type: 'rook', color: currentColor };
      board[row][rookFromCol] = null;

      currentColor = currentColor === 'white' ? 'black' : 'white';
      continue;
    }

    // Handle pawn promotion
    const promotionMatch = notation.match(/([a-h]x)?([a-h])[18]=[QRBN]/);
    if (promotionMatch) {
      const [fullMatch, capture, targetFile] = promotionMatch;
      const promotionPiece = getPieceType(
        fullMatch.charAt(fullMatch.length - 1)
      );
      const toCol = FILES.indexOf(targetFile);
      const toRow = currentColor === 'white' ? 0 : 7;
      const fromCol = capture ? FILES.indexOf(capture[0]) : toCol;
      const fromRow = currentColor === 'white' ? 1 : 6;

      const move: Move = {
        piece: { type: 'pawn', color: currentColor },
        from: { row: fromRow, col: fromCol },
        to: { row: toRow, col: toCol },
        promotion: promotionPiece,
        capturedPiece: board[toRow][toCol] || undefined,
      };
      moves.push(move);

      board[toRow][toCol] = { type: promotionPiece, color: currentColor };
      board[fromRow][fromCol] = null;

      currentColor = currentColor === 'white' ? 'black' : 'white';
      continue;
    }

    // Parse regular moves
    const match = notation.match(/([KQRBN])?([a-h])?([1-8])?x?([a-h][1-8])/);
    if (match) {
      const [, piece, fromFile, fromRank, destination] = match;
      const pieceType = piece ? getPieceType(piece) : 'pawn';
      const to = getSquarePosition(destination);
      const isCapture = notation.includes('x');

      // Handle en passant
      const isEnPassant: boolean =
        pieceType === 'pawn' &&
        isCapture &&
        !board[to.row][to.col] &&
        lastPawnMove?.piece.type === 'pawn' &&
        lastPawnMove.to.col === to.col &&
        Math.abs(lastPawnMove.to.row - lastPawnMove.from.row) === 2;

      const from = findSourceSquare(
        board,
        pieceType,
        currentColor,
        to,
        fromFile,
        fromRank,
        isCapture,
        lastPawnMove
      );

      if (from) {
        const capturedPiece: { type: PieceType; color: PieceColor } | null =
          isEnPassant
            ? {
                type: 'pawn',
                color: currentColor === 'white' ? 'black' : 'white',
              }
            : board[to.row][to.col];

        const move: Move = {
          piece: { type: pieceType, color: currentColor },
          from,
          to,
          ...(capturedPiece && { capturedPiece }),
        };
        moves.push(move);

        // Update board state
        board[to.row][to.col] = { type: pieceType, color: currentColor };
        board[from.row][from.col] = null;

        // Handle en passant capture
        if (isEnPassant) {
          board[lastPawnMove!.to.row][lastPawnMove!.to.col] = null;
        }

        // Track last pawn move for en passant
        if (pieceType === 'pawn' && Math.abs(from.row - to.row) === 2) {
          lastPawnMove = move;
        } else {
          lastPawnMove = null;
        }
      }

      currentColor = currentColor === 'white' ? 'black' : 'white';
    }
  }

  return moves;
};

const getInitialBoard = (): (PieceState | null)[][] => {
  const board: (PieceState | null)[][] = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null));

  // Set up pawns
  for (let i = 0; i < 8; i++) {
    board[1][i] = { type: 'pawn', color: 'black' };
    board[6][i] = { type: 'pawn', color: 'white' };
  }

  // Set up other pieces
  const pieces: PieceType[] = [
    'rook',
    'knight',
    'bishop',
    'queen',
    'king',
    'bishop',
    'knight',
    'rook',
  ];

  for (let i = 0; i < 8; i++) {
    board[0][i] = { type: pieces[i], color: 'black' };
    board[7][i] = { type: pieces[i], color: 'white' };
  }

  return board;
};

const findSourceSquare = (
  board: (PieceState | null)[][],
  pieceType: PieceType,
  color: PieceColor,
  to: Position,
  fromFile?: string,
  fromRank?: string,
  isCapture?: boolean,
  lastPawnMove?: Move | null
): Position | null => {
  const candidates: Position[] = [];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece?.type === pieceType && piece.color === color) {
        // Filter by file if specified
        if (fromFile && FILES[col] !== fromFile) continue;
        // Filter by rank if specified
        if (fromRank && RANKS[row] !== fromRank) continue;

        // For pawns
        if (pieceType === 'pawn') {
          const direction = color === 'white' ? -1 : 1;
          const startRow = color === 'white' ? 6 : 1;

          if (isCapture) {
            // Pawn capture
            if (
              Math.abs(to.col - col) === 1 &&
              to.row === row + direction &&
              (board[to.row][to.col] !== null || // Regular capture
                (lastPawnMove?.to.col === to.col && // En passant
                  lastPawnMove.to.row === row &&
                  Math.abs(lastPawnMove.to.row - lastPawnMove.from.row) === 2))
            ) {
              candidates.push({ row, col });
            }
          } else {
            // Regular pawn move
            if (to.col === col) {
              // Single step
              if (to.row === row + direction && !board[to.row][to.col]) {
                candidates.push({ row, col });
              }
              // Double step from starting position
              else if (
                row === startRow &&
                to.row === row + 2 * direction &&
                !board[row + direction][col] &&
                !board[to.row][to.col]
              ) {
                candidates.push({ row, col });
              }
            }
          }
        }
        // For other pieces
        else if (
          canPieceReachSquare(board, { row, col }, to, pieceType, color)
        ) {
          candidates.push({ row, col });
        }
      }
    }
  }

  // If we have exactly one candidate, that's our source square
  if (candidates.length === 1) {
    return candidates[0];
  }

  // If we have multiple candidates but one is specified by file or rank
  if (candidates.length > 1) {
    if (fromFile) {
      const fileMatch = candidates.find((c) => FILES[c.col] === fromFile);
      if (fileMatch) return fileMatch;
    }
    if (fromRank) {
      const rankMatch = candidates.find((c) => RANKS[c.row] === fromRank);
      if (rankMatch) return rankMatch;
    }
  }

  return candidates[0] || null;
};
