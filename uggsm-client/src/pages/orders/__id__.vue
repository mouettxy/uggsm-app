<route>
{
  "name": "orderModal",
  "meta": {
    "header": "Заказ"
  }
}
</route>

<template lang="pug">
.page-orders-modal
  template(v-if='$route.params.id')
    m-order-modal(
      :new-order='$route.params.id === "new"',
      btn-hided,
      active
    )
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

/**
 * Orders page
 */
@Component
export default class OrderModal extends Vue {
  mounted() {
    document.title = this.$route.params.id === 'new' ? 'Новый заказ' : 'Заказ №' + this.$route.params.id
  }
}
</script>
