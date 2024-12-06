import { FC, useEffect, useRef } from 'react';

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
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const movesContainerRef = useRef<HTMLDivElement>(null);

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

  // Group moves into pairs for display
  const movePairs = [];
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      number: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1],
    });
  }

  useEffect(() => {
    if (movesContainerRef.current && currentMove === moves.length - 1) {
      movesContainerRef.current.scrollTop =
        movesContainerRef.current.scrollHeight;
    }
  }, [moves.length, currentMove]);

  return (
    <div className='w-full sm:w-64 bg-gray-800 shadow-md rounded-lg p-4 text-gray-200'>
      <h2 className='text-lg font-bold mb-4'>Move History</h2>
      <div className='flex gap-2 mb-4 flex-wrap'>
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
        className='max-h-48 overflow-y-auto scroll-smooth'
      >
        {movePairs.map(({ number, white, black }, index) => (
          <div key={number} className='p-2 flex gap-2'>
            <span className='text-gray-400 w-6'>{number}.</span>
            <span
              className={`cursor-pointer hover:bg-gray-700 px-2 ${
                index * 2 === currentMove ? 'bg-blue-900' : ''
              }`}
              onClick={() => onMoveSelect(index * 2)}
            >
              {getPGNNotation(white, index * 2)}
            </span>
            {black && (
              <span
                className={`cursor-pointer hover:bg-gray-700 px-2 ${
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
