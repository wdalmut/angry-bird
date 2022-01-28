const Matter = require('matter-js')

const Bodies = Matter.Bodies;

function getBird() {
  const birds = [
    'images/bird.png',
    'images/bird2.png',
  ]
  return birds[parseInt((Math.random()*100))%birds.length]
}

module.exports = {
  createBird: () => {
    const birdOptions = {
      density: 0.004,
      label: `bird${parseInt(Math.random()*1e6)}`,
      render: {
        sprite: {
          texture: getBird(),
          xScale: 0.2,
          yScale: 0.2
        }
      }
    }
  
    let bird = Bodies.polygon(220, 450, 8, 20, birdOptions)

    console.debug("bird", bird.position)

    return bird
  }
}