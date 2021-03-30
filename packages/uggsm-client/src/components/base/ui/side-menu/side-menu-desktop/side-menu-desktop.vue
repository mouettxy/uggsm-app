<template lang="pug">
.ug-side-menu-wrapper.ug-side-menu-wrapper--desktop
  .ug-side-menu.elevation-4.ug-side-menu--desktop
    .ug-side-menu__items
      ug-side-menu-item(
        v-for='(menuItem, menuItemIndex) in menuItems',
        :menu-item-index='menuItemIndex',
        :menu-item='menuItem',
        :key='menuItem.linkName'
      )

    ug-side-menu-user-panel.ug-side-menu__user-panel
</template>

<script>
import UgSideMenuItem from '../side-menu-item/side-menu-item'
import UgSideMenuUserPanel from '@/components/base/ui/side-menu/side-menu-user-panel/side-menu-user-panel'

export default {
  name: 'ug-side-menu-desktop',

  components: {
    UgSideMenuItem,
    UgSideMenuUserPanel,
  },

  props: {
    menuItems: {
      required: true,
      type: [Array],
    },
  },
}
</script>

<style lang="sass">
.ug-side-menu-wrapper.ug-side-menu-wrapper--desktop
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
  .ug-side-menu.ug-side-menu--desktop
    position: relative
    display: flex
    height: 100%
    flex-direction: column
    padding-top: 16px

    .ug-side-menu__user-panel
      margin-bottom: 16px
      margin-left: 6px

    .ug-side-menu__items
      display: flex
      flex-direction: column
      flex-grow: 1
</style>
