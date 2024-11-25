import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { CalculatorIcon as Numbers, ListOrderedIcon as AlphabeticalOrder, Shapes, Languages } from 'lucide-react'
import { Card, CardContent } from './components/ui/Card'
import Button from './components/ui/Button'
import './index.css';

const cardSets = {
  number: {
    3: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    4: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'],
    5: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25']
  },
  shape: {
    3: ['■', '●', '▲', '◆', '★', '♥', '♠', '♣', '♦'],
    4: ['■', '●', '▲', '◆', '★', '♥', '♠', '♣', '♦','□', '○', '△', '◇', '☆', '♡', '♢'],
    5: ['■', '●', '▲', '◆', '★', '♥', '♠', '♣', '♦','□', '○', '△', '◇', '☆', '♡', '♢', '♤', '♧', '▼', '▶', '◀', '♩', '♪', '♫', '♬']
  },
  arabic: {
    3: ['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ'],
    4: ['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ','ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط'],
    5: ['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ','ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن'],
  },
  alphabet: {
    3: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
    4: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'],
    5: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y']
  }
}

const avaliableCardSets = {
    number: {
        3: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
        4: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'],
        5: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25']
      },
      shape: {
        3: ['■', '●', '▲', '◆', '★', '♥', '♠', '♣', '♦'],
        4: ['■', '●', '▲', '◆', '★', '♥', '♠', '♣', '♦','□', '○', '△', '◇', '☆', '♡', '♢'],
        5: ['■', '●', '▲', '◆', '★', '♥', '♠', '♣', '♦','□', '○', '△', '◇', '☆', '♡', '♢', '♤', '♧', '▼', '▶', '◀', '♩', '♪', '♫', '♬']
      },
      arabic: {
        3: ['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ'],
        4: ['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ','ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط'],
        5: ['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ','ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن'],
      },
      alphabet: {
        3: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
        4: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'],
        5: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y']
      }
}

const generateCards = (count, type, gridSize) => {
  let set = [...cardSets[type][gridSize]]
//   const result = []
//   for (let i = 0; i < count; i++) {
//     if (set.length === 0) break
//     const index = Math.floor(Math.random() * set.length)
//     result.push(set[index])
//     set.splice(index, 1)
//   }
  return set
}

export default function MemoryGame() {
  const [gridSize, setGridSize] = useState(3)
  const [cardType, setCardType] = useState('number')
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

  const submitGame = () => {
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
    }
  }

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
                <CardTypeOption type="number" label="Numbers" icon={Numbers} />
                <CardTypeOption type="alphabet" label="Alphabet" icon={AlphabeticalOrder} />
                <CardTypeOption type="shape" label="Shapes" icon={Shapes} />
                <CardTypeOption type="arabic" label="Arabic" icon={Languages} />
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
                      <div className="flex flex-col items-center mb-6" >
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
                            onClick={resetGame} 
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
                            onClick={submitGame} 
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

