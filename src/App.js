import logo from './logo.svg';
import './App.css';
import MemoryGame from './MemoryGame';
import { BeforeGame } from './BeforeGame';
import { Router, Routes } from 'react-router';
import { Route } from 'react-router';


function App() {
  return (

    <Routes>
      <Route path="/" element={<BeforeGame />} />
      <Route path="/memoryGame" element={<MemoryGame />} />
    </Routes>

  );
}

export default App;
