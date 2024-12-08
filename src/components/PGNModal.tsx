import { FC } from 'react';

interface PGNModalProps {
  pgn: string;
  onClose: () => void;
  onDownload: () => void;
}

export const PGNModal: FC<PGNModalProps> = ({ pgn, onClose, onDownload }) => {
  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
      <div className='bg-gray-800 p-4 rounded-lg shadow-xl max-w-2xl w-full mx-4'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-lg font-bold text-gray-200'>PGN Export</h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-200'
          >
            ✕
          </button>
        </div>
        <textarea
          value={pgn}
          readOnly
          className='w-full h-40 bg-gray-700 text-gray-200 p-2 rounded mb-4 font-mono text-sm'
          onClick={(e) => (e.target as HTMLTextAreaElement).select()}
        />
        <div className='flex justify-end gap-2'>
          <button
            onClick={onClose}
            className='px-4 py-2 bg-gray-700 text-gray-200 rounded hover:bg-gray-600'
          >
            Close
          </button>
          <button
            onClick={onDownload}
            className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 flex items-center gap-2'
          >
            <span>Download PGN</span>
            <span>📥</span>
          </button>
        </div>
      </div>
    </div>
  );
};
