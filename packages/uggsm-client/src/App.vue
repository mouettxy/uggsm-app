<template lang="pug">
v-app
  router-view
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { authModule, settingsModule } from './store'

@Component
export default class App extends Vue {
  get header() {
    return this.$route.meta.header
  }

  @Watch('header')
  onHeaderChange(header: string) {
    document.title = header
  }

  mounted() {
    // FIXME: Удаляет поиск при f5
    settingsModule.setSearch({ search: '', type: this.$route.name })
  }
}
</script>

<style lang="sass">
.notificationCenter.topRight
  z-index: 999999
</style>
