
const WIDTH = 1024
const HEIGHT = 768

module.exports = {
  level: -1,
  collision: {
    bird: 0x0001,
    ground: 0x0002,
    box: 0x0004,
    mouse: 0x0008,
    slingshot: 0x0010,
  },
  render: {
    ratio: WIDTH/HEIGHT,
    width: WIDTH,
    height: HEIGHT,
  }
}