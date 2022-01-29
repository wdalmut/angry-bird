const R = require('ramda')
const Matter = require('matter-js')

const Bodies = Matter.Bodies;
const Composite = Matter.Composite;
const Constraint = Matter.Constraint;

const Bird = require('./bird')

const getBird = slingshot => R.find(R.compose(R.test(/bird/i), R.prop('label')), slingshot.bodies)
const getElastic = slingshot => R.find(R.compose(R.equals('elastic'), R.prop('label')), slingshot.constraints)

// const isStreched = slingshot => {
//   const bird = getBird(slingshot)
//   const elastic = getElastic(slingshot)

//   return Math.abs(parseInt(bird.position.x) - elastic.pointA.x) > 5 || Math.abs(parseInt(bird.position.y) - elastic.pointA.y) > 5
// }

module.exports = {
  getElastic,
  getBird,
  isStreched,
  createSlingshot: (x, y, options = {}) => {
    let bird = Bird.createBird()

    let slingshot = Composite.create({
      label: 'slingshot'
    })

    const anchor = { x: 220, y: 450 }
    const elastic = Constraint.create({
      pointA: anchor,
      bodyB: bird,
      stiffness: 0.05,
      label: 'elastic',
      render: {
        type: 'line',
        lineWidth: 8,
        strokeStyle: '#060a19',
      }
    })

    const slingshotBody = Bodies.rectangle(x, y, 50, 140, R.mergeDeepRight({
      label: 'slingshotBase',
      isStatic: true,
      collisionFilter: {
        group: -1,
      },
      // render: {
      //   sprite: {
      //       texture: 'images/slingshot.png',
      //       xScale: 0.35,
      //       yScale: 0.35
      //   }
      // },
    }, options))

    slingshot = Composite.add(slingshot, [slingshotBody, elastic, bird])

    return slingshot
  },
}