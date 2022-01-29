const R = require('ramda')
const Matter = require('matter-js')

const Bodies = Matter.Bodies;

function getBoxTexture() {
  const boxes = [
    'images/box.png',
    'images/box2.png'
  ]
  return boxes[parseInt((Math.random()*100))%boxes.length]
}

module.exports = {
  createBox: (x, y, options = {}) => {
    const box = Bodies.rectangle(x, y, 50, 50, R.mergeDeepRight({
      label: 'box',
      render: {
        sprite: {
            texture: getBoxTexture(),
            xScale: 0.2,
            yScale: 0.2
        }
      },
    }, options))

    return box
  },
  explode: (box) => {
    box.render = R.assocPath(['sprite', 'texture'], 'images/explode.png', box.render)
  },
}