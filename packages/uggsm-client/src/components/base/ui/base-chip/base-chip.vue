<template lang="pug">
v-chip.ug-base-chip(
  :small='small',
  :color='color',
  :class='{ "ug-base-chip--clickable": clickable }',
  @click='$emit("click", $event)',
  label
)
  slot
</template>

<script>
export default {
  name: 'ug-base-chip',

  props: {
    color: {
      required: false,
      type: String,
      default: 'softgrey',
    },

    small: {
      required: false,
      type: Boolean,
    },

    clickable: {
      required: false,
      type: Boolean,
    },
  },
}
</script>

<style lang="sass">
.ug-base-chip
  .ug-base-chip--clickable
    cursor: pointer !important
</style>
