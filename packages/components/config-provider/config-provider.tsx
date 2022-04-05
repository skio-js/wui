import { defineComponent } from "vue"

export const WConfigProvider = defineComponent({
  name: "WConfigProvider",
  setup() {
    const a = "a"
    return () => <h1>ConfigProvider</h1>
  }
})


