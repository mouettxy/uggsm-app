<route>
{
  "name": "reportsOrdersWithoutWork",
  "meta": {
    "header": "Отчёт по заявкам без работы"
  }
}
</route>

<template lang="pug">
.page-reports-orders-without-work
  t-reports-orders-without-work
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  layout: 'reports',
})
export default class PageReportsOrdersWithoutWork extends Vue {}
</script>

<style lang="sass">
.page-reports-orders-without-work
  width: 100%
</style>
