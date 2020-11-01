<route>
{
  "name": "settingsManageDailySubscriptions",
  "meta": {
    "header": "Управление подпиской на ежедневные отчёты"
  }
}
</route>

<template lang="pug">
.page-settings-manage-daily-subscriptions
  TSettingsManageDailySubscriptions
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  layout: 'settings',
})
export default class PageSettingsManageDailySubscriptions extends Vue {}
</script>

<style lang="sass">
.page-settings-manage-daily-subscriptions
  height: 100%
  width: 100%
</style>
