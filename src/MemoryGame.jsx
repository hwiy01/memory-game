import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { CalculatorIcon as Numbers, ListOrderedIcon as AlphabeticalOrder, Shapes, Languages } from 'lucide-react'
import { Card, CardContent } from './components/ui/Card'
import Button from './components/ui/Button'
import './index.css';
import { fetchGameResult } from './apis/userGameData'
import { arrayToString } from './utils/arrayToString'
import { useParams } from 'react-router'

const cardSets = {
  NUMBER: {
    3: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    4: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'],
    5: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25']
  },
  SHAPE: {
    3: ['■', '●', '▲', '◆', '★', '♥', '♠', '♣', '♦'],
    4: ['■', '●', '▲', '◆', '★', '♥', '♠', '♣', '♦','□', '○', '△', '◇', '☆', '♡', '♢'],
    5: ['■', '●', '▲', '◆', '★', '♥', '♠', '♣', '♦','□', '○', '△', '◇', '☆', '♡', '♢', '♤', '♧', '▼', '▶', '◀', '♩', '♪', '♫', '♬']
  },
  ARABIC: {
    3: ['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ'],
    4: ['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ','ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط'],
    5: ['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ','ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن'],
  },
  ALPHABET: {
    3: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
    4: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'],
    5: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y']
  }
}

const avaliableCardSets = {
    NUMBER: {
        3: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
        4: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'],
        5: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25']
      },
      SHAPE: {
        3: ['■', '●', '▲', '◆', '★', '♥', '♠', '♣', '♦'],
        4: ['■', '●', '▲', '◆', '★', '♥', '♠', '♣', '♦','□', '○', '△', '◇', '☆', '♡', '♢'],
        5: ['■', '●', '▲', '◆', '★', '♥', '♠', '♣', '♦','□', '○', '△', '◇', '☆', '♡', '♢', '♤', '♧', '▼', '▶', '◀', '♩', '♪', '♫', '♬']
      },
      ARABIC: {
        3: ['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ'],
        4: ['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ','ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط'],
        5: ['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ','ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن'],
      },
      ALPHABET: {
        3: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
        4: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'],
        5: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y']
      }
}

const generateCards = (count, type, gridSize) => {
  let set = [...cardSets[type][gridSize]]
  return set
}

export default function MemoryGame() {
  const { memberId } = useParams();
  const [gridSize, setGridSize] = useState(3)
  const [cardType, setCardType] = useState('NUMBER')
  const [cards, setCards] = useState([])
  const [userCards, setUserCards] = useState([])
  const [visibleCards, setVisibleCards] = useState([])
  const [gameStarted, setGameStarted] = useState(false)
  const [availableCards, setAvailableCards] = useState([])
  const [clearedCards, setClearedCards] = useState([])
  const [selectedCard, setSelectedCard] = useState(null)
  const [gameEnded, setGameEnded] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [endTime, setEndTime] = useState(null)
  const [finalScore, setFinalScore] = useState(null)
  const [initialCardsVisible, setInitialCardsVisible] = useState(true)
  const [countdown, setCountdown] = useState(null)
  const [showGameContent, setShowGameContent] = useState(false)
  const [gameResult, setGameResult] = useState(null);

  // const [gazeData, setGazeData] = useState([]);
  // const [isTracking, setIsTracking] = useState(false);
  // const canvasRef = useRef(null);

  // eyetracking 내용 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // const FIXATION_RADIUS = 10; // Fixation의 영역 반경 (픽셀)
  // const FIXATION_DURATION = 200; // Fixation의 최소 지속 시간 (밀리초)
  // const SACCADE_SPEED_THRESHOLD = 0.4; // Saccade로 간주할 속도 (픽셀/ms)

  // const startTracking = () => {
  //   setGazeData([]); // 기존 데이터 초기화
  //   setIsTracking(true);
  
  //   // WebGazer 시작
  //   window.webgazer.setGazeListener((data, timestamp) => {
  //     if (data) {
  //       const calibratedData = applyCalibrationOffsets(data.x, data.y, calibrationOffsets);

  //       setGazeData((prevData) => [
  //         ...prevData,
  //         { x: calibratedData.x, y: calibratedData.y, timestamp },
  //       ]);
  //     }
  //   }).begin();
  
  //   window.webgazer.showVideo(false); // 웹캠 미리보기 숨김
  //   window.webgazer.showFaceOverlay(false); // 얼굴 오버레이 숨김
  //   window.webgazer.showFaceFeedbackBox(false); // 얼굴 피드백 박스 숨김
  // };  

  // function applyCalibrationOffsets(x, y, offsets) {
  //   return {
  //     x: x + offsets.x,
  //     y: y + offsets.y,
  //   };
  // }
  
  // const stopTracking = () => {
  //   window.webgazer.end();
  //   setIsTracking(false);

  //   const { fixations, saccades } = analyzeGazeData(gazeData);

  //   const canvas = canvasRef.current;
  //   if(canvas) {
  //     const { width, height } = canvas.getBoundingClientRect();
  //     canvas.width = width; 
  //     canvas.height = height; 
  //     drawFixationsAndSaccades(canvas, fixations, saccades);
  //     saveCanvasAsImage(canvas);
  //   }
  // };

  // function analyzeGazeData(data) {
  //   const fixations = [];
  //   const saccades = [];
  
  //   let currentFixation = null;
  
  //   for (let i = 1; i < data.length; i++) {
  //     const prev = data[i - 1];
  //     const curr = data[i];
  
  //     const dx = curr.x - prev.x;
  //     const dy = curr.y - prev.y;
  //     const distance = Math.sqrt(dx * dx + dy * dy);
  //     const timeDelta = curr.timestamp - prev.timestamp;
  //     const speed = distance / timeDelta;
  
  //     if (
  //       currentFixation &&
  //       distance <= FIXATION_RADIUS &&
  //       curr.timestamp - currentFixation.startTimestamp <= FIXATION_DURATION
  //     ) {
  //       // Fixation 지속
  //       currentFixation.endTimestamp = curr.timestamp;
  //       currentFixation.points.push(curr);
  //     } else if (distance <= FIXATION_RADIUS) {
  //       // 새로운 Fixation 시작
  //       currentFixation = {
  //         startTimestamp: curr.timestamp,
  //         endTimestamp: curr.timestamp,
  //         x: curr.x,
  //         y: curr.y,
  //         points: [curr],
  //       };
  //       fixations.push(currentFixation);
  //     } else if (speed > SACCADE_SPEED_THRESHOLD) {
  //       // Saccade로 간주
  //       saccades.push({
  //         from: prev,
  //         to: curr,
  //         speed,
  //       });
  //       currentFixation = null; // Fixation 초기화
  //     }
  //   }
  
  //   return { fixations, saccades };
  // }

  // function drawFixationsAndSaccades(canvas, fixations, saccades) {
  //   const ctx = canvas.getContext("2d");
  
  //   // Fixation 그리기 (원)
  //   fixations.forEach((fixation) => {
  //     ctx.beginPath();
  //     ctx.arc(fixation.x, fixation.y, 10, 0, 2 * Math.PI); // 반경 10px
  //     ctx.fillStyle = "blue"; // Fixation 색상
  //     ctx.globalAlpha = 0.5; // 투명도
  //     ctx.fill();
  //     ctx.closePath();
  //   });
  
  //   // Saccade 그리기 (선)
  //   saccades.forEach((saccade) => {
  //     ctx.beginPath();
  //     ctx.moveTo(saccade.from.x, saccade.from.y);
  //     ctx.lineTo(saccade.to.x, saccade.to.y);
  //     ctx.strokeStyle = "red"; // Saccade 색상
  //     ctx.lineWidth = 2; // 선 굵기
  //     ctx.globalAlpha = 1.0; // 불투명
  //     ctx.stroke();
  //     ctx.closePath();
  //   });
  // }


  // const saveCanvasAsImage = (canvas) => {
  //   const imageData = canvas.toDataURL("image/png"); // 캔버스를 Base64로 변환
  
  //   console.log('imageData',imageData);
  //   // 서버로 전송
  //   // fetch("https://your-backend-url.com/upload-image", {
  //   //   method: "POST",
  //   //   headers: {
  //   //     "Content-Type": "application/json",
  //   //   },
  //   //   body: JSON.stringify({ image: imageData }),
  //   // })
  //   //   .then((response) => {
  //   //     if (!response.ok) {
  //   //       throw new Error("Failed to upload image");
  //   //     }
  //   //     return response.json();
  //   //   })
  //   //   .then((data) => {
  //   //     console.log("Image uploaded successfully:", data);
  //   //   })
  //   //   .catch((error) => {
  //   //     console.error("Error uploading image:", error);
  //   //   });
  // };
  

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


  useEffect(() => {
    if (gameStarted && countdown !== null) {
      if (countdown > 0) {
        const now = Date.now();
        const nextSecond = Math.ceil(now / 1000) * 1000;
        const delay = nextSecond - now;
        
        const timer = setTimeout(() => {
          setCountdown(countdown - 1);
        }, delay);
        
        return () => clearTimeout(timer);
      } else {
        const newCards = generateCards(gridSize * gridSize, cardType, gridSize);
        setCards(newCards);
        setUserCards(new Array(gridSize * gridSize).fill(null));
        setVisibleCards(new Array(gridSize * gridSize).fill(true));

        // const sortedAvailableCards = [...new Set(newCards)].sort((a, b) => {
        //     const aIndex = cardSets[cardType][gridSize].indexOf(a)
        //     const bIndex = cardSets[cardType][gridSize].indexOf(b)
        //     return aIndex - bIndex
        // })

        setAvailableCards(avaliableCardSets[cardType][gridSize]);

        setClearedCards([])
        setTimeout(() => setShowGameContent(true), 100)

        const visibleTime = gridSize * gridSize * 1.5 * 1000
        const timeout = setTimeout(() => {
          setVisibleCards(new Array(gridSize * gridSize).fill(false))
          setInitialCardsVisible(false)
          setStartTime(Date.now())
          //stopTracking();
        }, visibleTime)

        return () => clearTimeout(timeout)
      }
    }
  }, [gameStarted, countdown, gridSize, cardType])


  const handleCardClick = (card) => {
    if (!gameStarted || initialCardsVisible) return;
    setSelectedCard(card);
  }

  const handleCellClick = (index) => {
    if (!gameStarted || initialCardsVisible) return;
    if (selectedCard) {
      const newUserCards = [...userCards];
      const oldCard = newUserCards[index];
      newUserCards[index] = selectedCard;
      setUserCards(newUserCards);
      
      if (selectedCard === cards[index]) {
        setClearedCards(prev => [...prev, selectedCard]);
      }
      setSelectedCard(null);

    } else if (userCards[index] !== null) {
      const removedCard = userCards[index];
      const newUserCards = [...userCards];
      newUserCards[index] = null;
      setUserCards(newUserCards);

      if (removedCard) {
        setClearedCards(prev => prev.filter(card => card !== removedCard));
      }
    }
  }

  const GridSizeOption = ({ size }) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        variant={gridSize === size ? "default" : "outline"}
        className={`w-20 h-20 flex flex-col items-center justify-center ${
         gridSize === size ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white' : 'bg-white bg-opacity-60 text-indigo-700'
       } rounded-lg shadow-md transition-all duration-300 hover:shadow-lg`}
        onClick={() => setGridSize(size)}
      >
        <span className="text-2xl font-bold">{size}x{size}</span>
        <span className="text-sm">Grid</span>
      </Button>
    </motion.div>
  )

  const CardTypeOption = ({ type, label, icon: Icon }) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        variant={cardType === type ? "default" : "outline"}
        className={`w-24 h-24 flex flex-col items-center justify-center ${
          cardType === type ? 'bg-gradient-to-r from-blue-400 to-teal-400 text-white' : 'bg-white bg-opacity-60 text-indigo-700'
        } rounded-lg shadow-md transition-all duration-300 hover:shadow-lg`}
        onClick={() => setCardType(type)}
      >
        <Icon className="w-8 h-8 mb-2" />
        <span className="text-sm">{label}</span>
      </Button>
    </motion.div>
  )

  const startGame = () => {
    setGameStarted(true);
    setGameEnded(false);
    setInitialCardsVisible(true);
    setSelectedCard(null);
    setStartTime(null);
    setEndTime(null);
    setFinalScore(null);
    setClearedCards([]);
    
    const now = Date.now();
    const nextSecond = Math.ceil(now / 1000) * 1000;
    const delay = nextSecond - now;
    
    setTimeout(() => {
      setCountdown(3);
    }, delay);
    
    setShowGameContent(false);

    //webGazer 시작
    //startTracking();
  };

  const resetGame = () => {
    setGameStarted(false)
    setGameEnded(false)
    setCards([])
    setUserCards([])
    setVisibleCards([])
    setSelectedCard(null)
    setStartTime(null)
    setEndTime(null)
    setFinalScore(null)
    setInitialCardsVisible(true)
    setCountdown(null)
    setShowGameContent(false)
    setClearedCards([])
  }

  const submitGame = async () => {
    setGameEnded(true)
    setEndTime(Date.now())
    
    if (startTime) {
      let correct = 0
      let incorrect = 0
      for (let i = 0; i < cards.length; i++) {
        if (cards[i] === userCards[i]) {
          correct++
        } else {
          incorrect++
        }
      }
      setFinalScore({ correct, incorrect, time: (Date.now() - startTime) / 1000 })
      
      setGameResult(
        {
          card_count: gridSize * gridSize,
          card_type: cardType,
          solved_time: Date.now() - startTime,
          user_answer: arrayToString(userCards),
          wrong_count: incorrect
        }
      )
    }
  }

  useEffect(() => {
    if (gameResult && Object.keys(gameResult).length > 0) {
      fetchGameResult(memberId, gameResult);
    }
  }, [gameResult]);


  const ResultGrid = ({ answers, isUserGrid }) => (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
      {answers.map((answer, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Card
            className={`w-20 h-20 flex items-center justify-center ${
              (isUserGrid && answer !== cards[index]) || (!isUserGrid && userCards[index] !== cards[index])
                ? 'border-2 border-red-500'
                : ''
            } bg-white bg-opacity-80 backdrop-blur-sm`}
          >
            <CardContent className="flex items-center justify-center w-full h-full text-xl font-bold p-0 text-indigo-700">
              {isUserGrid ? (answer || '?') : cards[index]}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )

  return (
    <div className="container mx-auto p-4 min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 overflow-hidden flex flex-col">
      <h1 className="text-4xl font-bold mb-8 text-center text-indigo-700">Memory Game</h1>
      <AnimatePresence mode="wait">
        {!gameStarted ? (
          <motion.div 
            key="main-menu"
            className="space-y-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
          >
            <div>
    
              <h2 className="text-2xl font-semibold mb-4 text-center text-indigo-600">Select Grid Size</h2>
              <div className="flex justify-center space-x-4">
                <GridSizeOption size={3} />
                <GridSizeOption size={4} />
                <GridSizeOption size={5} />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-center text-indigo-600">Select Card Type</h2>
              <div className="flex justify-center space-x-4">
                <CardTypeOption type="NUMBER" label="Numbers" icon={Numbers} />
                <CardTypeOption type="ALPHABET" label="Alphabet" icon={AlphabeticalOrder} />
                <CardTypeOption type="SHAPE" label="Shapes" icon={Shapes} />
                <CardTypeOption type="ARABIC" label="Arabic" icon={Languages} />
              </div>
            </div>
            <div className="flex justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={startGame} 
                  className="px-8 py-4 bg-gradient-to-r from-purple-400 to-pink-400 text-white text-xl font-bold rounded-full shadow-md transition-all duration-300 hover:shadow-lg"
                >
                  Start Game
                </Button>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <div>
            {!gameEnded ? (
              <motion.div
                key="game-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5}}
              >
                <AnimatePresence mode="wait">
                  {countdown !== null && countdown > 0 ? (
                    <motion.div
                      key="countdown"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex justify-center items-center h-[60vh] relative perspective-[1000px]"
                    >
                      <motion.span 
                        key={countdown}
                        className="text-7xl font-bold text-indigo-600 absolute"
                        initial={{ opacity: 0, scale: 0.5, z: -100 }}
                        animate={{ opacity: 1, scale: 1, z: 0 }}
                        exit={{ opacity: 0, scale: 1.5, z: 100 }}
                        transition={{ duration: 0.5 }}
                      >
                        {countdown}
                      </motion.span>
                    </motion.div>
                  ) : showGameContent ? (
                    
                    <motion.div
                      key="game-grid"
                      initial={{ opacity: 0, y: -50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, when: "beforeChildren", staggerChildren: 0.1 }}
                    >

                      <div 
                           className="flex flex-col items-center mb-6" >
                                                  
                        {/* <canvas
                          ref={canvasRef}
                          id="gazeCanvas"
                          style={{
                            display: "block", 
                            position: "absolute",
                            zIndex: 999,
                            border: "1px solid black",
                            pointerEvents: "none", // 캔버스 클릭 방지
                            width: "500px",
                            height: "500px"
                          }}
                        ></canvas> */}
                        <h3 className="text-2xl font-semibold mb-4 text-center text-indigo-600">Memory Grid</h3>
                        <div className="grid gap-2 justify-center items-center mb-4" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)`, width: 'min(100%, 400px)', margin: '0 auto' }}>
                          {cards.map((card, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: -20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                              <Card
                                className={`aspect-square flex items-center justify-center ${
                                  !gameStarted || initialCardsVisible ? 'cursor-not-allowed pointer-events-none' : 'cursor-pointer'
                                } ${
                                  selectedCard && !visibleCards[index] && userCards[index] === null ? 'border-2 border-purple-400' : ''
                                } bg-white bg-opacity-100 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-xl`}
                                onClick={() => handleCellClick(index)}
                              >
                                <CardContent className="flex items-center justify-center w-full h-full text-xl font-bold p-0 text-indigo-700">
                                  {visibleCards[index] ? card : (userCards[index] || '?')}
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      <h3 className="text-2xl font-semibold mb-2 text-center text-indigo-600">Available Cards</h3>
                      {gridSize === 5 ? (
                        <div className={`flex flex-col items-center gap-3 mb-4 py-2 `} style={{ margin: '0 auto', maxWidth: '700px' }}>
                          <div className="flex justify-center items-center gap-3 mb-2">
                            {availableCards.slice(0, 13).map((card, index) => (
                              <motion.div
                                key={card}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: clearedCards.includes(card) ? 0 : 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Card
                                  className={`w-12 h-12 flex-shrink-0 flex items-center justify-center ${
                                    !gameStarted ? 'cursor-not-allowed pointer-events-none' : 'cursor-pointer'
                                  } ${
                                    selectedCard === card ? 'border-2 border-blue-500' : ''
                                  } bg-white bg-opacity-80 backdrop-blur-sm shadow-md transition-all duration-300 hover:shadow-xl`}
                                  onClick={() => handleCardClick(card)}
                                >
                                  <CardContent className="flex items-center justify-center w-full h-full text-sm font-bold p-0 text-indigo-700">
                                    {card}
                                  </CardContent>
                                </Card>
                              </motion.div>
                            ))}
                          </div>
                          <div className="flex justify-center items-center gap-3">
                            {availableCards.slice(13).map((card, index) => (
                              <motion.div
                                key={card}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: clearedCards.includes(card) ? 0 : 1, y: 0 }}
                                transition={{ duration: 0.3, delay: (index + 13) * 0.05 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Card
                                  className={` w-12 h-12 flex-shrink-0 flex items-center justify-center ${
                                    !gameStarted ? 'cursor-not-allowed pointer-events-none' : 'cursor-pointer'
                                  } ${
                                    selectedCard === card ? 'border-2 border-blue-500' : ''
                                  } bg-white bg-opacity-80 backdrop-blur-sm shadow-md transition-all duration-300 hover:shadow-xl`}
                                  onClick={() => handleCardClick(card)}
                                >
                                  <CardContent className="flex items-center justify-center w-full h-full text-sm font-bold p-0 text-indigo-700">
                                    {card}
                                  </CardContent>
                                </Card>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className={`flex flex-wrap justify-center items-center gap-3 mb-4 py-2 ${gridSize === 5 ? 'max-w-5xl' : ''}`} style={{ margin: '0 auto', maxWidth: gridSize === 5 ? '700px' : 'auto' }}>
                          {availableCards.map((card, index) => (
                            <motion.div
                              key={card}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: clearedCards.includes(card) ? 0 : 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={gridSize === 5 ? `${index < 13 ? 'mb-2' : ''}` : ''}
                            >
                              <Card
                                className={`w-12 h-12 flex-shrink-0 flex items-center justify-center ${
                                  !gameStarted ? 'cursor-not-allowed pointer-events-none' : 'cursor-pointer'
                                } ${
                                  selectedCard === card ? 'border-2 border-blue-500' : ''
                                } bg-white bg-opacity-80 backdrop-blur-sm shadow-md transition-all duration-300 hover:shadow-xl`}
                                onClick={() => handleCardClick(card)}
                              >
                                <CardContent className="flex items-center justify-center w-full h-full text-sm font-bold p-0 text-indigo-700">
                                  {card}
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      )}
                      <div className="flex justify-center mt-4 space-x-4"> 
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button 
                            onClick={()=>resetGame()} 
                            className="px-4 py-2 bg-gradient-to-r from-red-400 to-pink-400 text-white font-bold rounded-full shadow-md transition-all duration-300 hover:shadow-lg" 
                          >
                            Exit
                          </Button>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button 
                            onClick={()=>submitGame()} 
                            className="px-4 py-2 bg-gradient-to-r from-green-400 to-blue-400 text-white font-bold rounded-full shadow-md transition-all duration-300 hover:shadow-lg" 
                            disabled={initialCardsVisible}
                          >
                            Submit
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                key="game-results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center"
              >
                <div className="flex justify-center space-x-8 mb-8">
                  <div>
                    <h3 className="text-2xl font-semibold mb-4 text-center text-indigo-600">Your Answers</h3>
                    <ResultGrid answers={userCards} isUserGrid={true} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-4 text-center text-indigo-600">Correct Answers</h3>
                    <ResultGrid answers={cards} isUserGrid={false} />
                  </div>
                </div>
                <motion.div 
                  className="mt-8 p-6 bg-white bg-opacity-60 backdrop-blur-sm rounded-lg shadow-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h3 className="text-3xl font-bold mb-4 text-center text-indigo-700">Game Finished!</h3>
                  {finalScore && (
                    <div className="space-y-2 text-center text-lg text-indigo-600">
                      <p>Time taken: {finalScore.time.toFixed(2)} seconds</p>
                      <p>Correct answers: {finalScore.correct}</p>
                      <p>Incorrect answers: {finalScore.incorrect}</p>
                    </div>
                  )}
                  <div className="flex justify-center mt-6">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        onClick={resetGame} 
                        className="px-8 py-4 bg-gradient-to-r from-purple-400 to-pink-400 text-white text-xl font-bold rounded-full shadow-md transition-all duration-300 hover:shadow-lg"
                      >
                        Play Again
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

