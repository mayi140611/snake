'use client';
import { useEffect, useRef, useState } from 'react';

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  // Game state
  const [snake, setSnake] = useState([{x: 10, y: 10}]);
  const [food, setFood] = useState({x: 5, y: 5});
  const [direction, setDirection] = useState('RIGHT');
  const [speed, setSpeed] = useState(100);

  // Initialize game
  useEffect(() => {
    if (!gameStarted) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Game loop
    const gameLoop = setInterval(() => {
      // Move snake
      const head = {...snake[0]};
      
      switch(direction) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Check collisions
      if (
        head.x < 0 || head.x >= 20 || 
        head.y < 0 || head.y >= 20 ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)
      ) {
        setGameOver(true);
        clearInterval(gameLoop);
        return;
      }

      const newSnake = [head, ...snake];
      
      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 10);
        setFood({
          x: Math.floor(Math.random() * 20),
          y: Math.floor(Math.random() * 20)
        });
        // Increase speed every 50 points
        if (score > 0 && score % 50 === 0) {
          setSpeed(prev => Math.max(prev - 10, 50));
        }
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);

      // Draw game
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw food
      ctx.fillStyle = 'red';
      ctx.fillRect(food.x * 20, food.y * 20, 20, 20);
      
      // Draw snake
      ctx.fillStyle = 'green';
      newSnake.forEach(segment => {
        ctx.fillRect(segment.x * 20, segment.y * 20, 20, 20);
      });

    }, speed);

    return () => clearInterval(gameLoop);
  }, [snake, food, direction, gameStarted, speed, score]);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted) {
        setGameStarted(true);
        return;
      }
      
      switch(e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameStarted]);

  const resetGame = () => {
    setSnake([{x: 10, y: 10}]);
    setFood({x: 5, y: 5});
    setDirection('RIGHT');
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
    setSpeed(100);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">贪吃蛇游戏</h1>
      <div className="mb-4">
        得分: <span className="font-bold">{score}</span>
      </div>
      <canvas
        ref={canvasRef}
        width="400"
        height="400"
        className="border border-gray-300 bg-white"
      />
      {!gameStarted && (
        <button 
          onClick={() => setGameStarted(true)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          开始游戏
        </button>
      )}
      {gameOver && (
        <div className="mt-4 text-center">
          <p className="text-xl font-bold mb-2">游戏结束!</p>
          <button 
            onClick={resetGame}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            重新开始
          </button>
        </div>
      )}
    </div>
  );
}
