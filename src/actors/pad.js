import Actor from './actor'

export default class Pad extends Actor {
  constructor(input) {
    super({x: 0, y: 0, width: 150, height: 20}, 'assets/images/pad.svg')

    this.maxSpeed = 12
    this.speed = 0

    input.on('keydown', key => {
      switch(key) {
        case 'ArrowLeft':
        this.speed = -this.maxSpeed
          break
        case 'ArrowRight':
          this.speed = this.maxSpeed
          break
      }
    })
    input.on('keyup', key => {
      switch(key) {
        case 'ArrowLeft':
          if (this.speed < 0) this.speed = 0
          break
        case 'ArrowRight':
          if (this.speed > 0) this.speed = 0
          break
      }
    })
  }

  update(dtime) {
    let x = this.x + this.speed
    let hit = this.setPosition(x, this.y)
    if (hit.indexOf('left') > -1 || hit.indexOf('right') > -1) {
      this.speed = 0
    }
  }
}