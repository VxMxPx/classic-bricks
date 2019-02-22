export default class Paddle {

  constructor(game) {
    this.width = 150
    this.height = 30
    this.game = game

    this.maxSpeed = 10
    this.speed = 0

    this.position = {
      x: this.game.width / 2 - this.width / 2,
      y: this.game.height - this.height - 10
    }
  }

  moveLeft() {
    this.speed = -this.maxSpeed
  }

  moveRight() {
    this.speed = this.maxSpeed
  }

  moveStop() {
    this.speed = 0
  }

  update(dTime) {
    this.position.x += this.speed

    if (this.position.x < 0) {
      this.position.x = 0
    }

    if (this.position.x+this.width > this.game.width) {
      this.position.x = this.game.width-this.width
    }
  }

  draw(ctx) {
    ctx.fillStyle = '#f00'
    ctx.fillRect(
      this.position.x, this.position.y, this.width, this.height)
  }
}