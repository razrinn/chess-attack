import { FC } from 'react';
import { Square } from './Square';
import { Piece } from './Piece';
import { MoveHistory } from './MoveHistory';
import { Legend } from './Legend';
import { GameStatus } from './GameStatus';
import { useChessBoard } from '../hooks/useChessBoard';
import { useDomination } from '../hooks/useDomination';
import { useDragAndDrop } from '../hooks/useDragAndDrop';

export const Board: FC = () => {
  const {
    pieces,
    moves,
    currentMoveIndex,
    handleMoveSelect,
    makeMove,
    handleSquareClick,
    getSquareHighlight,
  } = useChessBoard();

  const { domination, getDominationStyle, getDominationText } =
    useDomination(pieces);

  const { handleDragStart, handleDragOver, handleDrop } =
    useDragAndDrop(makeMove);

  return (
    <div className='flex flex-col sm:flex-row gap-4 items-start'>
      <div>
        <div className='inline-block border-2 border-gray-800 touch-none select-none'>
          {pieces.map((row, rowIndex) => (
            <div key={rowIndex} className='flex'>
              {row.map((piece, colIndex) => (
                <Square
                  key={`${rowIndex}-${colIndex}`}
                  isBlack={(rowIndex + colIndex) % 2 === 1}
                  onDrop={() => handleDrop(rowIndex, colIndex)}
                  onDragOver={handleDragOver}
                >
                  <div
                    className={`relative w-full h-full flex items-center justify-center cursor-pointer ${getDominationStyle(
                      domination[rowIndex][colIndex]
                    )} ${getSquareHighlight(rowIndex, colIndex)}`}
                    onClick={() => handleSquareClick(rowIndex, colIndex)}
                  >
                    {piece && (
                      <div
                        draggable
                        onDragStart={() => handleDragStart(rowIndex, colIndex)}
                      >
                        <Piece type={piece.type} color={piece.color} />
                      </div>
                    )}
                    <div className='absolute bottom-0 right-0.5 text-[8px] sm:text-[10px] md:text-xs font-bold text-gray-600'>
                      {getDominationText(domination[rowIndex][colIndex])}
                    </div>
                  </div>
                </Square>
              ))}
            </div>
          ))}
        </div>
        <div className='mt-4'>
          <Legend />
        </div>
      </div>
      <div className='w-full sm:w-64'>
        <GameStatus pieces={pieces} domination={domination} />
        <MoveHistory
          moves={moves}
          currentMove={currentMoveIndex}
          onMoveSelect={handleMoveSelect}
        />
      </div>
    </div>
  );
};
