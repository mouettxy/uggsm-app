<route>
{
  "name": "clients"
}
</route>

<template lang="pug">
  .page-clients
    v-alert(type="error")
      | Страница клиентов находится в статусе активной разработки.
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class PageClients extends Vue {}
</script>
