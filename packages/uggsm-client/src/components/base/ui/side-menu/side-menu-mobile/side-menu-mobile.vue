<template lang="pug">
.ug-side-menu-wrapper.ug-side-menu-wrapper--mobile(@click='handleClick')
  .ug-side-menu.ug-side-menu--mobile
    .ug-side-menu__content.elevation-3(ref='content')
      .ug-side-menu__items-wrapper
        .ug-side-menu__utils
          ug-side-menu-user-panel.pa-0

          ug-base-btn.ug-side-menu__content-close.elevation-1(
            @click.stop='handleCloseClick',
            icon='mdi-close',
            depressed,
            color='error'
          )
        .ug-side-menu__items
          router-link.ug-side-menu__item(
            v-for='menuItem in menuItems',
            :to='{ name: menuItem.linkName }',
            :key='menuItem.linkName',
            @click.native.stop='handleCloseClick',
            exact-active-class='ug-side-menu__item--exact-active',
            active-class='ug-side-menu__item--active'
          )
            v-icon(left) {{ menuItem.icon }}
            span.text-button {{ menuItem.title }}
            template(v-if='menuItem.submenu')
              .ug-side-menu__item-submenu
                router-link.ug-side-menu__item-submenu__item(
                  v-for='submenuItem in menuItem.submenu',
                  :to='{ name: submenuItem.linkName }',
                  :key='submenuItem.linkName',
                  @click.native.stop='handleCloseClick',
                  exact-active-class='ug-side-menu__item-submenu__item--exact-active',
                  active-class='ug-side-menu__item-submenu__item--active'
                )
                  span.text-subtitle-1 {{ submenuItem.title }}
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

      .ug-side-menu__content-close
        background: rgb(241, 241, 241)

      .ug-side-menu__items-wrapper
        height: 100%
        display: flex
        flex-direction: column
        align-items: center
        .ug-side-menu__utils
          padding: 16px 0
          display: flex
          justify-content: center
          align-items: center
          gap: 128px

        .ug-side-menu__items
          height: 100%
          padding-bottom: 32px
          .ug-side-menu__item
            display: block
            text-decoration: none
            color: #151515

            &.ug-side-menu__item--exact-active
              .v-icon
                color: var(--v-primary-base) !important
              color: var(--v-primary-base)

            &.ug-side-menu__item--active
              .v-icon
                color: var(--v-primary-base) !important

            .v-icon
              color: #151515 !important

            .ug-side-menu__item-submenu
              padding-left: 48px
              .ug-side-menu__item-submenu__item
                display: block
                position: relative
                padding: 4px 0
                color: #424242
                text-decoration: none

                &::after
                  content: ''
                  position: absolute
                  width: 1px
                  height: 100%
                  background: #bdbdbd
                  left: -16px
                &.ug-side-menu__item-submenu__item--active
                  color: var(--v-primary-base)
                  text-shadow: 0px 0px 1px #1859A1

                  &::after
                    background: var(--v-primary-base)
                    box-shadow: 0px 0px 2px 1px var(--v-primary-base)


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
