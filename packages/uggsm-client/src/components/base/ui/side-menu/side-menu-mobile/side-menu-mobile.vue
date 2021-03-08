<template lang="pug">
.ug-side-menu-wrapper.ug-side-menu-wrapper--mobile(@click='handleClick')
  .ug-side-menu.ug-side-menu--mobile
    .ug-side-menu__content.elevation-3(ref='content')
      .ug-side-menu__items-wrapper
        .ug-side-menu__utils
          ug-side-menu-user-panel.ug-side-menu__utils-user-panel

          ug-base-btn.ug-side-menu__utils-close.elevation-1(
            @click.stop='handleCloseClick',
            icon='mdi-close',
            depressed,
            color='error'
          )
        .ug-side-menu__items
          ug-side-menu-item(
            v-for='(menuItem, menuItemIndex) in menuItems',
            :menu-item-index='menuItemIndex',
            :menu-item='menuItem',
            @click.stop='handleCloseClick',
            mobile
          )
    .ug-side-menu__bar
      .ug-side-menu__bar-inner
      .ug-side-menu__bar-inner.ug-side-menu__bar-inner--short
</template>

<script>
import UgSideMenuMobileAnimations from './side-menu-mobile.animations'
import UgBaseBtn from '@/components/base/ui/base-btn/base-btn'

export default {
  name: 'ug-side-menu-mobile',

  components: {
    UgBaseBtn,
  },

  mixins: [UgSideMenuMobileAnimations],

  props: {
    menuItems: {
      required: true,
      type: [Array],
    },
  },

  methods: {
    handleClick() {
      const { content } = this.$refs

      this.showMenu(content)
    },

    handleCloseClick() {
      this.hideMenu()
    },
  },
}
</script>

<style lang="sass">
.ug-side-menu-wrapper.ug-side-menu-wrapper--mobile
  position: fixed
  z-index: 100
  top: 0
  left: 0
  height: 100%
  width: 12px
  cursor: pointer
  .ug-side-menu.ug-side-menu--mobile
    display: flex
    align-items: center
    height: 100%

    .ug-side-menu__content
      display: none
      position: relative
      overflow-y: scroll

      .ug-side-menu__items-wrapper
        height: 100%
        display: flex
        flex-direction: column
        align-items: center
        .ug-side-menu__utils
          padding: 16px 16px
          display: flex
          align-items: center
          width: 100%

          .ug-side-menu__utils-close
            margin-left: auto
            background: rgb(241, 241, 241)

        .ug-side-menu__items
          height: 100%
          padding-bottom: 32px

    .ug-side-menu__bar
      display: flex
      align-items: center
      justify-content: center
      height: 50%
      width: 12px
      background: #e0e0e0
      border-top-right-radius: 8px
      border-bottom-right-radius: 8px

      .ug-side-menu__bar-inner
        height: 50%
        margin-left: 2px
        width: 2px
        background: #adadad
        &.ug-side-menu__bar-inner--short
          height: 30%

        &:first-child
          margin-left: 0
</style>
