<template lang="pug">
.ug-side-menu-container(v-if='userIsLoggedIn')
  v-fade-transition(appear)
    ug-side-menu-mobile(
      v-if='mobile && userIsLoggedIn',
      :menu-items='menuItems'
    )
  v-slide-x-transition(appear)
    ug-side-menu-desktop(
      v-if='!mobile && userIsLoggedIn',
      :menu-items='menuItems'
    )
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
