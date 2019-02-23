export default class Actor {
  constructor(rect, texture) {
    // Set position/size
    this.width = rect.width
    this.height = rect.height
    this.x = rect.x
    this.y = rect.y

    if (texture.indexOf('(') > 0 || texture.indexOf('#') === 0) {
      this.color = texture
    } else {
      this.loadTexture(texture, texture => this.texture = texture)
    }

    this.constraints = {x:0, y:0, width:0, height:0}
  }

  loadTexture(texture, onLoad) {
    const img = new Image()
    img.onload = () => onLoad(img)
    img.src = texture
  }

  setConstraints(constraints) {
    this.constraints = constraints
  }

  collide(actor) {

    let side

    if (this.x + this.width + this.speed.x > actor.x &&
    this.x + this.speed.x < actor.x + actor.width &&
    this.y + this.height > actor.y &&
    this.y < actor.y + actor.height) {
      side = 'x'
    }

    if (this.x + this.width > actor.x &&
    this.x < actor.x + actor.width &&
    this.y + this.height + this.speed.y > actor.y &&
    this.y + this.speed.y < actor.y + actor.height) {
      side = 'y'
    }

    if (side) {
      let dim = side === 'y' ? 'width' : 'height'
      let sid = side === 'y' ? 'x' : 'y'
      let raw = this[sid] - (actor[sid] + actor[dim]/2)
      raw = raw/(actor[dim] + this[dim] + this.speed[sid])
      return [side, sid, raw]
    }
  }

  /**
   * Return bounds that were hit as an array, ie [ top, left ]
   * Empty array if no bounds were hit
   * Force will force position out of constraints
   * x, y accepts number px, or word 'center'
   */
  setPosition(x, y, force=false) {
    let hit = []
    if (!this.constraints.width || !this.constraints.height) { force = true }

    if (x === 'center') x = this.constraints.width/2 - this.width/2
    if (x === 'left') x = 0
    if (x === 'right') x = this.constraints.width - this.width

    if (y === 'center') y = this.constraints.height/2 - this.height/2
    if (y === 'top') y = 0
    if (y === 'bottom') y = this.constraints.height - this.height

    if (x < this.constraints.x) {
      hit.push('left')
      if (!force) x = this.constraints.x
    }
    if (x+this.width > this.constraints.width) {
      hit.push('right')
      if (!force) x = this.constraints.width-this.width
    }
    if (y < this.constraints.y) {
      hit.push('top')
      if (!force) y = this.constraints.y
    }
    if (y+this.height > this.constraints.height) {
      hit.push('bottom')
      if (!force) y = this.constraints.height-this.height
    }

    this.x = x
    this.y = y

    return hit
  }

  update(dtime) {
    // pass
  }

  draw(ctx) {
    if (this.color) {
      ctx.fillStyle = this.color
      ctx.fillRect(this.x, this.y, this.width, this.height)
    } else if (this.texture) {
      ctx.drawImage(this.texture, this.x, this.y, this.width, this.height)
    }
  }
}