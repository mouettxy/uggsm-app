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
.page-orders.pa-4
  ug-report-orders-daily
</template>

<script>
import UgReportOrdersDaily from '@/components/report/report-orders-daily/report-orders-daily'

export default {
  name: 'ug-page-report-orders-daily',

  components: {
    UgReportOrdersDaily,
  },
}
</script>

<style lang="sass">
.page-orders
  width: 100%
</style>
