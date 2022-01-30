const R = require('ramda')
const Matter = require('matter-js')

const Bodies = Matter.Bodies;
const Composite = Matter.Composite;
const Constraint = Matter.Constraint;

const Bird = require('./bird');
const Settings = require('./settings');

const getAnchor = () =>  ({ x: 220, y: 450 })
const getBird = slingshot => R.find(R.compose(R.test(/bird/i), R.prop('label')), slingshot.bodies)
const getElastic = slingshot => R.find(R.compose(R.equals('elastic'), R.prop('label')), slingshot.constraints)

const isStreched = slingshot => {
  const anchor = getAnchor()
  const bird = getBird(slingshot)
  const elastic = getElastic(slingshot)

  // return Math.abs(anchor.x - bird.position.x) > 10 || Math.abs(anchor.y - bird.position.y) > 10
  return bird.position.x > (anchor.x + 10)
}

module.exports = {
  getAnchor,
  getElastic,
  getBird,
  isStreched,
  createSlingshot: (x, y, options = {}) => {
    let bird = Bird.createBird()

    let slingshot = Composite.create({
      label: 'slingshot'
    })

    const anchor = getAnchor()
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
        group: Settings.collision.slingshot,
        category: Settings.collision.slingshot,
        mask: ~Settings.collision.bird,
      },
      render: {
        sprite: {
            texture: 'images/slingshot.png',
            xScale: 0.5,
            yScale: 0.35
        }
      },
    }, options))

    slingshot = Composite.add(slingshot, [slingshotBody, elastic, bird])

    return slingshot
  },
  attachBird: (slingshot) => {
    const elastic = getElastic(slingshot)
    const bird = Bird.createBird()

    elastic.bodyB = bird
    
    Composite.add(slingshot, bird);

    return bird
  },
}