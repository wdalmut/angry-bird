const R = require('ramda')
const Matter = require('matter-js')

const Composite = Matter.Composite

const Box = require('../box')
const Ground = require('../ground')

module.exports = {
  createLevel: world => {
    const cliff = Ground.createGround(850, 300, 200, 20, { label: 'cliff', render: { fillStyle: '#060a19' } })

    let boxes = Array.apply(null, new Array(5)).map((_, i) => {
      x = 750 + Math.random() * 200
      y = 50 + Math.random() * 100
      const box = Box.createBox(x, y, {label: `box${i}`})
      return box
    })

    Composite.add(world, [cliff].concat(boxes));
  }
}