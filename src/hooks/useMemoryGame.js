import { useState, useCallback, useRef } from 'react';

export function useMemoryGame() {
  const [level, setLevel] = useState(1);
  const [number, setNumber] = useState('');
  const [userInput, setUserInput] = useState('');
  const [lives, setLives] = useState(2);
  const [gameState, setGameState] = useState('start');
  const [score, setScore] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [errorMessage, setErrorMessage] = useState('');
  const currentNumber = useRef('');

  const generateNumber = useCallback((length) => {
    let result = '';
    for (let i = 0; i < length; i++) {
      if (i === 0) {
        result += Math.floor(Math.random() * 9 + 1).toString();
      } else {
        result += Math.floor(Math.random() * 10).toString();
      }
      console.log('i:', i, 'result:', result);
    }
    return result;
  }, []);

  const startNewRound = useCallback((currentLevel) => {
    setGameState('countdown');
    setCountdown(3);
    setErrorMessage('');
    const countdownInterval = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(countdownInterval);
          console.log('Current Level:', currentLevel);
          const newNumber = generateNumber(currentLevel);
          setNumber(newNumber);
          currentNumber.current = newNumber;
          setUserInput('');
          setGameState('memorizing');
          setTimeout(() => {
            setNumber('');
            setGameState('inputting');
          }, currentLevel * 1000);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
  }, [generateNumber]);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = () => {
    if (!/^\d+$/.test(userInput)) {
      setErrorMessage('숫자를 입력하세요.');
      setTimeout(() => {
        setErrorMessage('');
        setUserInput('');
      }, 3000);
      return;
    }

    if (userInput === currentNumber.current) {
      setLevel((prevLevel) => {
        const newLevel = prevLevel + 1;
        setScore((prevScore) => prevScore + 1);
        setTimeout(() => {
          startNewRound(newLevel);
        }, 500);
        return newLevel;
      });
    } else {
      setLives((prevLives) => {
        const newLives = prevLives - 1;
        if (newLives === 0) {
          setGameState('gameOver');
        } else {
          setErrorMessage('틀렸습니다. 다시 시도해보세요.');
          setTimeout(() => {
            setErrorMessage('');
            startNewRound(level);
          }, 2000);
        }
        return newLives;
      });
    }
  };

  const startGame = () => {
    setLevel(1);
    setLives(2);
    setScore(0);
    setErrorMessage('');
    startNewRound(1);
  };

  const restartGame = () => {
    setGameState('start');
    setLevel(1);
    setLives(2);
    setScore(0);
    setErrorMessage('');
  };

  return {
    level,
    number,
    userInput,
    lives,
    gameState,
    score,
    countdown,
    errorMessage,
    handleInputChange,
    handleSubmit,
    startGame,
    restartGame
  };
}

