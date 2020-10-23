<template lang="pug">
.reports-orders-main
  .reports-orders-main__content.pa-4
    o-orders-report
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
