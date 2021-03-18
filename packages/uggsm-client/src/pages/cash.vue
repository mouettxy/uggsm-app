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
    <t-cash-main></t-cash-main>
  </div>
</template>

<script>
import TCashMain from '@/templates/TCashMain'

export default {
  name: 'ug-page-cash',

  components: {
    TCashMain,
  },
}
</script>
