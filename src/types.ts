export interface Position {
  row: number;
  col: number;
}

export interface PieceState {
  type: 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
  color: 'white' | 'black';
}

export interface GameState {
  enPassantTarget: Position | null;
  canCastleKingside: {
    white: boolean;
    black: boolean;
  };
  canCastleQueenside: {
    white: boolean;
    black: boolean;
  };
}

export interface Move {
  from: Position;
  to: Position;
  piece: PieceState;
}

export type PieceType =
  | 'pawn'
  | 'rook'
  | 'knight'
  | 'bishop'
  | 'queen'
  | 'king';
export type PieceColor = 'white' | 'black';
