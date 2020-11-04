<template lang="pug">
v-app
  router-view
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'

@Component
export default class App extends Vue {
  get header() {
    return this.$route.meta.header
  }

  @Watch('header')
  onHeaderChange(header: string) {
    document.title = header
  }
}
</script>

<style lang="sass">
.notificationCenter.topRight
  z-index: 999999
</style>
