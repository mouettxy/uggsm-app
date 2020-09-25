<template lang="pug">
.orders-main
  o-table-toolbar
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import OTableToolbar from '@/components/organizms/OTableToolbar.vue'

/**
 * Template of main order view
 *
 */
@Component({
  components: {
    OTableToolbar
  }
})
export default class TOrdersMain extends Vue {}
</script>
