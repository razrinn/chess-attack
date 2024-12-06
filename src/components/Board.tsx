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
    isFlipped,
    setIsFlipped,
  } = useChessBoard();

  const { domination, getDominationStyle } = useDomination(pieces);

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
      <div className='flex flex-col lg:flex-row gap-4'>
        <div className='flex flex-col gap-4'>
          <Legend isFlipped={isFlipped}>
            <div className='inline-block border-2 border-gray-800 touch-none select-none'>
              {(isFlipped ? [...pieces].reverse() : pieces).map(
                (row, rowIndex) => (
                  <div key={rowIndex} className='flex'>
                    {(isFlipped ? [...row].reverse() : row).map(
                      (piece, colIndex) => {
                        const actualRow = isFlipped ? 7 - rowIndex : rowIndex;
                        const actualCol = isFlipped ? 7 - colIndex : colIndex;

                        return (
                          <Square
                            key={`${rowIndex}-${colIndex}`}
                            isBlack={(rowIndex + colIndex) % 2 === 1}
                            onDrop={() => handleDrop(actualRow, actualCol)}
                            onDragOver={handleDragOver}
                            isValidMove={validMoves.some(
                              (move) =>
                                move.row === actualRow && move.col === actualCol
                            )}
                            onClick={() =>
                              handleSquareClick(actualRow, actualCol)
                            }
                            dominationCount={domination[actualRow][actualCol]}
                          >
                            <div
                              className={`relative w-full h-full flex items-center justify-center cursor-pointer ${getDominationStyle(
                                domination[actualRow][actualCol]
                              )} ${getSquareHighlight(actualRow, actualCol)}`}
                              onClick={() =>
                                handleSquareClick(actualRow, actualCol)
                              }
                            >
                              {piece && (
                                <div
                                  draggable
                                  onDragStart={() =>
                                    handleDragStart(actualRow, actualCol)
                                  }
                                >
                                  <Piece
                                    type={piece.type}
                                    color={piece.color}
                                  />
                                </div>
                              )}
                            </div>
                          </Square>
                        );
                      }
                    )}
                  </div>
                )
              )}
            </div>
          </Legend>
        </div>
        <div className='flex flex-col gap-4 w-full lg:w-auto'>
          <div className='flex gap-2 justify-center lg:justify-start'>
            <button
              onClick={() => setIsFlipped((prev) => !prev)}
              className='p-1 px-2 bg-gray-700 rounded hover:bg-gray-600 text-gray-200 flex items-center gap-2'
            >
              🔄
            </button>
          </div>
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
