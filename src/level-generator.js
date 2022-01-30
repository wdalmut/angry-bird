
const R = require('ramda')
const Settings = require('./settings')

const levels = [
  require('./levels/level-001'),
  require('./levels/level-002'),
]

const nextLevel = () => {
  let nextLevel = R.inc(Settings.level)
  Settings.level = nextLevel

  return levels[nextLevel]
}

module.exports = {
  getLevels: () => levels,
  getCurrentLevel: () => Settings.level,
  nextLevel,
}