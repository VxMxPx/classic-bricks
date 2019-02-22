import Game from './game'

const canvas = document.getElementById('game')
const context = canvas.getContext('2d')

const SCREEN_WIDTH = 800
const SCREEN_HEIGHT = 600
const screen = {width: SCREEN_WIDTH, height: SCREEN_HEIGHT}

const game = new Game(screen)

let lastTime = 0

function gameLoop(timestamp) {
  let dTime = timestamp - lastTime
  lastTime = timestamp

  context.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)

  game.update(dTime)
  game.draw(context)

  requestAnimationFrame(gameLoop)
}

requestAnimationFrame(gameLoop)