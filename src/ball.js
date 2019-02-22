import { detectCollision } from './collisionDetection'

export default class Ball {
  constructor(game) {
    this.texture = document.getElementById('asset-ball')
    this.game = game
    this.size = 16
    this.speed = {}
    this.position = {}
    this.reset()
  }

  reset() {
    this.speed = {x: 2, y: -2}
    this.position = {x: 10, y: 300}
  }

  update(dTime) {
    this.position.x += this.speed.x
    this.position.y += this.speed.y

    // Wall collision
    if (this.position.x < 0 || this.position.x+this.size > this.game.width) {
      this.speed.x = -this.speed.x
    }
    if (this.position.y < 0) {
      this.speed.y = -this.speed.y
    }

    // Live lost
    if (this.position.y+this.size > this.game.height) {
      this.reset()
      this.game.lives--
    }

    if (detectCollision(this, this.game.paddle)) {
      this.speed.y = -this.speed.y
      this.position.y = this.game.paddle.position.y - this.size
    }
  }

  draw(ctx) {
    ctx.drawImage(
      this.texture, this.position.x, this.position.y, this.size, this.size)
  }
}