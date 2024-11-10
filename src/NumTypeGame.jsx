import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useRecoilValue } from 'recoil';
import { timeState } from "./atomState";
import { typeState } from "./atomState";

function NumTypeGame() {
  const limitTime = useRecoilValue(timeState);
  const type = useRecoilValue(typeState);
  const [cards, setCards] = useState([]);
  const [revealed, setRevealed] = useState(Array(16).fill(false)); // 시작 시 모든 카드가 가려진 상태
  const [isHidden, setIsHidden] = useState(false);
  const [targetCard, setTargetCard] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // 카드 및 게임 상태 초기화 함수
  const initializeGame = () => {
    setMessage("");
    setGameOver(false);
    setAttempts(0);
    setGameStarted(false);
    setIsHidden(false);
    setRevealed(Array(16).fill(false)); // 모든 카드 가림
    const newCards = [];
    for (let i = 1; i <= 8; i++) {
      newCards.push(i, i); // 숫자 두 개씩 넣기
    }
    newCards.sort(() => Math.random() - 0.5);
    setCards(newCards);
  };

  useEffect(() => {
    initializeGame();
  }, [limitTime, type]);

  // 게임 시작 버튼 클릭 시 카드 공개 후 타이머 시작
  const startGame = () => {
    setRevealed(Array(16).fill(true)); // "시작" 버튼 클릭 시 카드 공개
    setGameStarted(true);

    setTimeout(() => {
      setRevealed(Array(16).fill(false)); // 제한 시간 후 카드 숨기기
      setIsHidden(true);
      revealRandomCard(cards);
    }, limitTime);
  };

  // 랜덤으로 카드 하나만 공개
  const revealRandomCard = (newCards) => {
    const randomIndex = Math.floor(Math.random() * 16);
    setTargetCard({ index: randomIndex, value: newCards[randomIndex] });
    setRevealed((prevRevealed) =>
      prevRevealed.map((val, idx) => (idx === randomIndex ? true : false))
    );
  };

  // 카드 클릭 시 처리
  const handleCardClick = (index) => {
    if (isHidden && targetCard && index !== targetCard.index && !gameOver) {
      if (cards[index] === targetCard.value) {
        setMessage("맞았습니다");
        setRevealed(Array(16).fill(true));
        setGameOver(true);
        setTargetCard(null);
      } else {
        setAttempts((prev) => prev + 1);
        if (attempts + 1 >= 3) {
          setMessage("틀렸습니다");
          setRevealed(Array(16).fill(true));
          setGameOver(true);
          setTargetCard(null);
        } else {
          setMessage(`다시 시도해주세요`);
        }
      }
    }
  };

  return (
    <div>
      <GameContainer>
        {cards.map((value, index) => (
          <Card
            key={index}
            onClick={() => handleCardClick(index)}
            revealed={revealed[index] || (targetCard && targetCard.index === index)}
            clickable={isHidden && !gameOver && gameStarted}
          >
            {revealed[index] || (targetCard && targetCard.index === index) ? value : ""}
          </Card>
        ))}
      </GameContainer>
      {!gameStarted && (
        <ButtonContainer>
          <StartButton onClick={startGame}>시작</StartButton>
        </ButtonContainer>
      )}
      <Message>{message}</Message>
      {gameOver && (
        <ButtonContainer>
          <RetryButton onClick={initializeGame}>다시 시작하기</RetryButton>
        </ButtonContainer>
      )}
    </div>
  );
}

export default NumTypeGame;

const GameContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  max-width: 220px;
  margin: 20px auto;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.revealed ? "lightblue" : "gray")};
  color: ${(props) => (props.revealed ? "black" : "transparent")};
  cursor: ${(props) => (props.clickable ? "pointer" : "default")};
  border: 1px solid #000;
  font-size: 70px;
  font-weight: bold;
`;

const Message = styled.div`
  text-align: center;
  margin-top: 20px;
  font-size: 24px;
  font-weight: bold;
  color: ${(props) => (props.children.includes("틀렸습니다") ? "red" : "green")};
`;

const StartButton = styled.button`
  font-size: 24px;
  font-weight: bold;
  padding: 10px 20px;
  cursor: pointer;
  background-color: green;
  color: white;
  border: none;
  border-radius: 5px;
`;

const RetryButton = styled.button`
  font-size: 24px;
  font-weight: bold;
  padding: 10px 20px;
  cursor: pointer;
  background-color: orange;
  color: white;
  border: none;
  border-radius: 5px;
  margin-top: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;
