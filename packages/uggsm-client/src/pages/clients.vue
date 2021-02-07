<route>
{
  "name": "clients",
  "meta": {
    "header": "Клиенты",
    "resource": "Client"
  }
}
</route>

<template lang="pug">
.page-clients
  t-clients-main
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class PageClients extends Vue {}
</script>
