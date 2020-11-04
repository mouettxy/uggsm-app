<route>
{
  "name": "settingsNewOffice",
  "meta": {
    "header": "Новый офис"
  }
}
</route>

<template lang="pug">
.page-settings-new-office
  t-settings-new-office
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  layout: 'settings',
})
export default class PageSettingsNewOffice extends Vue {}
</script>

<style lang="sass">
.page-settings-new-office
  height: 100%
  width: 100%
</style>
