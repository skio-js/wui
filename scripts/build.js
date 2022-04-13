const fs = require("fs")
const chalk = require("chalk")
const path = require("path")
const { build } = require("vite")
const execa = require("execa")
const { rollup } = require("rollup")
const { default: dts } = require("rollup-plugin-dts")

const argv = require("minimist")(process.argv.slice(2))

const external = ["vue", "@wui/composables", "@wui/styles"]

const resolve = (file) => path.resolve(__dirname, "../packages", file)

const wui = () => chalk.greenBright("[wui]:")
const t = (target) => chalk.blueBright(target)

//
;(async () => {
  for (const target of argv._) {
    if (fs.existsSync(resolve(target))) {
      switch (target) {
        case "components":
          break
        default:
          console.group(wui(), t(target))

          await buildSub(target)
          await buildDts(target)

          console.groupEnd()
          console.log()
          break
      }
    }
  }
})()

async function buildSub(target) {
  return build({
    root: resolve(target),
    esbuild: {
      jsx: "preserve",
      jsxFactory: "h"
    },
    build: {
      // sourcemap: true,
      lib: {
        entry: resolve(`${target}/src/index.ts`),
        formats: ["es", "umd"],
        name: `wui${target[0].toUpperCase()}${target.substring(1)}`,
        fileName: (format) => `${target}/${format}/index.js`
      },
      rollupOptions: {
        external,
        output: {
          globals: {
            vue: "Vue",
            "@wui/composables": "wuiComposables",
            "@wui/styles": "wuiStyles"
          }
        }
      }
    }
  })
}

async function buildDts(target) {
  await execa("tsc",
    [
      "--pretty",
      "--emitDeclarationOnly",
      "-p", resolve(`${target}/tsconfig.json`)
    ],
    { stdio: "inherit" }
  )

  const bundle = await rollup({
    input: resolve(`${target}/types-temp/src/index.d.ts`),
    external,
    plugins: [
      dts()
    ]
  })
  await bundle.write({
    file: resolve(`${target}/dist/types/index.d.ts`),
    format: "es"
  })
  await bundle.close()
}
