import { FC } from 'react';
import { Square } from './Square';
import { Piece } from './Piece';
import { MoveHistory } from './MoveHistory';
import { Legend } from './Legend';
import { GameStatus } from './GameStatus';
import { useChessBoard } from '../hooks/useChessBoard';
import { useDomination } from '../hooks/useDomination';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { WinningModal } from './WinningModal';
import { PromotionModal } from './PromotionModal';

export const Board: FC = () => {
  const {
    pieces,
    moves,
    currentMoveIndex,
    handleMoveSelect,
    makeMove,
    handleSquareClick,
    getSquareHighlight,
    validMoves,
    isGameOver,
    currentTurn,
    resetGame,
    isInCheck,
    promotionPending,
  } = useChessBoard();

  const { domination, getDominationStyle, getDominationText } =
    useDomination(pieces);

  const { handleDragStart, handleDragOver, handleDrop } = useDragAndDrop(
    makeMove,
    validMoves
  );

  return (
    <>
      {promotionPending && (
        <PromotionModal
          color={currentTurn}
          onSelect={(piece) =>
            makeMove(promotionPending.from, promotionPending.to, piece)
          }
        />
      )}
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
                    isValidMove={validMoves.some(
                      (move) => move.row === rowIndex && move.col === colIndex
                    )}
                    onClick={() => handleSquareClick(rowIndex, colIndex)}
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
                          onDragStart={() =>
                            handleDragStart(rowIndex, colIndex)
                          }
                        >
                          <Piece type={piece.type} color={piece.color} />
                        </div>
                      )}
                      <div className='absolute bottom-0 right-0.5 text-[8px] font-bold text-gray-600'>
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
          <GameStatus
            pieces={pieces}
            domination={domination}
            isInCheck={isInCheck}
            isGameOver={isGameOver}
          />
          <MoveHistory
            moves={moves}
            currentMove={currentMoveIndex}
            onMoveSelect={handleMoveSelect}
          />
        </div>
      </div>
      {isGameOver && (
        <WinningModal
          winner={currentTurn === 'white' ? 'black' : 'white'}
          onRestart={resetGame}
        />
      )}
    </>
  );
};
