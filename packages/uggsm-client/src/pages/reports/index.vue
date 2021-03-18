<route>
{
  "name": "reports",
  "meta": {
    "header": "Ежедневный отчёт",
  }
}
</route>

<template>
  <div class="ug-page-orders pa-4">
    <ug-report-orders-daily></ug-report-orders-daily>
  </div>
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
.ug-page-orders
  width: 100%
</style>
