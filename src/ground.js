const R = require('ramda')
const Matter = require('matter-js');
const Settings = require('./settings');

const Bodies = Matter.Bodies;

module.exports = {
  createGround: (x, y, width, height, options = {}) => {
    let ground = Bodies.rectangle(x, y, width, height, R.mergeDeepRight({
      label: 'ground',
      isStatic: true,
      collisionFilter: {
        group: Settings.collision.ground,
        category: Settings.collision.ground,
        mask: 0xFFFF,
      },
      render: { 
        fillStyle: "#060a19",
      },
    }, options))

    return ground
  },
}