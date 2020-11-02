<route>
{
  "name": "reports",
  "meta": {
    "header": "Ежедневный отчёт"
  }
}
</route>

<template lang="pug">
.page-orders
  t-reports-orders-daily
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  layout: 'reports',
})
export default class PageReports extends Vue {}
</script>

<style lang="sass">
.page-orders
  width: 100%
</style>
