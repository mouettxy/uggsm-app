<template lang="pug">
.office-switcher-item(:class='{ "office-switcher-item--fill-name-width": fillNameWidth }')
  v-chip.office-switcher-item__code(
    :small='small',
    :class='getRoundedClass("l")',
    @click='forwardClick',
    label,
    color='secondary'
  ) 
    v-icon(
      small,
      left
    ) mdi-office-building
    span {{ code }}
  v-chip.office-switcher-item__name(
    :small='small',
    :color='color',
    :class='{ ...getRoundedClass("r") }',
    @click='forwardClick',
    label
  ) {{ name }}
</template>

<script>
export default {
  name: 'ug-office-switcher-item',

  props: {
    code: {
      required: true,
      type: String,
    },
    name: {
      required: true,
      type: String,
    },
    color: {
      required: false,
      type: String,
      default: 'green',
    },
    small: {
      required: false,
      type: Boolean,
    },
    rounded: {
      required: false,
      type: Boolean,
    },
    fillNameWidth: {
      required: false,
      type: Boolean,
    },
  },

  methods: {
    getRoundedClass(direction) {
      const directionRound = `rounded-${direction}-lg`

      return this.rounded ? { 'rounded-0': true, [directionRound]: true } : { 'rounded-0': true }
    },

    forwardClick() {
      this.$emit('click', {
        code: this.code,
        name: this.name,
      })
    },
  },
}
</script>

<style lang="sass">
.office-switcher-item
  position: relative
  display: inline-block

  .office-switcher-item__code
    text-align: center

  .office-switcher-item__name
    padding-right: 30px

  &.office-switcher-item--fill-name-width
    display: flex
    .office-switcher-item__name
      width: 100%

    .office-switcher-item__code
      flex-basis: 40%
</style>
