const pkg = require("../package.json")
const path = require("path")
const fs = require("fs")

const peerDeps = {
  core: {
    "vue": pkg.devDependencies.vue,
    "@woodyui/composables": "^0.0.1",
    "@woodyui/styles": "^0.0.1"
  }
}

const commonJson = {
  "name": "",
  "version": "",
  "repository": pkg.repository,
  "author": pkg.author,
  "license": pkg.license,
  "peerDependencies": {
    // "vue": pkg.devDependencies.vue
  }
}

exports.writePkgJSON = (target) => {
  const _pkg = require(path.resolve(__dirname, `../packages/${target}/package.json`))

  let tempJson = {
    ...commonJson,
    name: _pkg.name,
    version: _pkg.version,
    description: _pkg.description,
    types: "./types/index.d.ts",
    module: "./es/index.js",
    peerDependencies: {
      ...peerDeps.core
    }
  }
  switch (target) {
    case "core":
      tempJson.exports = {
        ".": {
          "import": "./es/index.js",
          "lib": "./lib/framework.js"
        }
      }
      break
    default:
      tempJson.exports = {
        ".": {
          "import": "./es/index.js"
        }
      }
      break
  }
  fs.writeFileSync(path.resolve(__dirname, `../packages/${target}/dist/package.json`), JSON.stringify(tempJson))
}
