<template lang="pug">
.settings-manage-daily-subscriptions
  v-card.pa-4(elevation='2')
    v-card-title Управление подпиской на ежедневные отчёты
    v-card-text
      o-manage-daily-subscriptions
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class TSettingsManageDailySubscriptions extends Vue {}
</script>

<style lang="sass">
.settings-manage-daily-subscriptions
  width: 100%
  height: 100%
  padding: 12px
</style>
