<template lang="pug">
.office-switcher-item(:class='classList')
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

  computed: {
    classList() {
      return {
        'office-switcher-item--fill-name-width': this.fillNameWidth,
        'office-switcher-item--small': this.small,
        'office-switcher-item--regular': !this.small,
      }
    },
  },

  methods: {
    getRoundedClass(direction) {
      const directionRound = `rounded-${direction}`

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

  &.office-switcher-item--regular
    .office-switcher-item__code
      height: 40px

    .office-switcher-item__name
      height: 40px

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
