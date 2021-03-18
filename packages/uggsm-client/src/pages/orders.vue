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
    <o-orders-table></o-orders-table>
  </div>
</template>

<script>
import OOrdersTable from '@/components/organizms/OOrdersTable'

export default {
  name: 'ug-page-orders',

  components: {
    OOrdersTable,
  },
}
</script>
