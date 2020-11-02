<template lang="pug">
.reports-orders-daily
  .reports-orders-daily__content.pa-4
    o-report-orders-daily(:from='from')
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class TReportsOrdersDaily extends Vue {
  @Prop(String) from!: string
}
</script>
