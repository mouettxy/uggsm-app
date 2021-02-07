<route>
{
  "name": "calls",
  "meta": {
    "header": "Звонки",
    "resource": "Calls"
  }
}
</route>

<template lang="pug">
.page-calls
  t-calls-main
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class PageCalls extends Vue {}
</script>
