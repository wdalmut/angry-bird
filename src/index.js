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
    Bodies = Matter.Bodies;

function getBird() {
  const birds = [
    'images/bird.png',
    'images/bird2.png',
  ]
  return birds[parseInt((Math.random()*100))%birds.length]
}

function getBox() {
  const boxes = [
    'images/box.png',
    'images/box2.png',
  ]
  return boxes[parseInt((Math.random()*100))%boxes.length]
}

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
    isStatic: true,
    render: { fillStyle: "#060a19" },
  })
  const rockOptions = {
    density: 0.004,
    render: {
      sprite: {
        texture: getBird(),
        xScale: 0.2,
        yScale: 0.2
      }
    }
  }

  let rock = Bodies.polygon(220, 450, 8, 20, rockOptions)
  const anchor = { x: 220, y: 450 }
  const elastic = Constraint.create({
    pointA: anchor,
    bodyB: rock,
    stiffness: 0.05,
  })


  const ground2 = Bodies.rectangle(550, 500, 200, 20, { isStatic: true, render: { fillStyle: '#060a19' } });

  let boxes = Array.apply(null, new Array(15)).map(() => {
    x = 450 + Math.random() * 200
    y = 200 + Math.random() * 100
    const box = Bodies.rectangle(x, y, 50, 50, {
      render: {
        sprite: {
            texture: getBox(),
            xScale: 0.2,
            yScale: 0.2
        }
      },
    })
    console.log(box)
    return box
  })


  Composite.add(engine.world, [ground, ground2, rock, elastic].concat(boxes));

  Events.on(engine, 'afterUpdate', function() {
    if (mouseConstraint.mouse.button === -1 && (rock.position.x > 250)) {
      rock = Bodies.polygon(170, 450, 7, 20, Object.assign({}, rockOptions, {
        render: {
          sprite: {
            texture: getBird(),
            xScale: 0.2,
            yScale: 0.2
          }
        }
      }))
      elastic.bodyB = rock
      Composite.add(engine.world, rock);
    }
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