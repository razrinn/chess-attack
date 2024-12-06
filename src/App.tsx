import { Board } from './components/Board';
import Footer from './components/Footer';

function App() {
  return (
    <div className='min-h-screen w-full bg-gray-100 flex flex-col'>
      <div className='flex-1 flex items-center justify-center p-4'>
        <div className='max-w-full overflow-auto bg-white rounded-lg shadow-lg p-4'>
          <Board />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
