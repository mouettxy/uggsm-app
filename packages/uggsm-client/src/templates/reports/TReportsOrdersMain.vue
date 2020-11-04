<template lang="pug">
.reports-orders-main
  .reports-orders-main__content.pa-4
    o-report-orders
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

/**
 * Template of main order view
 *
 */
@Component
export default class TReportsOrdersMain extends Vue {}
</script>
