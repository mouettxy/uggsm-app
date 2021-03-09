<route>
{
  "name": "reportsOrders",
  "meta": {
    "header": "Закрыто"
  }
}
</route>

<template lang="pug">
.page-reports-orders.pa-4
  ug-report-orders-closed
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
.page-reports-orders
  width: 100%
</style>
