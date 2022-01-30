const R = require('ramda')
const Matter = require('matter-js')

const Settings = require('../settings')

const Composite = Matter.Composite
const Bodies = Matter.Bodies

const Box = require('../box')
const Ground = require('../ground')

module.exports = {
  createLevel: world => {
    const wall = Bodies.rectangle(850, 300, 50, 200, {
      label: 'wall',
      collisionFilter: {
        group: Settings.collision.box,
        category: Settings.collision.box,
        mask: Settings.collision.box | Settings.collision.bird | Settings.collision.ground,
      },
    })
    const wall2 = Bodies.rectangle(850, 200, 250, 50, {
      label: 'wall',
      collisionFilter: {
        group: Settings.collision.box,
        category: Settings.collision.box,
        mask: Settings.collision.box | Settings.collision.bird | Settings.collision.ground,
      },
    })


    Composite.add(world, [wall, wall2]);

    let boxes = Array.apply(null, new Array(5)).map((_, i) => {
      x = 750 + Math.random() * 200
      y = 50 + Math.random() * 100
      const box = Box.createBox(x, y, {label: `box${i}`})
      return box
    })

    Composite.add(world, boxes);
  }
}