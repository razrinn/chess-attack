import { FC } from 'react';

const Header: FC = () => {
  return (
    <header className='w-full py-4 px-6 bg-gray-800 flex justify-center'>
      <div className='flex justify-between items-center container'>
        <div className='flex items-center gap-2'>
          <img src='/favicon.ico' alt='Chess Attack logo' className='w-8 h-8' />
          <span className='font-bold text-gray-200'>Chess Attack!</span>
        </div>
        <a
          href='https://github.com/razrinn/chess-visualizer'
          target='_blank'
          rel='noopener noreferrer'
          className='text-blue-500 hover:text-blue-700 transition-colors'
        >
          GitHub
        </a>
      </div>
    </header>
  );
};

export default Header;
