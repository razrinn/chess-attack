import { FC } from 'react';

export const Legend: FC = () => {
  return (
    <div className='bg-gray-800 rounded-lg shadow-md p-3 text-sm text-gray-200'>
      <h3 className='font-bold mb-2'>Square Control</h3>
      <div className='md:flex gap-4'>
        <div className='flex items-center gap-2'>
          <div className='flex items-center gap-1'>
            <div className='w-2 h-2 rounded-full bg-blue-400/70' />
            <span className='text-[10px] font-semibold text-blue-400/70'>
              2
            </span>
          </div>
          <span>White controls</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='flex items-center gap-1'>
            <div className='w-2 h-2 rounded-full bg-red-400/70' />
            <span className='text-[10px] font-semibold text-red-400/70'>2</span>
          </div>
          <span>Black controls</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='flex items-center gap-1'>
            <div className='w-2 h-2 rounded-full bg-blue-400/70' />
            <span className='text-[10px] font-semibold text-blue-400/70'>
              2
            </span>
            <span className='text-gray-400'>·</span>
            <div className='w-2 h-2 rounded-full bg-red-400/70' />
            <span className='text-[10px] font-semibold text-red-400/70'>2</span>
          </div>
          <span>Contested square</span>
        </div>
      </div>
    </div>
  );
};
