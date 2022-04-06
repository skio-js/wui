const path = require("path")
const { build } = require("vite")
const execa = require("execa")
const { rollup } = require("rollup")

const dts = require("rollup-plugin-dts").default

const resolve = (lib) => {
  return path.join(__dirname, "../packages", lib)
}

exports.buildLib = async function(target) {
  await build({
    esbuild: {
      jsxFactory: "h",
      jsxFragment: "Fragment"
    },
    build: {
      emptyOutDir: false,
      lib: {
        entry: resolve(`${target}/src/index.ts`),
        formats: ["es"],
        fileName: (format) => `${target}/index.${format}.js`
      },
      rollupOptions: {
        external: ["vue", "@wui/composables"]
      }
    }
  })
}

exports.buildDts = async (target) => {
  await execa("tsc",
    [
      "--pretty",
      "--emitDeclarationOnly",
      "-p", resolve(`${target}/tsconfig.json`)
    ],
    { stdio: "inherit" }
  )

  const bundle = await rollup({
    input: resolve(`${target}/types-temp/${target}/src/index.d.ts`),
    external: ["@wui/composables"],
    plugins: [
      dts()
    ]
  })
  await bundle.write({
    file: `dist/${target}/index.d.ts`,
    format: "es"
  })
  await bundle.close()

  console.log("clear types temp")
}
