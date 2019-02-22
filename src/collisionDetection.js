export function detectCollision(ball, actor) {

  const bottomBall = ball.position.y + ball.size
  const topBall = ball.position.y

  const topActor = actor.position.y
  const leftActor = actor.position.x
  const rightActor = actor.position.x + actor.width
  const bottomActor = actor.position.y + actor.height

  return bottomBall >= topActor &&
    topBall <= bottomActor &&
    ball.position.x >= leftActor &&
    ball.position.x+ball.size <= rightActor
}