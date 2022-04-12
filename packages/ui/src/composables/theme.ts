import { inject, provide } from "vue"

export type ThemeMode = "light" | "dark"

export interface ThemeOptions {
  mode: ThemeMode
}

export const defaultOptions: ThemeOptions = {
  mode: "light"
}

export const themeInjectionKey = Symbol("wui-theme-symbol")

export const createTheme = (options?: Partial<ThemeOptions>) => {
  console.log("options", options)
  provide(themeInjectionKey, {})
}

export const useTheme = () => {
  const theme = inject(themeInjectionKey, null)
  if (!theme) throw new Error("[wui] could not find the theme has been injected")
  return theme
}
