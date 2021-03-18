<route>
{
  "name": "reportsOrders",
  "meta": {
    "header": "Закрыто"
  }
}
</route>

<template>
  <div class="ug-page-reports-orders pa-4">
    <ug-report-orders-closed></ug-report-orders-closed>
  </div>
</template>

<script>
import UgReportOrdersClosed from '@/components/report/report-orders-closed/report-orders-closed'

export default {
  name: 'ug-page-reports-orders-closed',

  components: {
    UgReportOrdersClosed,
  },
}
</script>

<style lang="sass">
.ug-page-reports-orders
  width: 100%
</style>
