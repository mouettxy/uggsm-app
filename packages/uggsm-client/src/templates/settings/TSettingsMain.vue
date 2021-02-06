<template lang="pug">
.settings-main
  v-card.settings-main__content.pa-4
    v-card-title Управление ролями

    v-card-text
      o-roles-manage
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class TOrdersMain extends Vue {}
</script>

<style lang="sass">
.settings-main__content
  width: 100%
  height: 100%
</style>
