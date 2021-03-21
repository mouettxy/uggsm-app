<template lang="pug">
.ug-side-menu__container
  menu.ug-side-menu.ug-side-menu--mobile.elevation-3
    .ug-side-menu--wrapper
      v-slide-x-reverse-transition
        header.ug-side-menu__header
          ug-base-btn.ug-side-menu__action-menu(
            :icon='isMobileMenuVisible ? "mdi-close" : "mdi-menu"',
            :class='{ "ug-side-menu__action-menu--close": isMobileMenuVisible }',
            @click='handleMenuClick',
            color='light'
          )
          ug-base-btn.ug-side-menu__action-logout(
            @click.stop='handleLogout',
            icon='mdi-logout',
            color='light'
          )
          span.ug-side-menu__title.light--text {{ $route.meta.header }}
          span.ug-side-menu__username.light--text {{ userCredentials }}
          button.ug-side-menu__action-user(
            :color='isUserPanelVisible ? "primary" : "light"',
            @click.stop='handleUserPanelClick',
            @blur='handleUserPanelBlur'
          )
            v-icon(:class='{ "primary--text": isUserPanelVisible, "light--text": !isUserPanelVisible }') mdi-account-circle
  .ug-side-menu-content
    .ug-side-menu-content--wrapper
      .ug-side-menu-content__links
        ug-side-menu-item(
          v-for='(menuItem, menuItemIndex) in menuItems',
          :menu-item-index='menuItemIndex',
          :menu-item='menuItem',
          @click='handleMenuCloseClick',
          mobile
        )
      button.ug-side-menu-content__close(@click='handleMenuCloseClick')
        v-icon(
          size='3rem',
          color='dark'
        ) mdi-chevron-up
</template>

<script>
import UgSideMenuMobileAnimations from './side-menu-mobile.animations'
import UgBaseBtn from '@/components/base/ui/base-btn/base-btn'
import { mapActions, mapState } from 'vuex'

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

  data: () => ({
    userPanel: false,
  }),

  computed: {
    ...mapState({
      userCredentials: (state) => state.auth.user.credentials,
    }),
  },

  methods: {
    ...mapActions({
      handleLogout: 'auth/logout',
    }),

    handleUserPanelClick() {
      this.showUserPanel()
    },

    handleUserPanelBlur() {
      this.hideUserPanel()
    },

    handleMenuClick() {
      this.showMenu()
    },

    handleMenuCloseClick() {
      this.hideMenu()
    },
  },
}
</script>

<style lang="sass">
$color-menu: #09090C
$color-content: #ddd

.ug-side-menu__container
  .ug-side-menu.ug-side-menu--mobile
    width: 100%
    top: 0
    z-index: 101
    background: $color-menu
    border-radius: 0 0 6px 6px
    position: fixed
    margin-bottom: 48px

    .ug-side-menu--wrapper
      position: relative
      padding: 4px 12px 4px 12px
      height: 48px

      .ug-side-menu__header
        display: flex
        align-items: center
        justify-content: space-between

        .ug-side-menu__action-menu
          transition: transform .8s cubic-bezier(0.16, 1, 0.3, 1)
          &--close
            transform: rotate(360deg)

        .ug-side-menu__action-user
          outline: none

        .ug-side-menu__title, .ug-side-menu__username
          font-size: 1.35rem

        .ug-side-menu__username, .ug-side-menu__action-logout
          display: none

        .v-icon
          font-size: 2rem

  .ug-side-menu-content
    display: none
    position: fixed
    z-index: 100
    background: $color-content
    top: 44px
    left: 0
    width: 100%
    height: 100%

    .ug-side-menu-content--wrapper
      padding-top: 24px
      display: flex
      justify-content: space-between
      align-items: center
      flex-direction: column

      .ug-side-menu-content__links
        height: calc(100vh - 42px - 24px - 66px)
        overflow-y: scroll

      .ug-side-menu-content__close
        display: block
        padding: 12px
        width: 100%
        text-align: center
        outline: none
        transition: background, text-shadow .3s

        &:hover
          background: darken($color-content, 5%)

          .v-icon
            text-shadow: 0 1px 3px rgba(0, 0, 0, .5)

        &:active
          background: darken($color-content, 5%)

          .v-icon
            text-shadow: 0 3px 3px rgba(0, 0, 0, .5)
</style>
