import type { ThemeMode, ThemeOptions } from "@wui/composables"

import { defineComponent } from "vue"
import { createTheme } from "@wui/composables"

import { notInComposables } from "@/composables/example"

export type CMode = ThemeMode & { test: boolean }

export const WConfigProvider = defineComponent({
  name: "WConfigProvider",
  setup() {
    const theme: ThemeOptions = {
      mode: "light"
    }
    createTheme(theme)
    notInComposables()
    return () => <h1>ConfigProvider</h1>
  }
})


