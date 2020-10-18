<route>
{
  "name": "orders",
  "meta": {
    "header": "Заказы"
  }
}
</route>

<template lang="pug">
.page-orders
  t-orders-main
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import TOrdersMain from '@/templates/TOrdersMain.vue'

/**
 * Orders page
 */
@Component({
  components: {
    TOrdersMain,
  },
})
export default class PageOrders extends Vue {
  mounted() {
    document.title = this.$route.meta.header
  }
}
</script>
