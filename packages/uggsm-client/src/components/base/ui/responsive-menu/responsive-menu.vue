<template lang="pug">
.ug-responsive-menu
  template(v-if='!isMobile')
    v-menu(
      v-bind='menuProps',
      v-model='model'
    )
      template(#activator='{on, attrs}')
        slot(
          name='activator',
          :on='on',
          :attrs='attrs'
        )
      slot(
        name='default',
        :close='close'
      )
  template(v-else)
    v-bottom-sheet(
      v-bind='sheetPropsModified',
      v-model='model'
    )
      template(#activator='{on, attrs}')
        slot(
          name='activator',
          :on='on',
          :attrs='attrs'
        )
      slot(
        name='default',
        :close='close'
      )
</template>

<script>
import Responsive from '@/mixins/responsive'

export default {
  name: 'ug-responsive-menu',

  mixins: [Responsive],

  props: {
    menuProps: {
      required: false,
      type: Object,
      default: () => ({}),
    },

    sheetProps: {
      required: false,
      type: Object,
      default: () => ({}),
    },

    menu: {
      required: false,
      type: Boolean,
    },
  },

  data: function () {
    return {
      model: false,
    }
  },

  computed: {
    sheetPropsModified() {
      return {
        ...this.sheetProps,
        'content-class': [this.sheetProps['content-class'] || '', 'ug-responsive-menu-sheet'].join(' '),
      }
    },
  },

  watch: {
    model(value) {
      this.$emit('update:menu', value)
    },
  },

  methods: {
    close() {
      this.model = false
    },
  },
}
</script>

<style lang="sass">
.ug-responsive-menu-sheet.v-bottom-sheet
  overflow-y: scroll !important
</style>
