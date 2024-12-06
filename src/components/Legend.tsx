import { FC } from 'react';

export const Legend: FC = () => {
  return (
    <div className='bg-gray-800 rounded-lg shadow-md p-3 text-sm text-gray-200'>
      <h3 className='font-bold mb-2'>Square Colors</h3>
      <div className='md:flex gap-2'>
        <div className='flex items-center gap-2'>
          <div className='w-4 h-4 bg-blue-500/30'></div>
          <span>White dominates</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='w-4 h-4 bg-red-500/30'></div>
          <span>Black dominates</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='w-4 h-4 bg-purple-500/30'></div>
          <span>Equal domination</span>
        </div>
      </div>
    </div>
  );
};
