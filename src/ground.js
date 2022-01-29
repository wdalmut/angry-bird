const R = require('ramda')
const Matter = require('matter-js')

const Bodies = Matter.Bodies;

module.exports = {
  createGround: (x, y, width, height, options = {}) => {
    let ground = Bodies.rectangle(x, y, width, height, R.mergeDeepRight({
      label: 'ground',
      isStatic: true,
      render: { fillStyle: "#F00" },
    }, options))

    return ground
  },
}