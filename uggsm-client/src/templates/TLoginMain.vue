<template lang="pug">
.login-main
  v-card.pa-12(elevation='2')
    v-card-title Авторизация
    o-login-form
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import OLoginForm from '@/components/organizms/OLoginForm.vue'

/**
 * Template of main order view
 *
 */
@Component({
  components: {
    OLoginForm
  }
})
export default class TLoginMain extends Vue {}
</script>

<style lang="sass">
.login-main
  width: 100%
  display: flex
  justify-content: center
</style>
