<route>
{
  "name": "cash"
}
</route>

<template lang="pug">
  .page-cash
    v-alert(type="error")
      | Страница кассы находится в статусе активной разработки.
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class PageCash extends Vue {}
</script>
