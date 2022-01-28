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
const CollisionHelper = require('./collision');
const compose = require('ramda/src/compose');

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
  })

  const ground2 = Bodies.rectangle(550, 500, 200, 20, { label: 'ground2', isStatic: true, render: { fillStyle: '#060a19' } });

  let boxes = BoxGenerator.generate(5)

  Composite.add(engine.world, [ground, ground2, bird, elastic].concat(boxes));

  let follow = false
  Events.on(render, 'beforeRender', function() {
    if (!follow) {
      // fit the render viewport to the scene
      Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: 800, y: 600 }
      });
    } else {
      // fit the render viewport to the scene
      Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: 800+follow.position.x-252, y: 600 }
      });
    }
  })

  Events.on(engine, 'afterUpdate', function() {
    if (mouseConstraint.mouse.button === -1 && (bird.position.x > 250)) {
      Events.trigger(engine, 'birdFlying', bird)

      bird = Bird.createBird()
      elastic.bodyB = bird
      Composite.add(engine.world, bird);
    }
  })

  Events.on(engine, 'collisionStart', function(event) {
    let pairs = event.pairs
    if (pairs.length===1) {
      pairs = R.filter(CollisionHelper.onlyBirdBoxCollision, pairs)
      if (pairs.length) {
        Events.trigger(engine, 'birdCollision', event)
      }
    }
  })

  Events.on(engine, 'emptyWorld', world => {
    let birds = R.filter(R.compose(R.test(/bird/i), R.prop('label')), world.bodies)
    birds = R.filter(R.compose(R.not, R.equals(elastic.bodyB.label), R.prop('label')), birds)
    birds.map(bird => Composite.remove(world, bird)) 
  })

  Events.on(engine, 'boxExplosion', world => {
    const boxes = R.filter(R.compose(R.test(/box/i), R.prop('label')), world.bodies)
    
    if (boxes.length === 0) {
      Events.trigger(engine, 'emptyWorld', world)
      let boxes = BoxGenerator.generate(5)

      Composite.add(world, boxes);    
    }
  })

  Events.on(engine, 'birdCollision', event => {
    event.pairs.map(pair => {
      const explodingBox = R.ifElse(
        R.compose(R.test(/bird/i), R.path(['bodyA', 'label'])),
        R.prop('bodyB'),
        R.prop('bodyA')
      )(pair)

      Box.explode(explodingBox)
      setTimeout(() => {
        Composite.remove(event.source.world, explodingBox)
        Events.trigger(engine, 'boxExplosion', engine.world)
      }, 600)
    })
    
  })

  Events.on(engine, 'birdFlying', bird => {
    follow = bird
    setTimeout(() => {
      follow = false
    }, 2000)
  })

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
}