<template lang="pug">
.office-main
  v-card.pa-12.office-main__card(elevation='2')
    o-office-form
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

/**
 * Template of main order view
 *
 */
@Component
export default class TOfficeMain extends Vue {}
</script>

<style lang="sass">
.office-main
  width: 100%
  height: 100%
  display: flex
  justify-content: center

  .office-main__card
    align-self: center
</style>
