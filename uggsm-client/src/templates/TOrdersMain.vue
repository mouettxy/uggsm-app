<template lang="pug">
.orders-main
  o-table-toolbar
  .orders-main__content.pa-4
    o-orders-table
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import OTableToolbar from '@/components/organizms/OTableToolbar.vue'
import OOrdersTable from '@/components/organizms/OOrdersTable.vue'
/**
 * Template of main order view
 *
 */
@Component({
  components: {
    OTableToolbar,
    OOrdersTable
  }
})
export default class TOrdersMain extends Vue {}
</script>
