const Matter = require('matter-js')

const Constraint = Matter.Constraint;

module.exports = {
  createElastic: (anchor, bird) => {
    let elastic = Constraint.create({
      pointA: anchor,
      bodyB: bird,
      stiffness: 0.05,
      label: 'elastic',
    })

    return elastic
  },
}