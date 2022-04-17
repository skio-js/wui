<template>
   <mdi-preset color="green" />
</template>
<script lang="ts">
import { defineComponent, ref } from "vue"
import { mdiAccountSearch } from "@mdi/js"
import { WithMdiIconProps } from "../../packages/icon/src"

const MdiPreset = WithMdiIconProps({
  path: mdiAccountSearch
})

export default defineComponent({
  name: "MdiIconDemo",
  components: {
    MdiPreset
  },
  setup() {
    let index = 0
    const color = ref("red")

    return {
      color,
      mdiAccountSearch,
      toggle: () => color.value = ["red", "green", "blue"][++index % 3]
    }
  }
})
</script>
