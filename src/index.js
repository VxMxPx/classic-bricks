import settings from './settings'
import Game from './lib/game'
import { drawPausedScreen } from './lib/ui'

// Create basic game elements
const container = document.getElementById('game')
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

canvas.width = settings.game.width
canvas.height = settings.game.height
canvas.style.border = '1px solid black'
canvas.style.position = 'absolute'
canvas.style.top = `calc(50% - ${settings.game.height/2}px)`
canvas.style.left = `calc(50% - ${settings.game.width/2}px)`
canvas.style.background = '#333'
canvas.style.display = 'block'

container.appendChild(canvas)

const game = new Game(settings)

// Main loop
let lastTime = 0
let screenDrawn = false

function gameLoop(timestamp) {
  let dtime = timestamp - lastTime
  lastTime = timestamp

  switch (game.state) {
    case Game.STATE_PAUSED:
      if (!screenDrawn) {
        drawPausedScreen(ctx, settings.game.width, settings.game.height)
        screenDrawn = true
      }
      break

    case Game.STATE_RUNNING:
      screenDrawn = false
      ctx.clearRect(0, 0, settings.game.width, settings.game.height)
      game.update(dtime)
      game.draw(ctx)
      break
  }

  requestAnimationFrame(gameLoop)
}

requestAnimationFrame(gameLoop)
