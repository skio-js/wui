<template>
  <h1>hello vue3</h1>
  <mdi-icon-demo/>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import MdiIconDemo from "./mdi-icon/mdi-icon.vue"

export default defineComponent({
  name: "App",
  components: {
    MdiIconDemo
  }
})
</script>
