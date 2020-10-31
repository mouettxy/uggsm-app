<route>
{
  "name": "reportsOrdersDaily",
  "meta": {
    "header": "Ежедневный отчёт"
  }
}
</route>

<template lang="pug">
.page-reports-orders-daily
  t-reports-orders-daily
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  layout: 'reports',
})
export default class PageReportsOrdersDaily extends Vue {}
</script>

<style lang="sass">
.page-reports-orders-daily
  width: 100%
</style>
