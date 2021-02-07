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
  v-alert(type='error')
    | Страница аналитики находится в статусе активной разработки.
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class PageAnalytics extends Vue {}
</script>
