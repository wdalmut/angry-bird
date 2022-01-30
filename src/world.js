const R = require('ramda')
const Matter = require('matter-js')

const Render = Matter.Render
const Events = Matter.Events
const Composite = Matter.Composite

const Box = require('./box')
const Ground = require('./ground')
const Slingshot = require('./slingshot')

const LevelGenerator = require('./level-generator')
const Settings = require('./settings')

const getSlingshot = world => R.find(R.compose(R.equals('slingshot'), R.prop('label')), world.composites)

const lookAtTheLaunchingBird = render => {
  Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: Settings.render.width, y: Settings.render.height }
  });
}

const lookAtTheWholeMap = render => {
  Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: Settings.render.width*3, y: Settings.render.height/3 }
  });
}

const followTheFlyingBird = R.curry((render, bird) => {
  const follow = () => Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: 800+bird.position.x-252, y: Settings.render.height }
  });
  Events.on(render, 'beforeRender', follow)

  setTimeout(() => {
    Events.off(render, 'beforeRender', follow)
    
    lookAtTheLaunchingBird(render)
  }, 2000)
})

const clearWorld = world => {
  // rimuovo tutti gli oggetti
  const bodies = R.filter(R.compose(R.not, R.equals('ground'), R.prop('label')), world.bodies)
  R.map(body => Composite.remove(world, body), bodies)


  // rimuovo tutti gli oggetti compositi
  const composites = R.filter(R.compose(R.not, R.equals('slingshot'), R.prop('label')), world.composites)
  R.map(body => Composite.remove(world, body, true), composites)

  // rimuovo tutti i vincoli
  const constraints = R.filter(R.compose(R.not, R.equals('Mouse Constraint'), R.prop('label')), world.constraints)
  R.map(body => Composite.remove(world, body, true), constraints)
}

module.exports = {
  getSlingshot,
  clearWorld,
  nextLevel: world => {
    const level = LevelGenerator.nextLevel()
    level.createLevel(world)
  },
  launchTheBird: world => {
    const slingshot = getSlingshot(world)
    const bird = Slingshot.getBird(slingshot)

    Composite.remove(slingshot, bird) // the bird leave the slingshot
    Composite.add(world, bird) // the bird joins the world as a flying object

    return bird
  },
  onBoxExplosion: world => {
    const boxes = R.filter(R.compose(R.test(/box/i), R.prop('label')), world.bodies)
    
    if (R.length(boxes) === 0) {
      clearWorld(world)
      Events.trigger(world, 'nextLevel', world)
    }
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
  lookAtTheWholeMap,
  lookAtTheLaunchingBird,
  followTheFlyingBird,
}