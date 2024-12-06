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
  isInCheck: 'white' | 'black' | null;
  isGameOver: boolean;
}

const PIECE_VALUES = {
  pawn: 1,
  bishop: 3,
  knight: 3,
  rook: 5,
  queen: 9,
  king: 0, // Not counted in material advantage
};

// Weight for square control in the overall advantage calculation
const SQUARE_CONTROL_WEIGHT = 0.1;

export const GameStatus: FC<GameStatusProps> = ({
  pieces,
  domination,
  isInCheck,
  isGameOver,
}) => {
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
  const whiteDomination = calculateTotalDomination('white');
  const blackDomination = calculateTotalDomination('black');

  // Calculate advantages (positive means White is ahead, negative means Black is ahead)
  const materialAdvantage = whiteValue - blackValue;
  const dominationAdvantage = whiteDomination - blackDomination;
  const overallAdvantage =
    materialAdvantage + dominationAdvantage * SQUARE_CONTROL_WEIGHT;

  // Helper function to format advantage text with proper sign
  const formatAdvantage = (value: number) => {
    if (value === 0) return '0.0';
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}`;
  };

  return (
    <div className='bg-gray-800 rounded-lg shadow-md p-3 text-gray-200 w-full lg:w-64'>
      <h3 className='font-bold mb-2 text-center lg:text-left'>Game Status</h3>
      <div className='space-y-3'>
        {/* Overall advantage bar */}
        <div>
          <div className='flex justify-between text-sm mb-1'>
            <span>Advantage</span>
            <span
              className={
                overallAdvantage > 0
                  ? 'text-blue-400'
                  : overallAdvantage < 0
                  ? 'text-red-400'
                  : 'text-gray-400'
              }
            >
              {overallAdvantage > 0
                ? 'White'
                : overallAdvantage < 0
                ? 'Black'
                : 'Even'}
            </span>
          </div>
          <div className='h-2 bg-gray-700 rounded overflow-hidden'>
            <div
              className={`h-full transition-all duration-300 ${
                overallAdvantage > 0
                  ? 'bg-blue-500 ml-1/2'
                  : 'bg-red-500 mr-1/2'
              }`}
              style={{
                width: `${Math.min(Math.abs(overallAdvantage) * 5, 50)}%`,
              }}
            />
          </div>
        </div>

        {/* Detailed stats */}
        <div className='grid grid-cols-3 gap-2 text-sm'>
          <div className='text-center'>
            <div
              className={`font-semibold ${
                materialAdvantage > 0
                  ? 'text-blue-400'
                  : materialAdvantage < 0
                  ? 'text-red-400'
                  : 'text-gray-400'
              }`}
            >
              {formatAdvantage(materialAdvantage)}
            </div>
            <div className='text-xs text-gray-400'>Material</div>
          </div>
          <div className='text-center'>
            <div
              className={`font-semibold ${
                dominationAdvantage > 0
                  ? 'text-blue-400'
                  : dominationAdvantage < 0
                  ? 'text-red-400'
                  : 'text-gray-400'
              }`}
            >
              {formatAdvantage(dominationAdvantage)}
            </div>
            <div className='text-xs text-gray-400'>Control</div>
          </div>
          <div className='text-center'>
            <div
              className={`font-semibold ${
                overallAdvantage > 0
                  ? 'text-blue-400'
                  : overallAdvantage < 0
                  ? 'text-red-400'
                  : 'text-gray-400'
              }`}
            >
              {formatAdvantage(overallAdvantage)}
            </div>
            <div className='text-xs text-gray-400'>Overall</div>
          </div>
        </div>

        {/* Check/Checkmate status */}
        {isInCheck && (
          <div
            className={`text-${
              isInCheck === 'white' ? 'blue' : 'red'
            }-500 font-bold mt-2 text-center`}
          >
            {isInCheck.charAt(0).toUpperCase() + isInCheck.slice(1)} is in
            check!
            {isGameOver && ' - Checkmate!'}
          </div>
        )}
      </div>
    </div>
  );
};
