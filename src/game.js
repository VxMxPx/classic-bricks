import Paddle from './paddle'
import Input from './input'
import Ball from './ball'

import { buildLevel, level1, level2 } from './levels'

const GAMESTATE = {
  PAUSED: 0,
  RUNNING: 1,
  MENU: 2,
  GAMEOVER: 3
}

export default class Game {
  constructor(screen) {
    this.width = screen.width
    this.height = screen.height
    this.gamestate = GAMESTATE.MENU
    this.paddle = new Paddle(this)
    this.ball = new Ball(this)
    new Input(this, this.paddle)
    this.actors = [this.ball, this.paddle]
    this.bricks = []
    this.lives = 3
    this.levels = [ level1, level2 ]
    this.currentLevel = 0
  }

  togglePause() {
    if (this.gamestate === GAMESTATE.PAUSED) {
      this.gamestate = GAMESTATE.RUNNING
    } else {
      this.gamestate = GAMESTATE.PAUSED
    }
  }

  start(force) {
    if (!force && this.gamestate === GAMESTATE.RUNNING) return
    this.bricks = buildLevel(this, this.levels[this.currentLevel])
    this.gamestate = GAMESTATE.RUNNING
  }

  update(dTime) {
    if (this.gamestate !== GAMESTATE.RUNNING) return
    if (this.lives === 0) { this.gamestate = GAMESTATE.GAMEOVER }

    if (this.bricks.length === 0) {
      this.currentLevel++
      this.ball.reset()
      this.start(true)
    }

    [...this.actors, ...this.bricks].forEach(actor => actor.update(dTime))
    this.bricks = this.bricks.filter(brick => !brick.markedForDeletion)
  }

  draw(context) {
    [...this.actors, ...this.bricks].forEach(actor => actor.draw(context))
    if (this.gamestate === GAMESTATE.PAUSED) {
      context.rect(0, 0, this.width, this.height)
      context.fillStyle = 'rgba(0, 0, 0, .5)'
      context.fill()

      context.font = '30px Arial'
      context.fillStyle = '#fff'
      context.textAlign = 'center'
      context.fillText('Paused', this.width/2, this.height/2)
    }
    else if (this.gamestate === GAMESTATE.MENU) {
      context.rect(0, 0, this.width, this.height)
      context.fillStyle = 'rgba(0, 0, 0, 1)'
      context.fill()
      context.font = '30px Arial'
      context.fillStyle = '#fff'
      context.textAlign = 'center'
      context.fillText('Press SPACEBAR To Start', this.width/2, this.height/2)
    }
    else if (this.gamestate === GAMESTATE.GAMEOVER) {
      context.rect(0, 0, this.width, this.height)
      context.fillStyle = 'rgba(0, 0, 0, 1)'
      context.fill()
      context.font = '30px Arial'
      context.fillStyle = '#fff'
      context.textAlign = 'center'
      context.fillText('GAME OVER', this.width/2, this.height/2)
    }
  }
}