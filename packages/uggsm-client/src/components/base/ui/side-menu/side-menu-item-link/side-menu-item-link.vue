<template lang="pug">
router-link(
  :to='{ name: link.linkName }',
  :exact-active-class='exactActive || defaultExactActive',
  :class='`${defaultClass} ${defaultMobile}`',
  :active-class='active || defaultActive',
  @click.native='forwardClick'
)
  slot
</template>

<script>
const BASE_CLASS = 'ug-side-menu-item-link'
const BASE_ACTIVE_CLASS = BASE_CLASS + '--active'
const BASE_EXACT_ACTIVE_CLASS = BASE_CLASS + '--exact-active'

const BASE_SUBMENU_CLASS = 'ug-side-menu-item-link__submenu'
const BASE_SUBMENU_ACTIVE_CLASS = BASE_SUBMENU_CLASS + '--active'
const BASE_SUBMENU_EXACT_ACTIVE_CLASS = BASE_SUBMENU_CLASS + '--exact-active'

export default {
  name: 'ug-side-menu-item-link',

  props: {
    link: {
      required: true,
      type: Object,
    },

    active: {
      required: false,
      type: String,
      default: '',
    },

    exactActive: {
      required: false,
      type: String,
      default: '',
    },

    mobile: {
      required: false,
      type: Boolean,
    },

    submenu: {
      required: false,
      type: Boolean,
    },
  },

  computed: {
    defaultMobile() {
      return this.mobile ? this.defaultClass + '--mobile' : ''
    },

    defaultClass() {
      return this.submenu ? BASE_SUBMENU_CLASS : BASE_CLASS
    },

    defaultActive() {
      if (this.submenu) {
        return BASE_SUBMENU_ACTIVE_CLASS
      }

      return BASE_ACTIVE_CLASS
    },

    defaultExactActive() {
      if (this.submenu) {
        return BASE_SUBMENU_EXACT_ACTIVE_CLASS
      }

      return BASE_EXACT_ACTIVE_CLASS
    },
  },

  methods: {
    forwardClick(event) {
      this.$emit('click', event)
    },
  },
}
</script>

<style lang="sass">
.ug-side-menu-item-link, .ug-side-menu-item-link__submenu
  text-decoration: none
  outline: none
  display: block
  color: var(--v-accent-base)
</style>
