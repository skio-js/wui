<template>
  <button @click="toggle">color {{ color }}</button>
  <br />
  <mdi-icon :path="mdiAccountSearch" :color="color"/>
<!--  <mdi-home-icon vertical/>-->
</template>
<script lang="ts">
import { defineComponent, ref } from "vue"
import { MdiIcon } from "../../packages/icon/src"
import { mdiAccountSearch } from "@mdi/js"

// const MdiHomeIcon = WithMdiIconProps({
//   path: mdiAccountSearch,
//   color: "pink",
//   horizontal: true
// })

export default defineComponent({
  name: "MdiIconDemo",
  components: {
    MdiIcon,
    // MdiHomeIcon
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
