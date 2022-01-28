const  R = require('ramda')

module.exports = {
  onlyBirdBoxCollision: R.compose(
    R.identity,
    R.test(/((bird\d+)(box\d+))|((box\d+)(bird\d+))/i),
    R.converge(
      R.concat,
      [
        R.path(['bodyA', 'label']),
        R.path(['bodyB', 'label'])
      ]
    )
  ),
}