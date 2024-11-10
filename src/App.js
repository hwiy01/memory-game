import React from 'react';
import './App.css';
import NumTypeGame from './NumTypeGame';
import CharTypeGame from './CharTypeGame';
import { useState } from 'react';
import SwitchType from './SwitchType';
import styled from 'styled-components';
import SwitchTime from './SwitchTime';
import { useRecoilValue } from 'recoil';
import { typeState } from './atomState';

function App() {
  const type = useRecoilValue(typeState);

  return (
      <Container>
        <GameContainer>
          {type === 'num' && <NumTypeGame />}
          {type === 'char' && <CharTypeGame />}
        </GameContainer>
        <SwitchContainer>
          <SwitchType />
          <SwitchTime />
        </SwitchContainer>
      </Container>
  );
}

export default App;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 500px;
  padding-bottom: 50px;
`;

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const SwitchContainer = styled.div`
  gap: 20px;
`;
