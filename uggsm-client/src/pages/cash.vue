<route>
{
  "name": "cash",
  "meta": {
    "header": "Касса"
  }
}
</route>

<template lang="pug">
.page-cash
  t-cash-main
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class PageCash extends Vue {}
</script>
