<route>
{
  "name": "reportsOrders",
  "meta": {
    "header": "Закрыто"
  }
}
</route>

<template lang="pug">
.page-reports-orders
  t-reports-orders-main
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class PageReportsOrders extends Vue {}
</script>

<style lang="sass">
.page-reports-orders
  width: 100%
</style>
