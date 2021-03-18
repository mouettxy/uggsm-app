<route>
{
  "name": "calls",
  "meta": {
    "header": "Звонки",
  }
}
</route>

<template>
  <div class="ug-page-calls">
    <t-calls-main></t-calls-main>
  </div>
</template>

<script>
import TCallsMain from '@/templates/TCallsMain'

export default {
  name: 'ug-page-calls',

  components: {
    TCallsMain,
  },
}
</script>
