<template lang="pug">
.office-main
  v-card.pa-12(elevation='2')
    v-card-title Новый офис
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
  display: flex
  justify-content: center
</style>
