import { FC } from 'react';

interface PieceCount {
  type: 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
  color: 'white' | 'black';
}

interface DominationCount {
  white: number;
  black: number;
}

interface GameStatusProps {
  pieces: (PieceCount | null)[][];
  domination: DominationCount[][];
}

const PIECE_VALUES = {
  pawn: 1,
  bishop: 3,
  knight: 3,
  rook: 5,
  queen: 9,
  king: 0, // Not counted in material advantage
};

export const GameStatus: FC<GameStatusProps> = ({ pieces, domination }) => {
  const calculateMaterialValue = (color: 'white' | 'black') => {
    let value = 0;
    pieces.forEach((row) => {
      row.forEach((piece) => {
        if (piece && piece.color === color) {
          value += PIECE_VALUES[piece.type];
        }
      });
    });
    return value;
  };

  const calculateTotalDomination = (color: 'white' | 'black') => {
    let total = 0;
    domination.forEach((row) => {
      row.forEach((square) => {
        total += square[color];
      });
    });
    return total;
  };

  const whiteValue = calculateMaterialValue('white');
  const blackValue = calculateMaterialValue('black');
  const advantage = whiteValue - blackValue;

  const whiteDomination = calculateTotalDomination('white');
  const blackDomination = calculateTotalDomination('black');
  const dominationAdvantage = whiteDomination - blackDomination;

  return (
    <div className='bg-gray-800 rounded-lg shadow-md p-3 mb-4 text-gray-200'>
      <h3 className='font-bold mb-2'>Game Status</h3>
      <div className='space-y-2 text-sm'>
        <div className='flex justify-between'>
          <span>White material:</span>
          <span className='font-mono'>{whiteValue}</span>
        </div>
        <div className='flex justify-between'>
          <span>Black material:</span>
          <span className='font-mono'>{blackValue}</span>
        </div>
        <div className='flex justify-between font-bold border-t border-gray-700 pt-1'>
          <span>Material advantage:</span>
          <span
            className={
              advantage > 0
                ? 'text-blue-400'
                : advantage < 0
                ? 'text-red-400'
                : ''
            }
          >
            {advantage > 0
              ? `+${advantage} White`
              : advantage < 0
              ? `${advantage} Black`
              : 'Even'}
          </span>
        </div>
        <div className='border-t border-gray-700 pt-2 mt-2'>
          <div className='flex justify-between'>
            <span>White squares:</span>
            <span className='font-mono'>{whiteDomination}</span>
          </div>
          <div className='flex justify-between'>
            <span>Black squares:</span>
            <span className='font-mono'>{blackDomination}</span>
          </div>
          <div className='flex justify-between font-bold border-t pt-1'>
            <span>Square control:</span>
            <span
              className={
                dominationAdvantage > 0
                  ? 'text-blue-600'
                  : dominationAdvantage < 0
                  ? 'text-red-600'
                  : ''
              }
            >
              {dominationAdvantage > 0
                ? `+${dominationAdvantage} White`
                : dominationAdvantage < 0
                ? `${dominationAdvantage} Black`
                : 'Even'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
