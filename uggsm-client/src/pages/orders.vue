<route>
{
  "name": "orders"
}
</route>

<template lang="pug">
  .page-orders
    v-app-bar(flat)
      span abc
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class PageOrders extends Vue {}
</script>
