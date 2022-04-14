import { inject,provide } from "vue"

export type ThemeMode = "light" | "dark";
export interface ThemeOptions {
    mode: ThemeMode;
}

const themeInjectionKey = Symbol("wui-theme-symbol")

const createTheme = (options: ThemeOptions) => {
  console.log("options", options)
  provide(themeInjectionKey, {})
}
const useTheme = () => {
  const theme = inject(themeInjectionKey, null)
  if (!theme)
    throw new Error("[wui] could not find the theme has been injected")
  return theme
}

export { createTheme, useTheme }
