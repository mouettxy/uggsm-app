<route>
{
  "name": "orders",
  "meta": {
    "header": "Заказы",
    "resource": "Order"
  }
}
</route>

<template lang="pug">
.page-orders
  t-orders-main
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

/**
 * Orders page
 */
@Component({
  layout: 'orders',
})
export default class PageOrders extends Vue {}
</script>
