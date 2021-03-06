<route>
{
  "name": "reports",
  "meta": {
    "header": "Ежедневный отчёт",
    "resource": "Report"
  }
}
</route>

<template lang="pug">
.page-orders
  t-reports-orders-daily(from='reports')
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class PageReports extends Vue {}
</script>

<style lang="sass">
.page-orders
  width: 100%
</style>
