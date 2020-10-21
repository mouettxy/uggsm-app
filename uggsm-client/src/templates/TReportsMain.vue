<template lang="pug">
.reports-main
  .reports-main__content.pa-4
    v-alert(type='error')
      | Страница отчётов находится в статусе разработки, попробуйте перейти в раздел заявок что бы создать отчёт.
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
