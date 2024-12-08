import { Move, PieceType } from '../types';

export const getPieceLetter = (type: PieceType): string => {
  switch (type) {
    case 'king':
      return 'K';
    case 'queen':
      return 'Q';
    case 'rook':
      return 'R';
    case 'bishop':
      return 'B';
    case 'knight':
      return 'N';
    default:
      return '';
  }
};

const getSquareName = (row: number, col: number): string => {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
  return `${files[col]}${ranks[row]}`;
};

export const generatePGN = (moves: Move[]): string => {
  // Add PGN headers
  const headers = [
    '[Event "Chess Attack Game"]',
    '[Site "chess.yzrin.com"]',
    `[Date "${new Date().toISOString().split('T')[0].replace(/-/g, '.')}"]`,
    '[Round "1"]',
    '[White "Player 1"]',
    '[Black "Player 2"]',
    '[Result "*"]',
    '',
    '',
  ].join('\n');

  const movePairs = [];

  for (let i = 0; i < moves.length; i += 2) {
    const moveNumber = Math.floor(i / 2) + 1;
    const whiteMove = moves[i];
    const blackMove = moves[i + 1];

    let pairNotation = `${moveNumber}.`;

    // Add white's move
    const whitePieceLetter = getPieceLetter(whiteMove.piece.type);
    const whiteDestination = getSquareName(whiteMove.to.row, whiteMove.to.col);
    const whiteCapture = whiteMove.capturedPiece ? 'x' : '';
    const whitePawnCapture =
      whiteMove.piece.type === 'pawn' && whiteCapture
        ? getSquareName(whiteMove.from.row, whiteMove.from.col)[0]
        : '';
    const whitePromotion = whiteMove.promotion
      ? `=${getPieceLetter(whiteMove.promotion)}`
      : '';

    // Handle castling for white
    if (
      whiteMove.piece.type === 'king' &&
      Math.abs(whiteMove.to.col - whiteMove.from.col) === 2
    ) {
      pairNotation +=
        ' ' + (whiteMove.to.col > whiteMove.from.col ? 'O-O' : 'O-O-O');
    } else {
      pairNotation += ` ${whitePieceLetter}${whitePawnCapture}${whiteCapture}${whiteDestination}${whitePromotion}`;
    }

    // Add black's move if it exists
    if (blackMove) {
      const blackPieceLetter = getPieceLetter(blackMove.piece.type);
      const blackDestination = getSquareName(
        blackMove.to.row,
        blackMove.to.col
      );
      const blackCapture = blackMove.capturedPiece ? 'x' : '';
      const blackPawnCapture =
        blackMove.piece.type === 'pawn' && blackCapture
          ? getSquareName(blackMove.from.row, blackMove.from.col)[0]
          : '';
      const blackPromotion = blackMove.promotion
        ? `=${getPieceLetter(blackMove.promotion)}`
        : '';

      // Handle castling for black
      if (
        blackMove.piece.type === 'king' &&
        Math.abs(blackMove.to.col - blackMove.from.col) === 2
      ) {
        pairNotation +=
          ' ' + (blackMove.to.col > blackMove.from.col ? 'O-O' : 'O-O-O');
      } else {
        pairNotation += ` ${blackPieceLetter}${blackPawnCapture}${blackCapture}${blackDestination}${blackPromotion}`;
      }
    }

    movePairs.push(pairNotation);
  }

  return headers + movePairs.join(' ');
};
