<route>
{
  "name": "orders"
}
</route>

<template lang="pug">
.page-orders
  t-orders-main
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import TOrdersMain from '@/templates/TOrdersMain.vue'
import { Socket } from 'vue-socket.io-extended'

/**
 * Orders page
 */
@Component({
  components: {
    TOrdersMain
  }
})
export default class PageOrders extends Vue {
  @Socket()
  connect() {
    console.log('connected')
  }
}
</script>
