const fs = require("fs")
const fsE = require("fs-extra")
const path = require("path")
const { build } = require("vite")
const execa = require("execa")
const vueJsx = require("@vitejs/plugin-vue-jsx")
const { rollup } = require("rollup")
const { default: dts } = require("rollup-plugin-dts")
const { logGroup, wui, t, err, success, gry } = require("./log")
const { writePkgJSON } = require("./packageJson")

const argv = require("minimist")(process.argv.slice(2))

const external = ["vue", "@woodyui/composables", "@woodyui/styles"]
const globals = {
  vue: "Vue",
  "@woodyui/core": "wuiComponents",
  "@woodyui/composables": "wuiComposables",
  "@woodyui/styles": "wuiStyles"
}

const resolve = (file) => path.resolve(__dirname, "../packages", file)

// build flow
;(async () => {
  for (const target of argv._) {
    if (fs.existsSync(resolve(target))) {
      switch (target) {
        case "core":
          await logGroup(async () => {
            await buildComponent()
            await tscComponents()
            await buildComponentsDts()
            writePkgJSON("core")
          }, "core components")
          break
        default:

          await logGroup(async () => {
            await buildSub(target)
            await buildDts(target)
            writePkgJSON(target)
          }, target)

          break
      }
    }
  }
})()

async function tscComponents() {
  const temp = resolve("core/dist_temp")

  console.log(wui(), t("tsc --pretty -p core/tsconfig.json --outDir core/dist_temp"))

  await execa("tsc",
    [
      "--pretty",
      "-p",
      resolve("core/tsconfig.json"),
      "--outDir",
      temp
    ], { stdio: "inherit" })

  const from = path.resolve(temp, "./core/src")
  const to = resolve("core/dist/lib")

  console.log(wui(), t("from"), from)
  console.log(wui(), t("to  "), to)
  console.log(wui(), t("copy files"), success("✓"), gry("dist/lib"))

  if (fs.existsSync(to)) fsE.removeSync(to)

  await (() => new Promise(resolve => {
    fsE.copy(from, to, (error) => {
      if (error) {
        console.log(wui(), err("cp lib files error "), error)
      } else {
        fsE.removeSync(temp)
      }
      resolve()
    })
  }))()
}

async function buildComponent() {
  return build({
    plugins: [vueJsx()],
    mode: "development",
    root: resolve("core"),
    esbuild: {
      jsx: "preserve",
      jsxFactory: "h"
    },
    resolve: {
      alias: {
        "@/": resolve("core/src") + "/"
      }
    },
    build: {
      lib: {
        entry: resolve("core/src/framework.ts"),
        formats: ["es", "umd"],
        name: "wuiComponents",
        fileName: (format) => `${format}/index.js`
      },
      rollupOptions: {
        external,
        output: {
          globals
        }
      }
    }
  })
}

async function buildSub(target) {
  return build({
    root: resolve(target),
    build: {
      // sourcemap: true,
      lib: {
        entry: resolve(`${target}/src/index.ts`),
        formats: ["es", "umd"],
        name: `wui${target[0].toUpperCase()}${target.substring(1)}`,
        fileName: (format) => `${format}/index.js`
      },
      rollupOptions: {
        external,
        output: {
          globals
        }
      }
    }
  })
}

async function buildComponentsDts() {
  const bundle = await rollup({
    input: resolve(`core/dist/lib/framework.d.ts`),
    external,
    plugins: [dts()]
  })
  await bundle.write({
    file: resolve(`core/dist/types/index.d.ts`), format: "es"
  })
  await bundle.close()
}

async function buildDts(target) {
  console.log(wui(), t("rolling up types"), `packages/${target} => packages/${target}/types-temp`)
  console.log(wui(), t("types transformed"))
  console.log(success("✓"), gry("dist/types/index.d.ts"))
  await execa("tsc",
    [
      "--pretty",
      "--emitDeclarationOnly",
      "-p",
      resolve(`${target}/tsconfig.json`)
    ], { stdio: "inherit" })

  const bundle = await rollup({
    input: resolve(`${target}/types-temp/src/index.d.ts`),
    external,
    plugins: [dts()]
  })
  await bundle.write({
    file: resolve(`${target}/dist/types/index.d.ts`), format: "es"
  })
  await bundle.close()

  fsE.removeSync(resolve(`${target}/types-temp`))
}

