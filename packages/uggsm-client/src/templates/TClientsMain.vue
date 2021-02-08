<template lang="pug">
.orders-main
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
