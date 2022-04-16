<template>
  <h1>hello vue3</h1>
  <w-button></w-button>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { WButton } from "../packages/ui/src/components"

export default defineComponent({
  name: "App",
  components: {
    WButton
  }
})
</script>
