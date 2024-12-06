import { FC } from 'react';
import { Piece } from './Piece';

interface PromotionModalProps {
  color: 'white' | 'black';
  onSelect: (piece: 'queen' | 'rook' | 'bishop' | 'knight') => void;
}

export const PromotionModal: FC<PromotionModalProps> = ({
  color,
  onSelect,
}) => {
  const pieces: ('queen' | 'rook' | 'bishop' | 'knight')[] = [
    'queen',
    'rook',
    'bishop',
    'knight',
  ];

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
      <div className='bg-gray-800 p-4 rounded-lg shadow-xl'>
        <h2 className='text-lg font-bold text-gray-200 mb-4 text-center'>
          Choose Promotion Piece
        </h2>
        <div className='flex gap-2'>
          {pieces.map((piece) => (
            <button
              key={piece}
              onClick={() => onSelect(piece)}
              className='w-16 h-16 bg-gray-700 rounded hover:bg-gray-600'
            >
              <Piece type={piece} color={color} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
