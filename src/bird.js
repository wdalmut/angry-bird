const Matter = require('matter-js')

const Settings = require('./settings')
const Bodies = Matter.Bodies;

function getBirdTexture() {
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
          texture: getBirdTexture(),
          xScale: 0.2,
          yScale: 0.2
        }
      },
      collisionFilter: {
        group: Settings.bird,
        category: Settings.bird,
        mask: Settings.box | Settings.mouse | Settings.ground,
      },
    }
  
    let bird = Bodies.polygon(220, 450, 8, 20, birdOptions)
    
    return bird
  }
}