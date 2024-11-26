import logo from './logo.svg';
import './App.css';
import MemoryGame from './MemoryGame';
import { BeforeGame } from './BeforeGame';
import { Routes } from 'react-router';
import { Route } from 'react-router';
import { useState } from 'react';
import Calibration from './Calibration';


function App() {
  const [calibrationOffsets, setCalibrationOffsets] = useState(null);

  return (

    <Routes>
      <Route path="/" element={<Calibration setCalibrationOffsets={setCalibrationOffsets}/>} />
      <Route path="/userForm" element={<BeforeGame />} />
      <Route path="/memoryGame/:memberId" element={<MemoryGame calibrationOffsets={calibrationOffsets}/>} />
    </Routes>

  );
}

export default App;
