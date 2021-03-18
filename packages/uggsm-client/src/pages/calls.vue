<route>
{
  "name": "calls",
  "meta": {
    "header": "Звонки"
  }
}
</route>

<template>
  <div class="ug-page-calls">
    <o-calls-table></o-calls-table>
  </div>
</template>

<script>
import OCallsTable from '@/components/organizms/OCallsTable'

export default {
  name: 'ug-page-calls',

  components: {
    OCallsTable,
  },
}
</script>
