<route>
{
  "name": "orderModal"
}
</route>

<template lang="pug">
.page-orders-modal
  template(v-if='$route.params.id')
    m-order-modal(:new-order='$route.params.id === "new"', active, btn-hided)
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import { MOrderModal } from '@/components/moleculas'

/**
 * Orders page
 */
@Component({
  components: {
    MOrderModal
  }
})
export default class OrderModal extends Vue {}
</script>
