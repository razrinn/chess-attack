import { FC, useEffect, useRef, useMemo } from 'react';

interface Move {
  from: { row: number; col: number };
  to: { row: number; col: number };
  piece: {
    type: 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
    color: 'white' | 'black';
  };
}

interface MoveHistoryProps {
  moves: Move[];
  currentMove: number;
  onMoveSelect: (index: number) => void;
}

export const MoveHistory: FC<MoveHistoryProps> = ({
  moves,
  currentMove,
  onMoveSelect,
}) => {
  const getSquareName = (row: number, col: number) => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    return `${files[col]}${ranks[row]}`;
  };

  const getPGNNotation = (move: Move, index: number) => {
    const pieceSymbols: Record<string, string> = {
      king: 'K',
      queen: 'Q',
      rook: 'R',
      bishop: 'B',
      knight: 'N',
      pawn: '',
    };

    // Handle castling
    if (
      move.piece.type === 'king' &&
      Math.abs(move.to.col - move.from.col) === 2
    ) {
      return move.to.col > move.from.col ? 'O-O' : 'O-O-O';
    }

    let notation = '';

    // Add piece symbol (except for pawns)
    if (move.piece.type !== 'pawn') {
      notation += pieceSymbols[move.piece.type];
    }

    // For pawns, add file if it's a capture
    if (move.piece.type === 'pawn' && move.from.col !== move.to.col) {
      notation += getSquareName(move.from.row, move.from.col)[0];
    }

    // Add 'x' for captures
    if (index > 0) {
      const prevMove = moves[index - 1];
      if (
        prevMove &&
        moves.some(
          (m) =>
            m.to.row === move.to.row &&
            m.to.col === move.to.col &&
            index > moves.indexOf(m)
        )
      ) {
        notation += 'x';
      }
    }

    // Add destination square
    notation += getSquareName(move.to.row, move.to.col);

    return notation;
  };

  // Group moves into pairs for display using useMemo
  const movePairs = useMemo(() => {
    const pairs = [];
    for (let i = 0; i < moves.length; i += 2) {
      pairs.push({
        number: Math.floor(i / 2) + 1,
        white: moves[i],
        black: moves[i + 1],
      });
    }
    return pairs;
  }, [moves]); // Only recalculate when moves array changes

  const movesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (movesContainerRef.current && currentMove === moves.length - 1) {
      movesContainerRef.current.scrollTop =
        movesContainerRef.current.scrollHeight;
    }
  }, [moves.length, currentMove]);

  // Add keyboard event listener
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        // Prevent scrolling
        event.preventDefault();
        if (currentMove > -1) {
          onMoveSelect(currentMove - 1);
        }
      } else if (event.key === 'ArrowRight') {
        // Prevent scrolling
        event.preventDefault();
        if (currentMove < moves.length - 1) {
          onMoveSelect(currentMove + 1);
        }
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyPress);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentMove, moves.length, onMoveSelect]);

  return (
    <div className='w-full lg:w-64 bg-gray-800 shadow-md rounded-lg p-4 text-gray-200'>
      <h2 className='text-lg font-bold mb-4 text-center lg:text-left'>
        Move History
      </h2>
      <div className='flex gap-2 mb-4 justify-center lg:justify-start flex-wrap'>
        <button
          className='px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50 text-gray-200'
          onClick={() => onMoveSelect(-1)}
          disabled={currentMove === -1}
        >
          {'<<'}
        </button>
        <button
          className='px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50 text-gray-200'
          onClick={() => onMoveSelect(currentMove - 1)}
          disabled={currentMove <= -1}
        >
          {'<'}
        </button>
        <button
          className='px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50 text-gray-200'
          onClick={() => onMoveSelect(currentMove + 1)}
          disabled={currentMove >= moves.length - 1}
        >
          {'>'}
        </button>
        <button
          className='px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50 text-gray-200'
          onClick={() => onMoveSelect(moves.length - 1)}
          disabled={currentMove === moves.length - 1 || moves.length === 0}
        >
          {'>>'}
        </button>
      </div>
      <div
        ref={movesContainerRef}
        className='max-h-36 lg:max-h-44 overflow-y-scroll scroll-smooth'
      >
        {movePairs.map(({ number, white, black }, index) => (
          <div key={number} className='py-1 flex gap-2'>
            <span className='text-gray-400 w-6 text-sm'>{number}.</span>
            <span
              className={`rounded w-20 text-center text-sm cursor-pointer hover:bg-gray-700 px-2 ${
                index * 2 === currentMove ? 'bg-blue-900' : ''
              }`}
              onClick={() => onMoveSelect(index * 2)}
            >
              {getPGNNotation(white, index * 2)}
            </span>
            {black && (
              <span
                className={`cursor-pointer text-sm w-20 text-center rounded hover:bg-gray-700 px-2 ${
                  index * 2 + 1 === currentMove ? 'bg-blue-900' : ''
                }`}
                onClick={() => onMoveSelect(index * 2 + 1)}
              >
                {getPGNNotation(black, index * 2 + 1)}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
