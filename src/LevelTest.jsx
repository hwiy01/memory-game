import React, { useRef, useEffect } from 'react';
import { Input } from './components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card2';
import { motion } from "framer-motion";
import { useMemoryGame } from './hooks/useMemoryGame';
import { Button2 } from './components/ui/Button2';
import { useNavigate } from 'react-router';
import { levelTestInst } from './constants/instruction';

export function LevelTest() {
    const navigate = useNavigate();
    const {
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
    } = useMemoryGame();

    const passResult = () => {
        const scoreData = { score }; // 키 이름 중복 제거
        navigate('/beforeGame', { state: scoreData });
    };

  console.log(`Current level: ${level}`);

  const commonStyles = "text-4xl font-bold text-center w-full p-6 h-24 flex items-center justify-center text-white";
  const timerStyles = "text-7xl font-bold text-center w-full p-6 h-24 flex items-center justify-center text-indigo-700";

  const inputRef = useRef(null);

  useEffect(() => {
    if ((gameState === 'inputting' || !errorMessage) && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState, errorMessage]);

  return (
    <Card className="w-full mx-auto bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 shadow-2xl min-h-screen flex flex-col gap-y-4 items-center justify-center">
      <CardHeader className="self-start w-full text-center">
        <CardTitle className="text-3xl font-bold text-indigo-700">레벨 테스트</CardTitle>
      </CardHeader>
      <CardContent className="w-full max-w-md space-y-4">
        {gameState === 'start' &&
      <pre className="text-lg font-medium mb-10">
        {levelTestInst}
      </pre>}
        {gameState !== 'start' && (
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold text-indigo-700">레벨: <span className="text-indigo-700 font-bold">{level}</span></p>
            <p className="text-lg font-semibold text-indigo-700">남은 목숨: <span className="text-indigo-700 font-bold">{lives}</span></p>
            <p className="text-lg font-semibold text-indigo-700">점수: <span className="text-indigo-700 font-bold">{score}</span></p>
          </div>
        )}
  
        <div className="text-center">
          {gameState === 'countdown' && (
            <motion.div
              className="text-7xl font-bold text-indigo-700"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatType: "loop" }}
            >
              {countdown}
            </motion.div>
          )}
          {gameState === 'memorizing' && (
            <div className="text-black text-3xl font-bold">{number}</div>
          )}
          {gameState === 'inputting' && (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Input
                type="text"
                value={userInput}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !errorMessage) {
                    handleSubmit();
                  }
                }}
                onPaste={(e) => e.preventDefault()}
                placeholder={`${level}자리 숫자를 입력하세요`}
                className="text-2xl text-center w-full border-2 border-indigo-400 focus:border-indigo-600 rounded-lg text-black bg-white"
                maxLength={level}
                ref={inputRef}
              />
            </motion.div>
          )}
        </div>
  
        {gameState === 'start' && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex justify-center"
          >
            <Button2 onClick={startGame} className="text-xl py-6 px-8 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold rounded-lg shadow-lg transition duration-300">
              레벨 테스트 시작
            </Button2>
          </motion.div>
        )}
  
        {gameState === 'inputting' && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex justify-center"
          >
            <Button2 
              onClick={handleSubmit} 
              className="w-[100px] bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-3 rounded-lg shadow-lg transition duration-300" 
              disabled={!!errorMessage || userInput.length === 0}
            >
              제출
            </Button2>
          </motion.div>
        )}
  
        {errorMessage && gameState !== 'gameOver' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="text-red-500 text-center font-bold bg-red-100 border border-red-400 rounded-lg p-3"
          >
            {errorMessage}
          </motion.div>
        )}
        {gameState === 'gameOver' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center bg-gray-800 text-white p-6 rounded-lg shadow-lg"
          >
            <p className="text-2xl font-bold mb-4">게임 오버!</p>
            <p className="text-xl mb-6">최종 점수: <span className="text-yellow-400">{score}</span></p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button2 onClick={()=>passResult()} className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300">
                레벨 테스트 완료!
              </Button2>
            </motion.div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}  