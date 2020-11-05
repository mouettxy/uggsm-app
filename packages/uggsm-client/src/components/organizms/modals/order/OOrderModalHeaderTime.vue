<template lang="pug">
span {{ time }}
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class OOrderModalHeaderTime extends Vue {
  @Prop() time!: Date
}
</script>

<style lang="sass"></style>
