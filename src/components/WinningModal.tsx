import { FC, useEffect } from 'react';
import confetti from 'canvas-confetti';

interface WinningModalProps {
  winner: 'white' | 'black';
  onRestart: () => void;
  onClose?: () => void;
}

export const WinningModal: FC<WinningModalProps> = ({
  winner,
  onRestart,
  onClose,
}) => {
  useEffect(() => {
    // Fire confetti from the left and right edges
    const duration = 3000;
    const animationEnd = Date.now() + duration;

    const confettiInterval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(confettiInterval);
        return;
      }

      const particleCount = 50;

      // Launch confetti from the left
      confetti({
        particleCount,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#FFD700', '#FFA500', '#FF4500'],
      });

      // Launch confetti from the right
      confetti({
        particleCount,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#FFD700', '#FFA500', '#FF4500'],
      });
    }, 250);

    return () => clearInterval(confettiInterval);
  }, []);

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
      <div className='bg-gray-800 p-6 rounded-lg shadow-xl text-center'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-bold text-gray-200'>
            {winner === 'white' ? 'White' : 'Black'} wins!
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className='text-gray-400 hover:text-gray-200 text-xl'
              aria-label='Close'
            >
              ✕
            </button>
          )}
        </div>
        <p className='text-gray-300 mb-6'>Checkmate! Game Over</p>
        <div className='flex gap-4 justify-center'>
          {onClose && (
            <button
              onClick={onClose}
              className='px-4 py-2 bg-gray-700 text-gray-200 rounded hover:bg-gray-600'
            >
              Close
            </button>
          )}
          <button
            onClick={onRestart}
            className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500'
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};
