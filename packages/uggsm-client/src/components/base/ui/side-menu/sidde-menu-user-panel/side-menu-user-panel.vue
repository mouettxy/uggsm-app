<template lang="pug">
.ug-side-menu-user-panel
  button.ug-side-menu-user-panel__avatar(
    @click='handleUserClick',
    @blur='handleUserBlur'
  )
    span.softgrey--text.headline {{ userInitials }}
  .ug-side-menu-user-panel__content-wrapper
    .ug-side-menu-user-panel__content.elevation-3(ref='userPanel')
      .ug-side-menu-user-panel__content-text
        span.text-subtitle-1.flex-grow-1 {{ this.user.credentials }}
        ug-base-btn.ug-side-menu-user-panel__content-button(
          @click='handleLogout',
          label='Выход',
          depressed,
          color='#09090C'
        )
</template>

<script>
import UgSideMenuAnimations from './side-menu-user-panel.animations'

import { mapState, mapActions } from 'vuex'
import { toUpper } from 'lodash'

export default {
  name: 'ug-side-menu-user-panel',

  mixins: [UgSideMenuAnimations],

  computed: {
    ...mapState({
      user: (state) => state.auth.user,
    }),

    userInitials() {
      const words = toUpper(this.user.credentials).split(' ')
      let credentials = ''

      words.forEach((e) => {
        credentials += e[0]
      })

      return credentials
    },
  },

  methods: {
    ...mapActions({
      handleLogout: 'auth/logout',
    }),
    handleUserClick() {
      const { userPanel } = this.$refs

      this.userPanelSlideIn(userPanel)
    },
    handleUserBlur() {
      const { userPanel } = this.$refs

      this.userPanelSlideOut(userPanel)
    },
  },
}
</script>

<style lang="sass">
.ug-side-menu-user-panel
  padding: 6px
  padding-bottom: 16px
  position: relative
  z-index: 101
  .ug-side-menu-user-panel__avatar
    z-index: 102
    background: var(--v-primary-base)
    height: 36px
    width: 36px
    border-radius: 50%
    position: relative
    display: flex
    align-items: center
    justify-content: center
    outline: none
    user-select: none
  .ug-side-menu-user-panel__content-wrapper
    position: absolute
    top: 4px
    left: 4px
    .ug-side-menu-user-panel__content
      display: none
      position: fixed
      border-radius: 36px
      background: #fafafa
      .ug-side-menu-user-panel__content-text
        display: none
        height: 100%
        align-items: center
        .ug-side-menu-user-panel__content-button
          border-radius: 32px
          height: 32px
          margin-left: 8px
          margin-right: 8px
          color: #dadada
</style>
