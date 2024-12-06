import { Board } from './components/Board';
import Footer from './components/Footer';

function App() {
  return (
    <div className='min-h-screen w-full bg-gray-900 flex flex-col'>
      <div className='flex-1 flex items-center justify-center p-8'>
        <div className='bg-gray-800 rounded-lg shadow-lg p-6'>
          <Board />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
