const R = require('ramda')
const Matter = require('matter-js')

const Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Composites = Matter.Composites,
    Events = Matter.Events,
    Constraint = Matter.Constraint,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Composite = Matter.Composite,
    Detector = Matter.Detector,
    Bodies = Matter.Bodies;

const Bird = require('./bird')
const Box = require('./box')
const BoxGenerator = require('./box-generator')
const CollisionHelper = require('./collision')
const WorldHelper = require('./world')
const compose = require('ramda/src/compose')

window.onload = function() {
  // create engine
  const engine = Engine.create(),
    world = engine.world;

  // create renderer
  const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: 800,
      height: 600,
      showAngleIndicator: false,
      wireframes: false
    },
  });

  Render.run(render);

  // create runner
  const runner = Runner.create();
  Runner.run(runner, engine);

  // add bodies
  const ground = Bodies.rectangle(395, 600, 8015, 50, {
    label: 'ground',
    isStatic: true,
    render: { fillStyle: "#F00" },
  })
  let bird = Bird.createBird()

  const anchor = { x: 220, y: 450 }
  const elastic = Constraint.create({
    pointA: anchor,
    bodyB: bird,
    stiffness: 0.05,
    label: 'elastic',
  })

  const ground2 = Bodies.rectangle(550, 500, 200, 20, { label: 'ground2', isStatic: true, render: { fillStyle: '#060a19' } });

  Composite.add(engine.world, [ground, ground2, bird, elastic]);

  Events.on(engine, 'afterUpdate', function(event) {
    const world = event.source.world
    // const elastic = R.find(R.equals('elastic'), R.path(['constraints', 'label']), world)
    // console.log(elastic)

    if (mouseConstraint.mouse.button === -1 && (bird.position.x > 250)) {
      Events.trigger(world, 'birdFlying', bird)

      bird = Bird.createBird()
      elastic.bodyB = bird
      Composite.add(world, bird);
    }
  })

  Events.on(engine, 'collisionStart', function(event) {
    const world = event.source.world

    let pairs = event.pairs
    if (pairs.length===1) {
      pairs = R.filter(CollisionHelper.onlyBirdBoxCollision, pairs)
      if (pairs.length) {
        Events.trigger(world, 'birdCollision', event)
      }
    }
  })

  Events.on(world, 'emptyWorld', WorldHelper.removeAllBirds)
  Events.on(world, 'emptyWorld', WorldHelper.recreateBoxes)
  
  Events.on(world, 'boxExplosion', WorldHelper.onBoxExplosion)

  Events.on(world, 'birdCollision', WorldHelper.onBirdCollision)

  Events.on(world, 'birdFlying', WorldHelper.followTheFlyingBird(render))

  // add mouse control
  const mouse = Mouse.create(render.canvas),
      mouseConstraint = MouseConstraint.create(engine, {
          mouse: mouse,
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