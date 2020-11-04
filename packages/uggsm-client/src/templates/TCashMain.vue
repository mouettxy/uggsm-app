<template lang="pug">
.cash-main
  o-table-toolbar
  .cash-main__content.pa-4
    o-cash-table
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

/**
 * Template of main order view
 *
 */
@Component
export default class TCashTable extends Vue {}
</script>
