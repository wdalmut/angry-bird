const R = require('ramda')
const Matter = require('matter-js')

const Events = Matter.Events
const Composite = Matter.Composite

const BoxGenerator = require('./box-generator')

module.exports = {
  removeAllBirds: R.curry((elastic, world) => {
    // grab all birds
    let birds = R.filter(R.compose(R.test(/bird/i), R.prop('label')), world.bodies)

    // do not drop the bird connected to the slingshot
    birds = R.filter(R.compose(R.not, R.equals(elastic.bodyB.label), R.prop('label')), birds)

    // drop birds
    birds.map(bird => Composite.remove(world, bird)) 
  }),
  onBoxExplosion: world => {
    const boxes = R.filter(R.compose(R.test(/box/i), R.prop('label')), world.bodies)
    
    if (boxes.length === 0) {
      Events.trigger(world, 'emptyWorld', world)
    }
  },
  recreateBoxes: world => {
    let boxes = BoxGenerator.generate(5)

    Composite.add(world, boxes); 
  }
}