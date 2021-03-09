<route>
{
  "name": "reportsOrdersWithoutWork",
  "meta": {
    "header": "Закрыто на 0"
  }
}
</route>

<template lang="pug">
.page-reports-orders-without-work.pa-4
  ug-report-orders-closed-incorrect
</template>

<script>
import UgReportOrdersClosedIncorrect from '@/components/report/report-orders-closed-incorrect/report-orders-closed-incorrect'

export default {
  name: 'ug-page-orders-closed-incorrect',

  components: {
    UgReportOrdersClosedIncorrect,
  },
}
</script>

<style lang="sass">
.page-reports-orders-without-work
  width: 100%
</style>
