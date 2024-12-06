import { FC } from 'react';

export const Legend: FC = () => {
  return (
    <div className='bg-white rounded-lg shadow-md p-3 text-sm'>
      <h3 className='font-bold mb-2'>Square Colors</h3>
      <div className='md:flex gap-2'>
        <div className='flex items-center gap-2'>
          <div className='w-4 h-4 bg-blue-200/50'></div>
          <span>White dominates</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='w-4 h-4 bg-red-200/50'></div>
          <span>Black dominates</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='w-4 h-4 bg-purple-200/50'></div>
          <span>Equal domination</span>
        </div>
      </div>
    </div>
  );
};
