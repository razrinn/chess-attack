import { Board } from './components/Board';
import Header from './components/Header';

function App() {
  return (
    <div className='min-h-screen w-full bg-gray-900 flex flex-col'>
      <Header />
      <div className='flex-1 flex flex-col lg:flex-row items-center md:justify-center p-4 gap-4'>
        <div className='bg-gray-800 rounded-lg shadow-lg p-4'>
          <Board />
        </div>
      </div>
    </div>
  );
}

export default App;
