import logo from './logo.svg';
import './App.css';
import MemoryGame from './MemoryGame';
import { BeforeGame } from './BeforeGame';
import { Routes } from 'react-router';
import { Route } from 'react-router';
import { useState } from 'react';
import Calibration from './Calibration';


function App() {
  //const [calibrationOffsets, setCalibrationOffsets] = useState(null);

  return (

    <Routes>
      <Route path="/" element={<BeforeGame />} />
      <Route path="/memoryGame/:memberId" element={<MemoryGame />} />
    </Routes>

  );
}

export default App;
