<route>
{
  "name": "analytic"
}
</route>

<template lang="pug">
  .page-analytics
    v-alert(type="error")
      | Страница аналитики находится в статусе активной разработки.
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class PageAnalytics extends Vue {}
</script>
