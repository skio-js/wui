import { defineComponent } from "vue"

export type MdiComposeProps = {
  path: string
  size?: number
}

export const MdiCompose = defineComponent({
  name: "MdiCompose",
  setup() {
    return () => <></>
  }
})
