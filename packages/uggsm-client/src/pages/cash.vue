<route>
{
  "name": "cash",
  "meta": {
    "header": "Касса",
  }
}
</route>

<template>
  <div class="ug-page-cash">
    <o-cash-table></o-cash-table>
  </div>
</template>

<script>
import OCashTable from '@/components/organizms/OCashTable'

export default {
  name: 'ug-page-cash',

  components: {
    OCashTable,
  },
}
</script>
