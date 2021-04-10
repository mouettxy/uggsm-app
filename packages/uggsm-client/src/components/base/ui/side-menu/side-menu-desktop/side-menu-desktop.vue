<template>
  <div class="ug-side-menu-wrapper ug-side-menu-wrapper--desktop">
    <div class="ug-side-menu elevation-4 ug-side-menu--desktop">
      <div class="ug-side-menu__items">
        <ug-side-menu-item
          v-for="(menuItem, menuItemIndex) in menuItems"
          :key="menuItem.linkName"
          :menu-item-index="menuItemIndex"
          :menu-item="menuItem"
        ></ug-side-menu-item>
      </div>

      <div class="d-flex justify-center mb-1">
        <ug-modal-user-feedback>
          <template #activator="{ on, attrs }">
            <ug-base-btn v-bind="attrs" icon="mdi-bullhorn" color="primary lighten-2" v-on="on"></ug-base-btn>
          </template>
        </ug-modal-user-feedback>
      </div>

      <ug-side-menu-user-panel class="ug-side-menu__user-panel"></ug-side-menu-user-panel>
    </div>
  </div>
</template>

<script>
import UgSideMenuItem from '../side-menu-item/side-menu-item'
import UgSideMenuUserPanel from '@/components/base/ui/side-menu/side-menu-user-panel/side-menu-user-panel'
import UgModalUserFeedback from '@/components/base/modal-user-feedback/modal-user-feedback'
import UgBaseBtn from '@/components/base/ui/base-btn/base-btn'

export default {
  name: 'ug-side-menu-desktop',

  components: {
    UgSideMenuItem,
    UgSideMenuUserPanel,
    UgModalUserFeedback,
    UgBaseBtn,
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
