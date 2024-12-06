import { Board } from './components/Board';

function App() {
  return (
    <div className='min-h-screen w-full bg-gray-100 flex items-center justify-center p-4'>
      <div className='max-w-full overflow-auto bg-white rounded-lg shadow-lg p-4'>
        <Board />
      </div>
    </div>
  );
}

export default App;
