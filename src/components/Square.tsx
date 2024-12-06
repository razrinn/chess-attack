import { FC, ReactNode } from 'react';

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
        {/* Show dominating color first */}
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
      className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 flex items-center justify-center relative ${
        isBlack ? 'bg-gray-700' : 'bg-gray-500'
      }`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onClick={onClick}
    >
      {children}
      {isValidMove && (
        <div
          className='absolute w-3 h-3 rounded-full bg-yellow-400/50 z-10 cursor-pointer'
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
        />
      )}
      {getDominationIndicator()}
    </div>
  );
};
