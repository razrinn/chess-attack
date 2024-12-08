import { FC, useState } from 'react';
import { Move } from '../types';
import { parsePGN } from '../utils/pgnParser';

interface PGNImportModalProps {
  onClose: () => void;
  onImport: (moves: Move[]) => void;
}

export const PGNImportModal: FC<PGNImportModalProps> = ({
  onClose,
  onImport,
}) => {
  const [pgnText, setPgnText] = useState('');

  const handleImport = () => {
    try {
      const moves = parsePGN(pgnText);
      console.log(moves);
      onImport(moves);
      onClose();
    } catch (error) {
      alert('Invalid PGN format. Please check your input.');
      console.error('PGN parsing error:', error);
    }
  };

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
      <div className='bg-gray-800 p-4 rounded-lg shadow-xl max-w-2xl w-full mx-4'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-lg font-bold text-gray-200'>Import PGN</h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-200'
          >
            ✕
          </button>
        </div>
        <textarea
          className='w-full h-40 bg-gray-700 text-gray-200 p-2 rounded mb-4 font-mono text-sm'
          placeholder='Paste your PGN here...'
          value={pgnText}
          onChange={(e) => setPgnText(e.target.value)}
        />
        <div className='flex justify-end gap-2'>
          <button
            onClick={onClose}
            className='px-4 py-2 bg-gray-700 text-gray-200 rounded hover:bg-gray-600'
          >
            Close
          </button>
          <button
            onClick={handleImport}
            className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500'
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
};
