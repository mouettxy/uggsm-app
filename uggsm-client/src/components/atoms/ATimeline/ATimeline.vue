<template lang="pug">
.timeline
  slot
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class ATimeline extends Vue {}
</script>

<style lang="sass"></style>
