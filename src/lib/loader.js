function fileExt(file) {
  return file.substr(file.length-3, 3)
}

export default function loader(files, onReady) {
  let loaded = {}
  let progress = files.length
  files.forEach(file => {
    let tag = undefined
    switch (fileExt(file)) {
      case 'png':
      case 'jpg':
        tag = new Image()
        tag.src = `assets/images/${file}`
      break

      case 'wav':
        tag = new Audio(`assets/sounds/${file}`)
        tag.load()
      break
    }
    if (tag) {
      loaded[file] = { file, tag }
      tag.onload = () => {
        progress--
        if (progress === 0) {
          onReady(loaded)
        }
      }
    }
  })
}