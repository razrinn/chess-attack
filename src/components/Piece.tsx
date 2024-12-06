import { FC } from 'react';

// Import piece images
import bishopBlack from '../assets/bishop-black.png';
import bishopWhite from '../assets/bishop-white.png';
import kingBlack from '../assets/king-black.png';
import kingWhite from '../assets/king-white.png';
import knightBlack from '../assets/knight-black.png';
import knightWhite from '../assets/knight-white.png';
import pawnBlack from '../assets/pawn-black.png';
import pawnWhite from '../assets/pawn-white.png';
import queenBlack from '../assets/queen-black.png';
import queenWhite from '../assets/queen-white.png';
import rookBlack from '../assets/rook-black.png';
import rookWhite from '../assets/rook-white.png';

type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
type PieceColor = 'white' | 'black';

interface PieceProps {
  type: PieceType;
  color: PieceColor;
}

const pieceImages: Record<PieceType, Record<PieceColor, string>> = {
  king: { white: kingWhite, black: kingBlack },
  queen: { white: queenWhite, black: queenBlack },
  rook: { white: rookWhite, black: rookBlack },
  bishop: { white: bishopWhite, black: bishopBlack },
  knight: { white: knightWhite, black: knightBlack },
  pawn: { white: pawnWhite, black: pawnBlack },
};

export const Piece: FC<PieceProps> = ({ type, color }) => {
  return (
    <div className='w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center'>
      <img
        src={pieceImages[type][color]}
        alt={`${color} ${type}`}
        className='w-[80%] h-[80%] object-contain'
      />
    </div>
  );
};
