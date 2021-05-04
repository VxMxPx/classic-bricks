import Actor from './actor'

export default class Ball extends Actor {
  constructor() {
    super({x: 0, y: 0, width: 16, height: 16}, 'assets/images/ball.svg')

    this.speed = {}
    this.reset()
  }

  reset() {
    this.speed = {x: 5, y: -5, max: 7}
    this.setPosition('center', 'center')
  }

  update(dTime) {
    let x = this.x + this.speed.x
    let y = this.y + this.speed.y
    let hit = this.setPosition(x, y)

    if (hit.includes('top') || hit.includes('bottom')) this.speed.y *= -1
    if (hit.includes('left') || hit.includes('right')) this.speed.x *= -1
  }

}