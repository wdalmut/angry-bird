const R = require('ramda')
const Matter = require('matter-js')

const Render = Matter.Render
const Events = Matter.Events
const Composite = Matter.Composite

const Box = require('./box')
const BoxGenerator = require('./box-generator')
const Slingshot = require('./slingshot')

const getSlingshot = world => R.find(R.compose(R.equals('slingshot'), R.prop('label')), world.composites)

module.exports = {
  getSlingshot,
  removeAllBirds: world => {
    const slingshot = getSlingshot(world)
    const elastic = Slingshot.getElastic(slingshot)
    // grab all birds
    let birds = R.filter(R.compose(R.test(/bird/i), R.prop('label')), world.bodies)

    // do not drop the bird connected to the slingshot
    birds = R.filter(R.compose(R.not, R.equals(elastic.bodyB.label), R.prop('label')), birds)

    // drop birds
    birds.map(bird => Composite.remove(world, bird)) 
  },
  onBoxExplosion: world => {
    const boxes = R.filter(R.compose(R.test(/box/i), R.prop('label')), world.bodies)
    
    if (R.length(boxes) === 0) {
      Events.trigger(world, 'emptyWorld', world)
    }
  },
  recreateBoxes: world => {
    let boxes = BoxGenerator.generate(5)

    Composite.add(world, boxes); 
  },
  onBirdCollision: R.curry((world, event) => {
    event.pairs.map(pair => {
      const explodingBox = R.ifElse(
        R.compose(R.test(/bird/i), R.path(['bodyA', 'label'])),
        R.prop('bodyB'),
        R.prop('bodyA')
      )(pair)
      
      Box.explode(explodingBox)
      setTimeout(() => {
        Composite.remove(world, explodingBox)
        Events.trigger(world, 'boxExplosion', world)
      }, 600)
    })
  }),
  followTheFlyingBird: R.curry((render, bird) => {
    const follow = () => Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: 800+bird.position.x-252, y: 600 }
    });
    Events.on(render, 'beforeRender', follow)

    setTimeout(() => {
      Events.off(render, 'beforeRender', follow)
      
      Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: 800, y: 600 }
      });
    }, 2000)
  }),
}