<template lang="pug">
.orders-main
  o-table-toolbar(hide-offices)
  .orders-main__content.pa-4
    o-clients-table
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

/**
 * Template of main order view
 *
 */
@Component
export default class TClientsMain extends Vue {}
</script>
