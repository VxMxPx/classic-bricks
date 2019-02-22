export default class Input {

  constructor(game, paddle) {
    document.addEventListener('keydown', e => {
      switch(event.keyCode) {
        case 37:
          paddle.moveLeft()
          break
        case 39:
          paddle.moveRight()
          break
        case 27:
          game.togglePause()
          break

        case 32:
          game.start()
          break
      }
    })
    document.addEventListener('keyup', e => {
      switch(event.keyCode) {
        case 37:
          if (paddle.speed < 0) paddle.moveStop()
          break
        case 39:
          if (paddle.speed > 0) paddle.moveStop()
          break
      }
    })
  }

}