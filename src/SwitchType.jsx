import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { typeState } from './atomState';

export const SwitchType = () => {
  const [selectedType, setSelectedType] = useRecoilState(typeState);

  const handleSelect = (type) => {
    setSelectedType(type);
  };

  return (
    <Container>
      <Button
        selected={selectedType === "num"}
        onClick={() => handleSelect("num")}
      >
        숫자
      </Button>
      <Button
        selected={selectedType === "char"}
        onClick={() => handleSelect("char")}
      >
        문자
      </Button>
    </Container>
  );
};

export default SwitchType;

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
