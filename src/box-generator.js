const Box = require('./box')

module.exports = {
  generate: num => {
    let boxes = Array.apply(null, new Array(num)).map((_, i) => {
      x = 450 + Math.random() * 200
      y = 200 + Math.random() * 100
      const box = Box.createBox(x, y, {label: `box${i}`})
      return box
    })

    return boxes
  }
}