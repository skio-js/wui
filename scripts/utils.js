const path = require("path")
const fs = require("fs")

const resolve = (file) => path.resolve(__dirname, "../packages/core", file)
/**
 * @return Record<string, string>
 * */
const getComponents = () => {
  const componentsDir = resolve("src/components")
  const subs = fs.readdirSync(componentsDir)

  const configs = {}
  subs.forEach(name => {
    const filepath = path.resolve(componentsDir, name)
    const stat = fs.statSync(filepath)

    const info = path.parse(filepath)

    if (stat.isFile()) {
      configs[info.name] = filepath
    } else {
      configs[`${name}/index`] = path.resolve(filepath, "index.ts")
    }
  })
  return configs
}

module.exports = {
  getComponents
}
