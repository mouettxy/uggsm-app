<template lang="pug">
ug-base-btn.ug-table-remote-btn.text-subtitle-1(
  :label='label',
  :icon-left='icon',
  :block='block',
  depressed
)
</template>

<script>
import UgBaseBtn from '@/components/base/ui/base-btn/base-btn'

export default {
  name: 'ug-table-remote-btn',

  components: {
    UgBaseBtn,
  },

  props: {
    label: {
      required: false,
      type: String,
      default: '',
    },

    icon: {
      required: false,
      type: String,
      default: '',
    },

    block: {
      required: false,
      type: Boolean,
    },
  },
}
</script>

<style lang="sass">
.ug-table-remote-btn
  border: 1px solid
  border-color: var(--v-table_darkgrey-base)
  box-sizing: border-box
  max-height: 32px
  background: var(--v-light-base)
  border-radius: 8px
  text-transform: none

  .v-icon
    font-size: 1.3rem
</style>
