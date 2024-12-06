import { FC, ReactNode } from 'react';

interface SquareProps {
  isBlack: boolean;
  children?: ReactNode;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  isValidMove?: boolean;
}

export const Square: FC<SquareProps> = ({
  isBlack,
  children,
  onDrop,
  onDragOver,
  isValidMove,
}) => {
  return (
    <div
      className={`w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 flex items-center justify-center relative ${
        isBlack ? 'bg-gray-700' : 'bg-gray-500'
      }`}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      {children}
      {isValidMove && (
        <div className='absolute w-3 h-3 rounded-full bg-yellow-400/50 z-10' />
      )}
    </div>
  );
};
