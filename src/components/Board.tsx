import { FC, useState } from 'react';
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
import { PIECE_VALUES } from '../constants';
import { PieceColor, PieceType } from '../types';

const CapturedPieces: FC<{
  pieces: {
    type: PieceType;
    color: PieceColor;
  }[];
  color: PieceColor;
  isFlipped: boolean;
}> = ({ pieces, color, isFlipped }) => {
  const shouldReverse = (color === 'white') === isFlipped;

  return (
    <div
      className={`flex items-center gap-1 min-h-[40px] ${
        shouldReverse ? 'flex-row-reverse' : ''
      }`}
    >
      <div
        className={`w-4 h-4 ${
          color === 'white' ? 'bg-blue-500/20' : 'bg-red-500/20'
        } rounded-full`}
      />
      <div className='flex flex-wrap gap-1'>
        {pieces.map((piece, index) => (
          <div key={index} className='w-6 h-6'>
            <Piece type={piece.type} color={piece.color} small />
          </div>
        ))}
      </div>
    </div>
  );
};

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

  const [showHints, setShowHints] = useState(true);

  const { domination, getDominationStyle } = useDomination(pieces);

  const { handleDragStart, handleDragOver, handleDrop } = useDragAndDrop(
    makeMove,
    validMoves
  );

  const getCapturedPieces = () => {
    const captured: {
      white: { type: PieceType; color: PieceColor }[];
      black: { type: PieceType; color: PieceColor }[];
    } = {
      white: [],
      black: [],
    };

    moves.slice(0, currentMoveIndex + 1).forEach((move) => {
      if (move.capturedPiece) {
        if (move.capturedPiece.color === 'white') {
          captured.black.push(move.capturedPiece);
        } else {
          captured.white.push(move.capturedPiece);
        }
      }
    });

    const sortPieces = (pieces: { type: PieceType; color: PieceColor }[]) => {
      return pieces.sort(
        (a, b) =>
          PIECE_VALUES[b.type as keyof typeof PIECE_VALUES] -
          PIECE_VALUES[a.type as keyof typeof PIECE_VALUES]
      );
    };

    return {
      white: sortPieces(captured.white),
      black: sortPieces(captured.black),
    };
  };

  const capturedPieces = getCapturedPieces();

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
        <div className='flex flex-col gap-1'>
          <CapturedPieces
            pieces={capturedPieces[isFlipped ? 'white' : 'black']}
            color={isFlipped ? 'white' : 'black'}
            isFlipped={isFlipped}
          />
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
                            dominationCount={
                              showHints
                                ? domination[actualRow][actualCol]
                                : undefined
                            }
                          >
                            <div
                              className={`relative w-full h-full flex items-center justify-center cursor-pointer ${
                                showHints
                                  ? getDominationStyle(
                                      domination[actualRow][actualCol]
                                    )
                                  : ''
                              } ${getSquareHighlight(actualRow, actualCol)}`}
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
          <CapturedPieces
            pieces={capturedPieces[isFlipped ? 'black' : 'white']}
            color={isFlipped ? 'black' : 'white'}
            isFlipped={isFlipped}
          />
        </div>
        <div className='flex flex-col gap-4 w-full lg:w-auto'>
          <div className='flex gap-2 justify-center lg:justify-start'>
            <button
              onClick={() => setIsFlipped((prev) => !prev)}
              className='p-1 px-2 bg-gray-700 rounded hover:bg-gray-600 text-gray-200 flex items-center gap-2'
            >
              🔄
            </button>
            <button
              onClick={() => setShowHints((prev) => !prev)}
              className='p-1 px-2 bg-gray-700 rounded hover:bg-gray-600 text-gray-200 flex items-center gap-2'
              title='Toggle Hints'
            >
              {showHints ? '💡' : '🔌'}
            </button>
          </div>
          <GameStatus
            pieces={pieces}
            domination={domination}
            isInCheck={isInCheck}
            isGameOver={isGameOver}
            currentTurn={currentTurn}
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
