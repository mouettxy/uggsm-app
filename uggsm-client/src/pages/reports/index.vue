<route>
{
  "name": "reports",
  "meta": {
    "header": "Отчёты"
  }
}
</route>

<template lang="pug">
.page-orders
  t-reports-main
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  layout: 'reports',
})
export default class PageReports extends Vue {}
</script>

<style lang="sass">
.page-orders
  width: 100%
</style>
