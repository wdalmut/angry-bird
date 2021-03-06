const R = require('ramda')
const Matter = require('matter-js')

const Ground = require('../ground')
const Box = require('../box')

const Composite = Matter.Composite


module.exports = {
  createLevel: world => {
    const cliff = Ground.createGround(550, 500, 200, 20, { label: 'cliff', render: { fillStyle: '#060a19' } })

    let boxes = Array.apply(null, new Array(5)).map((_, i) => {
      x = 450 + Math.random() * 200
      y = 200 + Math.random() * 100
      const box = Box.createBox(x, y, {label: `box${i}`})
      return box
    })

    Composite.add(world, [cliff].concat(boxes));
  }
}