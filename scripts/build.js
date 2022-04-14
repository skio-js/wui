const fs = require("fs")
const path = require("path")
const { build } = require("vite")
const execa = require("execa")
const vueJsx = require("@vitejs/plugin-vue-jsx")
const { rollup } = require("rollup")
const { default: dts } = require("rollup-plugin-dts")
const { logGroup } = require("./log")
const { getComponents } = require("./utils")

const argv = require("minimist")(process.argv.slice(2))

const external = ["vue", "@wui/composables", "@wui/styles"]
const globals = {
  vue: "Vue",
  "@wui/core": "wuiComponents",
  "@wui/composables": "wuiComposables",
  "@wui/styles": "wuiStyles"
}

const resolve = (file) => path.resolve(__dirname, "../packages", file)

// TODO 删除types-temp； 移动 dist； 写package.json； build components


//
;(async () => {
  for (const target of argv._) {
    if (fs.existsSync(resolve(target))) {
      switch (target) {
        case "core":
          await logGroup(async () => {
            await buildComponent()
          }, "core components")
          break
        default:

          await logGroup(async () => {
            await buildSub(target)
            await buildDts(target)
          }, target)

          break
      }
    }
  }
})()

async function buildComponent() {
  const files = getComponents()

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
      minify: false,
      lib: {
        entry: resolve("core/src/framework.ts"),
        formats: ["es", "umd"],
        name: "wuiComponents",
        fileName: (format) => `components/${format}/index.js`
      },
      rollupOptions: {
        external,
        output: {
          globals
        }
        // input: files,
        // output: {
        //   format: "es",
        //   entryFileNames: () => `[name].js`
        // }

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
        fileName: (format) => `${target}/${format}/index.js`
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

