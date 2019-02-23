import Input from './input'
import Ball from '../actors/ball'
import Pad from '../actors/pad'
import Brick from '../actors/brick'

import levels from '../data/levels'
import bricks from '../data/bricks'

export default class Game {

  static STATE_GAMEOVER = 0
  static STATE_RUNNING = 1
  static STATE_PAUSED = 2
  static STATE_MENU = 3
  static STATE_WAIT = 4
  static STATE_WON = 5

  constructor(settings) {
    this.settings = settings
    this.size = { ...settings.game }

    this.width = settings.game.width
    this.height = settings.game.height

    this.state = Game.STATE_MENU
    this.lives = 3
    this.score = 0

    this.input = new Input()

    // Actors
    this.ball = new Ball()
    this.pad = new Pad(this.input)

    this.bricks = []
    this.actors = [ this.ball, this.pad ]

    this.actors.forEach(actor => actor.setConstraints({
      x: 0, y: 0, width: this.width, height: this.height}))

    this.ball.setPosition('center', 'center')
    this.pad.setPosition('center', this.height-this.pad.height-20)

    this.level = {}
    this.createLevel(0)

    this.waitState = {}

    // Register inputs
    this.input.on('keydown', key => {
      if (key === 'Escape' || key === 'KeyP') {
        this.togglePause()
      }
    })
  }

  start() {
    this.state = Game.STATE_RUNNING
  }

  togglePause() {
    // By design switch, we don't want to impact other states
    switch (this.state) {
      case Game.STATE_RUNNING:
        this.state = Game.STATE_PAUSED
        break

      case Game.STATE_PAUSED:
        this.state = Game.STATE_RUNNING
        break
    }
  }

  hasLevel(levelIndex) {
    return typeof levels[levelIndex] === 'object'
  }

  createLevel(levelIndex) {
    let level = levels[levelIndex]
    level.index = levelIndex
    this.level = level
    this.bricks = []

    level.data.forEach((rowBricks, row) => {
      rowBricks.forEach((brickIndex, column) => {
        if (brickIndex) {
          let brickData = bricks[brickIndex]
          let position = {
            x: Brick.defaultWidth*(level.margin.left+column),
            y: Brick.defaultHeight*(level.margin.top+row)}
          this.bricks.push(new Brick(brickData, position))
        }
      })
    })
  }

  wait(message, counter, callback) {
    this.state = Game.STATE_WAIT
    this.waitState = { message, counter, callback }
  }

  update(dtime) {
    if (this.waitState.counter) {
      this.waitState.counter--
      if (this.waitState.counter === 0) {
        if (this.waitState.callback) {
          this.waitState.callback()
        }
        if (this.state === Game.STATE_WAIT) this.state = Game.STATE_RUNNING
      }
      return
    }

    this.actors.forEach(actor => actor.update(dtime))

    // Ball hit the floor
    if (this.ball.lastHit.includes('bottom')) {
      this.lives--
      if (this.lives === 0) {
        this.state = Game.STATE_GAMEOVER
      } else {
        this.wait('Woops :(', 20)
        this.ball.reset()
      }
      return
    }

    // Ball hit any brick
    this.bricks = this.bricks.filter(brick => {
      brick.update(dtime)
      let collide = this.ball.collide(brick)
      if (collide) {
        this.ball.speed[collide[0]] *= -1
        this.score += brick.score
        brick.damage()
      }
      return !!brick.strength
    })

    // Any bricks left?
    if (!this.bricks.length) {
      this.wait('Well done!', 50, () => {
        if (this.hasLevel(this.level.index+1)) {
          this.ball.reset()
          this.createLevel(this.level.index+1)
          if (this.lives < 8) {
            this.lives++
          }
        } else {
          this.state = Game.STATE_WON
        }
      })
      return
    }

    // Ball hit the paddle
    let collide = this.ball.collide(this.pad)
    if (collide) {
      this.ball.speed[collide[0]] *= -1
      if (collide[1] === 'x') this.ball.speed[collide[1]] = collide[2] * this.ball.speed.max
    }
  }

  draw(ctx) {
    [...this.actors, ...this.bricks].forEach(actor => actor.draw(ctx))
  }
}