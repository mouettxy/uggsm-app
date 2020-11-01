<route>
{
  "name": "settingsNewUser",
  "meta": {
    "header": "Регистрация пользователя"
  }
}
</route>

<template lang="pug">
.page-settings-new-user
  t-register-main
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  layout: 'settings',
})
export default class PageSettingsNewUser extends Vue {}
</script>

<style lang="sass">
.page-settings-new-user
  width: 100%
  height: 100%
</style>
