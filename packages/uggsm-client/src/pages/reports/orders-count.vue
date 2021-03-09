<route>
{
  "name": "reportsOrdersCount",
  "meta": {
    "header": "Создано"
  }
}
</route>

<template lang="pug">
.page-reports-orders-count.pa-4
  ug-report-orders-count
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
.page-reports-orders-count
  width: 100%
</style>
