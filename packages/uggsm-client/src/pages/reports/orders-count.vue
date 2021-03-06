<route>
{
  "name": "reportsOrdersCount",
  "meta": {
    "header": "Создано"
  }
}
</route>

<template lang="pug">
.page-reports-orders-count
  t-reports-orders-count
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class PageReportsOrdersCount extends Vue {}
</script>

<style lang="sass">
.page-reports-orders-count
  width: 100%
</style>
