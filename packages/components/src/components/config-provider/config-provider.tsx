import type { ThemeOptions } from "@wui/composables"

import { createTheme } from "@wui/composables"
import { defineComponent } from "vue"

export const WConfigProvider = defineComponent({
  name: "WConfigProvider",
  setup() {
    const theme: ThemeOptions = {
      mode: "light"
    }
    createTheme(theme)
    return () => <h1>ConfigProvider</h1>
  }
})


