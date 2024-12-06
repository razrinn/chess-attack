import { FC, ReactNode } from 'react';

interface LegendProps {
  isFlipped: boolean;
  children?: ReactNode;
}
export const Legend: FC<LegendProps> = ({ isFlipped, children }) => {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  return (
    <div className='flex'>
      {/* Ranks legend (vertical) */}
      <div className='flex flex-col justify-start mr-1 text-sm text-gray-400'>
        {(isFlipped ? [...ranks].reverse() : ranks).map((rank) => (
          <div key={rank} className='h-10 md:h-16 flex items-center'>
            {rank}
          </div>
        ))}
      </div>

      <div>
        {/* Board content */}
        {children}

        {/* Files legend (horizontal) */}
        <div className='flex gap-2 text-sm text-gray-400 mt-1'>
          {(isFlipped ? [...files].reverse() : files).map((file) => (
            <div key={file} className='w-8 md:w-14 text-center'>
              {file}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
