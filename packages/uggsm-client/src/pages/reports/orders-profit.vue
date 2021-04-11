<route>
{
  "name": "reportsOrdersProfit",
  "meta": {
    "header": "Прибыль"
  }
}
</route>

<template>
  <div class="page-reports-orders pa-4">
    <ug-report-orders-profit></ug-report-orders-profit>
  </div>
</template>

<script>
import UgReportOrdersProfit from '@/components/report/report-orders-profit/report-orders-profit'

export default {
  name: 'ug-page-reports-orders-profit',

  components: {
    UgReportOrdersProfit,
  },
}
</script>

<style lang="sass">
.page-reports-orders
  width: 100%
</style>
