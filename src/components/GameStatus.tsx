import { FC } from 'react';
import { PieceColor, PieceType } from '../types';
import { PIECE_VALUES } from '../constants';

interface PieceCount {
  type: PieceType;
  color: PieceColor;
}

interface DominationCount {
  white: number;
  black: number;
  whitePieces: { type: PieceType; value: number }[];
  blackPieces: { type: PieceType; value: number }[];
}

interface GameStatusProps {
  pieces: (PieceCount | null)[][];
  domination: DominationCount[][];
  isInCheck: PieceColor | null;
  isGameOver: boolean;
  currentTurn: PieceColor;
}

// Weight for square control in the overall advantage calculation
const SQUARE_CONTROL_WEIGHT = 0.1;

export const GameStatus: FC<GameStatusProps> = ({
  pieces,
  domination,
  isInCheck,
  isGameOver,
  currentTurn,
}) => {
  const calculateMaterialValue = (color: PieceColor) => {
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

  const calculateTotalDomination = (color: PieceColor) => {
    let total = 0;
    let totalValue = 0;
    domination.forEach((row) => {
      row.forEach((square) => {
        total += square[color];
        totalValue += square[`${color}Pieces`].reduce(
          (sum, p) => sum + p.value,
          0
        );
      });
    });
    return { count: total, value: totalValue };
  };

  const whiteValue = calculateMaterialValue('white');
  const blackValue = calculateMaterialValue('black');
  const whiteDomination = calculateTotalDomination('white');
  const blackDomination = calculateTotalDomination('black');

  // Calculate advantages
  const materialAdvantage = whiteValue - blackValue;
  const dominationCountAdvantage =
    whiteDomination.count - blackDomination.count;
  const dominationValueAdvantage =
    whiteDomination.value - blackDomination.value;

  // Calculate weighted domination advantage based on material difference
  const materialDifference = Math.abs(materialAdvantage);
  const isWhiteWeaker = materialAdvantage < 0;
  const isBlackWeaker = materialAdvantage > 0;

  // Increase the weight of domination for the materially weaker side
  const dominationWeight =
    SQUARE_CONTROL_WEIGHT * (1 + materialDifference * 0.1);

  // Apply the weighted domination advantage
  const weightedDominationAdvantage =
    (isWhiteWeaker
      ? dominationCountAdvantage * dominationWeight
      : dominationCountAdvantage * SQUARE_CONTROL_WEIGHT) +
    (isBlackWeaker
      ? -dominationCountAdvantage * dominationWeight
      : -dominationCountAdvantage * SQUARE_CONTROL_WEIGHT);

  const overallAdvantage =
    materialAdvantage +
    weightedDominationAdvantage +
    dominationValueAdvantage * SQUARE_CONTROL_WEIGHT * 0.1;

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
                dominationCountAdvantage > 0
                  ? 'text-blue-400'
                  : dominationCountAdvantage < 0
                  ? 'text-red-400'
                  : 'text-gray-400'
              }`}
            >
              {formatAdvantage(dominationCountAdvantage)}
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

        {/* Check/Checkmate status and Turn indicator */}
        <div className='h-8 flex items-center'>
          {/* Turn indicator */}
          <div
            className={`font-bold text-center text-sm transition-opacity duration-300 ${
              !isInCheck ? 'opacity-100' : 'opacity-40'
            } ${currentTurn === 'white' ? 'text-blue-500' : 'text-red-500'}`}
          >
            {currentTurn.charAt(0).toUpperCase() + currentTurn.slice(1)}'s turn
          </div>

          {/* Check/Checkmate status */}
          <div
            className={`font-bold text-center text-sm transition-opacity duration-300 ml-2 ${
              isInCheck ? 'opacity-100' : 'opacity-0'
            } ${isInCheck === 'white' ? 'text-blue-500' : 'text-red-500'}`}
          >
            {isInCheck && (
              <>
                They're in a check!
                {isGameOver && ' - Checkmate!'}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
