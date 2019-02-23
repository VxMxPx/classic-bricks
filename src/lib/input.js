export default class Input {
  on(event, call) {
    document.addEventListener(event, e => call(e.code, e))
  }
}
