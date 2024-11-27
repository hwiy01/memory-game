import './App.css';
import MemoryGame from './MemoryGame';
import { BeforeGame } from './BeforeGame';
import { Routes } from 'react-router';
import { Route } from 'react-router';
import { LevelTest } from './LevelTest';


function App() {
  //const [calibrationOffsets, setCalibrationOffsets] = useState(null);

  return (
    <Routes>
      <Route path="/" element={<LevelTest />} />
      <Route path="/beforeGame" element={<BeforeGame />} />
      <Route path="/memoryGame/:memberId" element={<MemoryGame />} />
    </Routes>

  );
}

export default App;
