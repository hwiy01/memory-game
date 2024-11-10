import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { timeState } from './atomState';

export const SwitchTime = () => {
    const [selectedTime, setSelectedTime] = useRecoilState(timeState);

  const handleSelect = (time) => {
    setSelectedTime(time); // 선택된 시간을 상위 컴포넌트로 전달
  };

  return (
    <Container>
      <Button
        selected={selectedTime === 5000}
        onClick={() => handleSelect(5000)}
      >
        5초
      </Button>
      <Button
        selected={selectedTime === 8000}
        onClick={() => handleSelect(8000)}
      >
        8초
      </Button>
      <Button
        selected={selectedTime === 10000}
        onClick={() => handleSelect(10000)}
      >
        10초
      </Button>
    </Container>
  );
};

export default SwitchTime;

const Container = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const Button = styled.button`
  font-size: 18px;
  padding: 10px 20px;
  margin: 0 5px;
  cursor: pointer;
  font-weight: bold;
  border: none;
  background-color: ${(props) => (props.selected ? "blue" : "lightgray")};
  color: white;
  border-radius: 5px;

  &:hover {
    background-color: ${(props) => (props.selected ? "darkblue" : "gray")};
  }
`;
