<template lang="pug">
.ug-side-menu-container(v-if='userIsLoggedIn')
  template(v-if='mobile')
    ug-side-menu-mobile(:menu-items='menuItems')
  template(v-else)
    ug-side-menu-desktop(:menu-items='menuItems')
</template>

<script>
import UgSideMenuDesktop from './side-menu-desktop/side-menu-desktop'
import UgSideMenuMobile from './side-menu-mobile/side-menu-mobile'
import { mapState } from 'vuex'

export default {
  name: 'ug-side-menu',

  components: {
    UgSideMenuDesktop,
    UgSideMenuMobile,
  },

  props: {
    menuItems: {
      required: true,
      type: [Array],
    },
    mobile: {
      required: false,
      type: [Boolean],
    },
  },

  computed: {
    ...mapState({
      userIsLoggedIn: (state) => state.auth.isLoggedIn,
    }),
  },
}
</script>
