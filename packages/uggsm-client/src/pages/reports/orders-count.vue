<route>
{
  "name": "reportsOrdersCount",
  "meta": {
    "header": "Создано"
  }
}
</route>

<template>
  <div class="ug-page-reports-orders-count pa-4">
    <ug-report-orders-count></ug-report-orders-count>
  </div>
</template>

<script>
import UgReportOrdersCount from '@/components/report/report-orders-count/report-orders-count'

export default {
  name: 'ug-page-orders-count',

  components: {
    UgReportOrdersCount,
  },
}
</script>

<style lang="sass">
.ug-page-reports-orders-count
  width: 100%
</style>
