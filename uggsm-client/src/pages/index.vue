<route>
{
  "name": "index",
  "meta": {
    "header": "Рабочий стол"
  }
}
</route>

<template lang="pug">
.page-index.pa-4
  v-alert(type='error')
    | Страница рабочего стола находится в статусе активной разработки.
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class PageIndex extends Vue {}
</script>
