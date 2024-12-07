import { FC, ReactNode } from 'react';
import { PieceType } from '../types';

interface SquareProps {
  isBlack: boolean;
  children?: ReactNode;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  isValidMove?: boolean;
  onClick?: () => void;
  dominationCount?: {
    white: number;
    black: number;
    whitePieces: { type: PieceType; value: number }[];
    blackPieces: { type: PieceType; value: number }[];
  };
}

export const Square: FC<SquareProps> = ({
  isBlack,
  children,
  onDrop,
  onDragOver,
  isValidMove,
  onClick,
  dominationCount,
}) => {
  const getDominationTooltip = () => {
    if (
      !dominationCount ||
      (dominationCount.white === 0 && dominationCount.black === 0)
    ) {
      return null;
    }

    const totalWhiteValue = dominationCount.whitePieces.reduce(
      (sum, p) => sum + p.value,
      0
    );
    const totalBlackValue = dominationCount.blackPieces.reduce(
      (sum, p) => sum + p.value,
      0
    );

    // Group pieces by type and count
    const groupPieces = (pieces: { type: PieceType; value: number }[]) => {
      const grouped = pieces.reduce((acc, piece) => {
        acc[piece.type] = (acc[piece.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(grouped)
        .map(([type, count]) => `${count}${type.charAt(0).toUpperCase()}`)
        .join(' ');
    };

    return (
      <div className='fixed top-20 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs p-2 rounded shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap'>
        {dominationCount.whitePieces.length > 0 && (
          <div className='mb-1'>
            <span className='text-blue-400'>White</span> ({totalWhiteValue}):{' '}
            {groupPieces(dominationCount.whitePieces)}
          </div>
        )}
        {dominationCount.blackPieces.length > 0 && (
          <div>
            <span className='text-red-400'>Black</span> ({totalBlackValue}):{' '}
            {groupPieces(dominationCount.blackPieces)}
          </div>
        )}
      </div>
    );
  };

  const getDominationIndicator = () => {
    if (
      !dominationCount ||
      (dominationCount.white === 0 && dominationCount.black === 0)
    ) {
      return null;
    }

    // Determine which color dominates
    const whiteDominates = dominationCount.white > dominationCount.black;
    const blackDominates = dominationCount.black > dominationCount.white;
    const isContested = dominationCount.white === dominationCount.black;

    return (
      <div className='absolute bottom-0.5 right-0.5 flex items-center gap-0.5'>
        {(whiteDominates || isContested) && (
          <div className='flex items-center'>
            <div className='w-1.5 h-1.5 rounded-full bg-blue-400/70' />
            <span className='text-[8px] font-semibold text-blue-400/70 ml-0.5'>
              {dominationCount.white}
            </span>
          </div>
        )}
        {isContested && <span className='text-[8px] text-gray-400'>·</span>}
        {(blackDominates || isContested) && (
          <div className='flex items-center'>
            <div className='w-1.5 h-1.5 rounded-full bg-red-400/70' />
            <span className='text-[8px] font-semibold text-red-400/70 ml-0.5'>
              {dominationCount.black}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`group relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 flex items-center justify-center ${
        isBlack ? 'bg-gray-700' : 'bg-gray-500'
      }`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onClick={onClick}
    >
      {children}
      {getDominationTooltip()}
      {getDominationIndicator()}
      {isValidMove && (
        <div className='absolute w-3 h-3 rounded-full bg-yellow-400/50 pointer-events-none' />
      )}
    </div>
  );
};
