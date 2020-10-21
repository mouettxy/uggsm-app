<template lang="pug">
.reports-orders-main
  .reports-orders-main__content.pa-4
    v-alert(type='error')
      | Страница отчётов по заявкам находится в статусе разработки.
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
