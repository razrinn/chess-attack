import { FC } from 'react';

type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
type PieceColor = 'white' | 'black';

interface PieceProps {
  type: PieceType;
  color: PieceColor;
}

const pieceUnicode: Record<PieceType, Record<PieceColor, string>> = {
  king: { white: '♔', black: '♚' },
  queen: { white: '♕', black: '♛' },
  rook: { white: '♖', black: '♜' },
  bishop: { white: '♗', black: '♝' },
  knight: { white: '♘', black: '♞' },
  pawn: { white: '♙', black: '♟' },
};

export const Piece: FC<PieceProps> = ({ type, color }) => {
  return (
    <div className='text-xl sm:text-2xl md:text-4xl cursor-grab active:cursor-grabbing'>
      {pieceUnicode[type][color]}
    </div>
  );
};
