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
    <o-clients-table></o-clients-table>
  </div>
</template>

<script>
import OClientsTable from '@/components/organizms/OClientsTable'

export default {
  name: 'ug-page-clients',

  components: {
    OClientsTable,
  },
}
</script>
