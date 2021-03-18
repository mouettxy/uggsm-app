<route>
{
  "name": "orders",
  "meta": {
    "header": "Заказы",
  }
}
</route>

<template>
  <div class="ug-page-orders">
    <t-orders-main></t-orders-main>
  </div>
</template>

<script>
import TOrdersMain from '@/templates/TOrdersMain'

export default {
  name: 'ug-page-orders',

  components: {
    TOrdersMain,
  },
}
</script>
