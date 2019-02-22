import { detectCollision } from './collisionDetection'

export default class Brick {

  constructor(game, position) {
    this.texture = document.getElementById('asset-brick')
    this.position = position
    this.width = 80,
    this.height = 20
    this.game = game
    this.markedForDeletion = false
  }

  update() {
    if (detectCollision(this.game.ball, this)) {
      this.game.ball.speed.y = -this.game.ball.speed.y
      this.markedForDeletion = true
    }
  }

  draw(ctx) {
    ctx.drawImage(
      this.texture, this.position.x, this.position.y, this.width, this.height)
  }
}