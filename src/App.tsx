import { Board } from './components/Board';
import Footer from './components/Footer';

function App() {
  return (
    <div className='min-h-screen w-full bg-gray-900 flex flex-col'>
      <div className='flex-1 flex flex-col lg:flex-row items-center justify-center p-4 gap-4'>
        <div className='bg-gray-800 rounded-lg shadow-lg p-4'>
          <Board />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
