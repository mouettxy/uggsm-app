<template lang="pug">
.ug-side-menu__wrapper(v-if='userIsLoggedIn')
  .ug-side-menu.elevation-4
    .ug-side-menu__items
      ug-side-menu-item(
        v-for='(menuItem, menuItemIndex) in menuItems',
        :menu-item-index='menuItemIndex',
        :menu-item='menuItem',
        :key='menuItem.linkName'
      )

    ug-side-menu-user-panel
</template>

<script>
import UgSideMenuItem from './side-menu-item/side-menu-item'
import UgBaseBtn from '@/components/base/ui/base-btn/base-btn'
import { mapState } from 'vuex'

export default {
  name: 'ug-side-menu',

  components: {
    UgSideMenuItem,
    UgBaseBtn,
  },

  props: {
    menuItems: {
      required: true,
      type: Array,
    },
  },

  computed: {
    ...mapState({
      userIsLoggedIn: (state) => state.auth.isLoggedIn,
    }),
  },
}
</script>

<style lang="sass">
.ug-side-menu__wrapper
  position: fixed
  z-index: 100
  top: 0
  left: 0
  height: 100%
  width: 48px
  background: #09090C
  overflow: hidden
  border-top-right-radius: 8px
  border-bottom-right-radius: 8px
  .ug-side-menu
    position: relative
    display: flex
    height: 100%
    flex-direction: column
    padding-top: 16px

  .ug-side-menu__items
    display: flex
    flex-direction: column
    flex-grow: 1
</style>
