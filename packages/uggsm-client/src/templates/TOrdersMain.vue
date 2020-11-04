<template lang="pug">
.orders-main
  o-table-toolbar
  .orders-main__content.pa-4
    o-orders-table
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

/**
 * Template of main order view
 *
 */
@Component
export default class TOrdersMain extends Vue {}
</script>
