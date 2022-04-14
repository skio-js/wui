const chalk = require("chalk")

const wui = () => chalk.greenBright("[wui]:")
const t = (target) => chalk.blueBright(target)

const logGroup = async (fn, target, ...args) => {
  console.group(wui(), t(target), ...args)
  await fn()
  console.groupEnd()
  console.log()
}

module.exports = {
  wui,
  t,
  logGroup
}
