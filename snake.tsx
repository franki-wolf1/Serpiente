'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"

// Definición de tipos
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
type Position = { x: number; y: number }

// Constantes del juego
const GRID_SIZE = 20
const CELL_SIZE = 20
const INITIAL_SNAKE: Position[] = [{ x: 10, y: 10 }]
const INITIAL_FOOD: Position = { x: 15, y: 15 }
const INITIAL_OBSTACLE: Position = { x: 5, y: 5 }
const GAME_SPEED = 100

export default function SnakeExtremo() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE)
  const [food, setFood] = useState<Position>(INITIAL_FOOD)
  const [obstacle, setObstacle] = useState<Position>(INITIAL_OBSTACLE)
  const [direction, setDirection] = useState<Direction>('RIGHT')
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)

  // Generar una nueva posición aleatoria
  const getRandomPosition = useCallback((): Position => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    }
  }, [])

  // Mover la serpiente
  const moveSnake = useCallback(() => {
    const newSnake = [...snake]
    const head = { ...newSnake[0] }

    switch (direction) {
      case 'UP':
        head.y = (head.y - 1 + GRID_SIZE) % GRID_SIZE
        break
      case 'DOWN':
        head.y = (head.y + 1) % GRID_SIZE
        break
      case 'LEFT':
        head.x = (head.x - 1 + GRID_SIZE) % GRID_SIZE
        break
      case 'RIGHT':
        head.x = (head.x + 1) % GRID_SIZE
        break
    }

    newSnake.unshift(head)

    // Verificar colisión con la comida
    if (head.x === food.x && head.y === food.y) {
      setScore(prevScore => prevScore + 1)
      setFood(getRandomPosition())
      setObstacle(getRandomPosition())
    } else {
      newSnake.pop()
    }

    // Verificar colisión con el obstáculo o consigo misma
    if (
      (head.x === obstacle.x && head.y === obstacle.y) ||
      newSnake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    ) {
      setGameOver(true)
    } else {
      setSnake(newSnake)
    }
  }, [snake, direction, food, obstacle, getRandomPosition])

  // Manejar las teclas presionadas
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowUp':
        setDirection(prevDirection => prevDirection !== 'DOWN' ? 'UP' : prevDirection)
        break
      case 'ArrowDown':
        setDirection(prevDirection => prevDirection !== 'UP' ? 'DOWN' : prevDirection)
        break
      case 'ArrowLeft':
        setDirection(prevDirection => prevDirection !== 'RIGHT' ? 'LEFT' : prevDirection)
        break
      case 'ArrowRight':
        setDirection(prevDirection => prevDirection !== 'LEFT' ? 'RIGHT' : prevDirection)
        break
    }
  }, [])

  // Efecto para mover la serpiente y manejar el juego
  useEffect(() => {
    if (!gameOver) {
      const gameLoop = setInterval(moveSnake, GAME_SPEED)
      window.addEventListener('keydown', handleKeyPress)

      return () => {
        clearInterval(gameLoop)
        window.removeEventListener('keydown', handleKeyPress)
      }
    }
  }, [gameOver, moveSnake, handleKeyPress])

  // Reiniciar el juego
  const restartGame = () => {
    setSnake(INITIAL_SNAKE)
    setFood(INITIAL_FOOD)
    setObstacle(INITIAL_OBSTACLE)
    setDirection('RIGHT')
    setGameOver(false)
    setScore(0)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-pink-500">
      <h1 className="text-4xl font-bold mb-4 text-white">Snake Extremo</h1>
      <div className="relative w-[400px] h-[400px] bg-black border-4 border-white rounded-lg overflow-hidden">
        {snake.map((segment, index) => (
          <div
            key={index}
            className="absolute bg-green-500 rounded-full transition-all duration-100 ease-linear"
            style={{
              left: `${segment.x * CELL_SIZE}px`,
              top: `${segment.y * CELL_SIZE}px`,
              width: `${CELL_SIZE}px`,
              height: `${CELL_SIZE}px`,
            }}
          />
        ))}
        <div
          className="absolute bg-red-500 rounded-full"
          style={{
            left: `${food.x * CELL_SIZE}px`,
            top: `${food.y * CELL_SIZE}px`,
            width: `${CELL_SIZE}px`,
            height: `${CELL_SIZE}px`,
          }}
        />
        <div
          className="absolute bg-yellow-500 rounded-full"
          style={{
            left: `${obstacle.x * CELL_SIZE}px`,
            top: `${obstacle.y * CELL_SIZE}px`,
            width: `${CELL_SIZE}px`,
            height: `${CELL_SIZE}px`,
          }}
        />
        {gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
            <div className="text-white text-center">
              <h2 className="text-3xl font-bold mb-4">¡Juego Terminado!</h2>
              <p className="text-xl mb-4">Puntuación: {score}</p>
              <Button onClick={restartGame} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Reiniciar
              </Button>
            </div>
          </div>
        )}
      </div>
      <p className="mt-4 text-xl font-bold text-white">Puntuación: {score}</p>
      <div className="mt-4 text-white text-center">
        <p>Usa las flechas del teclado para mover la serpiente.</p>
        <p>Evita los obstáculos amarillos y no choques contigo mismo.</p>
      </div>
    </div>
  )
}
