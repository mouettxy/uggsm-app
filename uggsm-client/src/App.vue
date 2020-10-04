<template lang="pug">
v-app
  router-view
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class App extends Vue {}
</script>

<style lang="sass">
.notificationCenter.topRight
  z-index: 999999
</style>
