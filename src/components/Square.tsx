import { FC, ReactNode } from 'react';

interface SquareProps {
  isBlack: boolean;
  children?: ReactNode;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
}

export const Square: FC<SquareProps> = ({
  isBlack,
  children,
  onDrop,
  onDragOver,
}) => {
  return (
    <div
      className={`w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 flex items-center justify-center ${
        isBlack ? 'bg-gray-600' : 'bg-gray-200'
      }`}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      {children}
    </div>
  );
};
