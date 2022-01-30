const R = require('ramda')
const Matter = require('matter-js')

const Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Composites = Matter.Composites,
    Events = Matter.Events,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Composite = Matter.Composite,
    Detector = Matter.Detector,
    Bodies = Matter.Bodies;


const Settings = require('./settings')
const Ground = require('./ground')
const Bird = require('./bird')
const Box = require('./box')
const BoxGenerator = require('./box-generator')
const CollisionHelper = require('./collision')
const WorldHelper = require('./world')
const Slingshot = require('./slingshot');

window.onload = function() {
  // create engine
  const engine = Engine.create(),
    world = engine.world;

  // create renderer
  const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: Settings.render.width,
      height: Settings.render.height,
      showAngleIndicator: false,
      wireframes: false
    },
  });

  WorldHelper.lookAtTheLaunchingBird(render)
  Render.run(render);

  // create runner
  const runner = Runner.create();
  Runner.run(runner, engine);

  // add bodies
  const ground = Ground.createGround(395, 600, 8015, 50, { label: 'ground' })

  const slingshot = Slingshot.createSlingshot(220, 505)

  const cliff = Ground.createGround(550, 500, 200, 20, { label: 'cliff', render: { fillStyle: '#060a19' } })

  Composite.add(engine.world, [ground, cliff, slingshot]);

  Events.on(engine, 'afterUpdate', function(event) {
    const world = event.source.world
    const slingshot = WorldHelper.getSlingshot(world)

    if (mouseConstraint.mouse.button === -1 && Slingshot.isStreched(slingshot)) {
      let launchingBird = WorldHelper.launchTheBird(world)
      Events.trigger(world, 'birdFlying', launchingBird)
      let newlyAttachedBird = Slingshot.attachBird(slingshot)
    }
  })

  Events.on(engine, 'collisionStart', function(event) {
    const world = event.source.world

    let pairs = event.pairs
    if (pairs.length) {
      pairs = R.filter(CollisionHelper.onlyBirdBoxCollision, pairs)
      if (R.length(pairs)) {
        Events.trigger(world, 'birdCollision', {pairs: pairs})
      }
    }
  })

  Events.on(world, 'emptyWorld', WorldHelper.removeAllBirds)
  Events.on(world, 'emptyWorld', WorldHelper.recreateBoxes)
  Events.on(world, 'boxExplosion', WorldHelper.onBoxExplosion)
  Events.on(world, 'birdCollision', WorldHelper.onBirdCollision(world))
  Events.on(world, 'birdFlying', WorldHelper.followTheFlyingBird(render))

  // add mouse control
  const mouse = Mouse.create(render.canvas),
      mouseConstraint = MouseConstraint.create(engine, {
          mouse: mouse,
          collisionFilter: {
            group: Settings.collision.mouse,
            category: Settings.collision.mouse,
            mask: Settings.collision.mouse | Settings.collision.bird,
          },
          constraint: {
              stiffness: 1,
              render: {
                  visible: false
              }
          }
      });

  Composite.add(world, mouseConstraint);

  // keep the mouse in sync with rendering
  render.mouse = mouse;

  Events.trigger(world, 'emptyWorld', world)
}