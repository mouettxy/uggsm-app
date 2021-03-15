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
      v-bind='sheetProps',
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
  },

  data: function () {
    return {
      model: false,
    }
  },

  methods: {
    close() {
      this.model = false
    },
  },
}
</script>

<style lang="sass">
// *
</style>
