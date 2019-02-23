import Input from './input'
import Ball from '../actors/ball'
import Pad from '../actors/pad'
import Brick from '../actors/brick'

import levels from '../data/levels'
import bricks from '../data/bricks'

export default class Game {

  static STATE_RUNNING = 0
  static STATE_PAUSED = 1
  static STATE_MENU = 2

  constructor(settings) {
    this.settings = settings
    this.size = { ...settings.game }

    this.width = settings.game.width
    this.height = settings.game.height

    this.level = 1
    this.state = Game.STATE_RUNNING

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

    this.createLevel()

    // Register inputs
    this.input.on('keydown', key => {
      if (key === 'Escape' || key === 'KeyP') {
        this.togglePause()
      }
    })
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

  createLevel() {
    let level = levels[this.level]
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

  update(dtime) {
    this.actors.forEach(actor => actor.update(dtime))
    this.bricks = this.bricks.filter(brick => {
      brick.update(dtime)
      let collide = this.ball.collide(brick)
      if (collide) {
        this.ball.speed[collide[0]] *= -1
        brick.damage()
      }
      return !!brick.strength
    })
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