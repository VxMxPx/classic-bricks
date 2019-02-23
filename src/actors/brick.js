import Actor from './actor'

export default class Brick extends Actor {

  static defaultWidth = 80
  static defaultHeight = 30

  constructor(data, position) {
    super({
      ...position, width: Brick.defaultWidth, height: Brick.defaultHeight},
      `assets/images/${data.textures[0]}`)

    this.maxStrength = this.strength = data.strength
    this.textures = data.textures
  }

  damage() {
    this.strength--
    this.updateTexture()
  }

  updateTexture() {
    let index = this.maxStrength-this.strength
    let texture = this.textures[index]
    this.loadTexture(`assets/images/${texture}`, next => {
      this.texture = next
    })
  }
}