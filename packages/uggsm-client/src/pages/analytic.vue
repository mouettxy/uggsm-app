<route>
{
  "name": "analytic",
  "meta": {
    "header": "Аналитика",
    "resource": "Analytics"
  }
}
</route>

<template lang="pug">
.page-analytics.pa-4
  span Страница используется в тестовых целях
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class PageAnalytics extends Vue {}
</script>
