<route>
{
  "name": "clients",
  "meta": {
    "header": "Клиенты",
  }
}
</route>

<template>
  <div class="ug-page-clients">
    <t-clients-main></t-clients-main>
  </div>
</template>

<script>
import TClientsMain from '@/templates/TClientsMain'

export default {
  name: 'ug-page-clients',

  components: {
    TClientsMain,
  },
}
</script>
