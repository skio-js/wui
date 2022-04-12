const chalk = require("chalk")
const { buildDts, buildLib } = require("./builders")

const argv = require("minimist")(process.argv.slice(2))

const packages = ["components", "composables"]

argv._.forEach((target) => {
  if (!packages.includes(target)) {

    console.log(`
${chalk.red("error:")} ---------- wrong build target ----------

       target ${chalk.red(target)} is not included!
       we just provide ${chalk.blueBright(packages)}
`)

    process.exit(0)
  }
})

;(async () => {
  for (const target of argv._) {
    console.log(`
    [wui]: build ${chalk.blueBright(target)} start...
    `)
    await buildLib(target)

    console.log(`
    [wui]: generate ${chalk.blueBright(target)} types...
    `)

    // await buildDts(target)
  }

})()
