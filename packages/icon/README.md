# mdi icon component for vue3

the component transformed from [@mdi/react demo](https://templarian.github.io/@mdi/react/)
[@mdi/react repo](https://github.com/Templarian/MaterialDesign-React)

if you use @mdi/react before, you can use mdi icon feel right home

## Install

```bash
> npm install @woodyui/mdi-icon
# or
> pnpm add @woodyui/mdi-icon
# or
> yarn add @woodyui/mdi-icon
# ...
```
## Basic usage

```vue
<template>
  <button @click="toggle">color {{ color }}</button>
  <br />
  <mdi-icon :path="mdiAccountSearch" :color="color" />
</template>
<script lang="ts">
import { defineComponent, ref } from "vue"

import { MdiIcon } from "@woodyui/mdi-icon"
import { mdiAccountSearch } from "@mdi/js"

export default defineComponent({
  name: "MdiIconDemo",
  components: {
    MdiIcon
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
```
