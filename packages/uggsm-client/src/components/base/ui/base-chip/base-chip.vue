<template lang="pug">
v-chip.ug-base-chip(
  :small='small',
  :color='color',
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
  },
}
</script>

<style></style>
