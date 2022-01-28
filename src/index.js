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
const CollisionHelper = require('./collision')

window.onload = function() {
  // create engine
  var engine = Engine.create(),
    world = engine.world;

  // create renderer
  var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: 800,
      height: 600,
      showAngleIndicator: true,
      wireframes: false
    },
  });

  Render.run(render);

  // create runner
  const runner = Runner.create();
  Runner.run(runner, engine);

  // add bodies
  const ground = Bodies.rectangle(395, 600, 815, 50, {
    label: 'ground',
    isStatic: true,
    render: { fillStyle: "#060a19" },
  })
  let bird = Bird.createBird()

  const anchor = { x: 220, y: 450 }
  const elastic = Constraint.create({
    pointA: anchor,
    bodyB: bird,
    stiffness: 0.05,
  })

  const ground2 = Bodies.rectangle(550, 500, 200, 20, { label: 'ground2', isStatic: true, render: { fillStyle: '#060a19' } });

  let boxes = Array.apply(null, new Array(5)).map((_, i) => {
    x = 450 + Math.random() * 200
    y = 200 + Math.random() * 100
    const box = Box.createBox(x, y, {label: `box${i}`})
    return box
  })


  Composite.add(engine.world, [ground, ground2, bird, elastic].concat(boxes));

  Events.on(engine, 'afterUpdate', function() {
    if (mouseConstraint.mouse.button === -1 && (bird.position.x > 250)) {
      bird = Bird.createBird()
      elastic.bodyB = bird
      Composite.add(engine.world, bird);
    }
  })

  Events.on(engine, 'collisionStart', function(event) {
    let pairs = event.pairs
    if (pairs.length) {
      pairs = R.filter(CollisionHelper.onlyBirdBoxCollision, pairs)
      if (pairs.length) {
        Events.trigger(engine, 'birdCollision', event)
      }
    }
  })

  Events.on(engine, 'birdCollision', event => {
    event.pairs.map(pair => {
      console.log(pair)
      const explodingBox = R.ifElse(
        R.compose(R.test(/bird/i), R.path(['bodyA', 'label'])),
        R.prop('bodyB'),
        R.prop('bodyA')
      )(pair)

      Box.explode(explodingBox)
      setTimeout(() => {
        Composite.remove(event.source.world, explodingBox)
      }, 600)
    })
    
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

  // fit the render viewport to the scene
  Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: 800, y: 600 }
  });
}