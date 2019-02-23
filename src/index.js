import settings from './settings'
import Game from './lib/game'
import { drawGenericUi } from './lib/ui'

// Create basic game elements
const container = document.getElementById('game')
const canvas = container.getElementsByTagName('canvas')[0]
const ctx = canvas.getContext('2d')

const stats = {
  level: document.getElementById('level'),
  score: document.getElementById('score'),
  lives: document.getElementById('lives')
}

canvas.width = settings.game.width
canvas.height = settings.game.height
container.style.top = `calc(50% - ${settings.game.height/2}px)`
container.style.left = `calc(50% - ${settings.game.width/2}px)`

let game = new Game(settings)

// Reset
document.addEventListener('keypress', e => {
  if (e.code === 'Space') {
    if (game.state === Game.STATE_GAMEOVER || game.state === Game.STATE_WON) {
      game = new Game(settings)
      game.start()
    } else if (game.state === Game.STATE_MENU) {
      game.start()
    }
  }
})

// Main loop
let lastTime = 0
let screenDrawn = false

function gameLoop(timestamp) {
  let dtime = timestamp - lastTime
  lastTime = timestamp

  switch (game.state) {
    case Game.STATE_PAUSED:
      if (!screenDrawn) {
        drawGenericUi(ctx, ['Paused'], settings.game)
        screenDrawn = true
      }
      break

    case Game.STATE_MENU:
      if (!screenDrawn) {
        drawGenericUi(ctx, ['Press SPACE to start a new game!'], settings.game)
        screenDrawn = true
      }
      break

    case Game.STATE_WON:
      if (!screenDrawn) {
        drawGenericUi(ctx, [
          'CONGRATULATIONS!',
          `SCORE ${game.score}`,
          'Press space to restart.'], settings.game, 'rgba(0, 60, 0, .4)')
        screenDrawn = true
      }
      break

    case Game.STATE_GAMEOVER:
      if (!screenDrawn) {
        drawGenericUi(ctx, [
          'GAME OVER!',
          `SCORE ${game.score}`,
          'Press space to restart.'], settings.game)
        screenDrawn = true
      }
      break

    case Game.STATE_WAIT:
    case Game.STATE_RUNNING:
      screenDrawn = false
      ctx.clearRect(0, 0, settings.game.width, settings.game.height)
      game.update(dtime)
      game.draw(ctx)
      if (game.state === Game.STATE_WAIT) {
        drawGenericUi(ctx, [game.waitState.message], settings.game)
      }
      break
  }

  // Update stats
  stats.level.innerText = game.level.title
  stats.lives.innerText = '♡'.repeat(game.lives)
  stats.score.innerText = `Score: ${game.score}`


  requestAnimationFrame(gameLoop)
}

requestAnimationFrame(gameLoop)
