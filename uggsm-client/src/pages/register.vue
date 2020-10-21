<route>
{
  "name": "register",
  "meta": {
    "header": "Регистрация"
  }
}
</route>

<template lang="pug">
.page-register
  t-register-main
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  layout: 'centered',
})
export default class PageRegister extends Vue {}
</script>

<style lang="sass">
.page-register
  width: 100%
</style>
