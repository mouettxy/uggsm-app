<template lang="pug">
.register-main
  v-card.pa-12.register-main__card(elevation='2')
    v-card-title Регистрация
    o-register-form
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

/**
 * Template of main order view
 *
 */
@Component
export default class TRegisterMain extends Vue {}
</script>

<style lang="sass">
.register-main
  width: 100%
  height: 100%
  display: flex
  justify-content: center

  .register-main__card
    align-self: center
</style>
