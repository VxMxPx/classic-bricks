export function drawGenericUi(ctx, messages, {width, height}, color='rgba(0, 0, 0, .2)') {

  ctx.rect(0, 0, width, height)
  ctx.fillStyle = color
  ctx.fill()

  ctx.font = '30px Arial'
  ctx.fillStyle = '#aaa'
  ctx.textAlign = 'center'
  ctx.fillText(messages[0], width/2, height/2)

  if (messages[1]) {
    ctx.font = '20px Arial'
    ctx.fillStyle = '#aaa'
    ctx.textAlign = 'center'
    ctx.fillText(messages[1], width/2, height/2+36)
  }

  if (messages[2]) {
    ctx.font = '20px Arial'
    ctx.fillStyle = '#aaa'
    ctx.textAlign = 'center'
    ctx.fillText(messages[2], width/2, height/2+70)
  }
}