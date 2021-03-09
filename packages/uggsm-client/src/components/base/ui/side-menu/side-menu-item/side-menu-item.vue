<template lang="pug">
.ug-side-menu-item-wrapper(
  v-if='canAccessResource',
  :class='responsiveDefaultClass'
)
  template(v-if='!mobile')
    template(v-if='!menuItem.submenu')
      ug-side-menu-item-link(
        :link='menuItem',
        @click='forwardClick'
      )
        v-icon(color='grey') {{ menuItem.icon }}

    template(v-else)
      ug-side-menu-item-link(
        :link='menuItem',
        :id='uniqueItemId',
        @click='forwardClick'
      )
        v-icon(color='grey') {{ menuItem.icon }}

      v-menu(
        :activator='`#${uniqueItemId}`',
        tile,
        right,
        open-on-hover,
        offset-x,
        content-class='ug-side-menu-item__submenu ug-side-menu-item__submenu--desktop'
      )
        template(v-for='submenuItem in menuItem.submenu')
          ug-side-menu-item-link(
            v-if='canAccessSubResource(submenuItem.linkName)',
            :link='submenuItem',
            :key='submenuItem.linkName',
            @click='forwardClick',
            submenu
          )
            span {{ submenuItem.title }}
  template(v-else)
    ug-side-menu-item-link(
      :link='menuItem',
      @click='forwardClick',
      mobile
    )
      v-icon(left) {{ menuItem.icon }}
      span.text-button {{ menuItem.title }}

      template(v-if='menuItem.submenu')
        .ug-side-menu-item__submenu
          template(v-for='submenuItem in menuItem.submenu')
            ug-side-menu-item-link(
              v-if='canAccessSubResource(submenuItem.linkName)',
              :link='submenuItem',
              :key='submenuItem.linkName',
              @click='forwardClick',
              submenu,
              mobile
            )
              span.text-subtitle-1 {{ submenuItem.title }}
</template>

<script>
import UgSideMenuItemLink from '../side-menu-item-link/side-menu-item-link'

const BASE_RESPONSIVE_DEFAULT_CLASS = 'ug-side-menu-item-wrapper'

export default {
  name: 'ug-side-menu-item',

  components: {
    UgSideMenuItemLink,
  },

  props: {
    menuItem: {
      required: true,
      type: Object,
    },

    menuItemIndex: {
      required: true,
      type: Number,
    },

    mobile: {
      required: false,
      type: Boolean,
    },
  },

  computed: {
    responsiveDefaultClass() {
      return this.mobile ? BASE_RESPONSIVE_DEFAULT_CLASS + '--mobile' : BASE_RESPONSIVE_DEFAULT_CLASS + '--desktop'
    },

    uniqueItemId() {
      return `ug-side-menu-item-${this.menuItemIndex}`
    },

    canAccessResource() {
      return this.$can('access', 'Global', this.menuItem.linkName)
    },
  },

  methods: {
    forwardClick(event) {
      this.$emit('click', event)
    },

    canAccessSubResource(resource) {
      return this.$can('access', 'Global', resource)
    },
  },
}
</script>

<style lang="sass">
$color-light: var(--v-light-base)
$color-primary: var(--v-primary-base)
$color-grey: #dadada
$color-dark: #09090c
$animation-time: .15s

.ug-side-menu-item-wrapper.ug-side-menu-item-wrapper--mobile
  .ug-side-menu-item-link
    display: block
    text-decoration: none
    color: $color-dark

    .v-icon
      color: $color-dark !important

    &.ug-side-menu-item-link--exact-active
      .v-icon
        color: $color-primary !important
      color: $color-primary

    &.ug-side-menu-item-link--active
      .v-icon
        color: $color-primary !important

    .ug-side-menu-item__submenu
      padding-left: 48px
      position: relative
      .ug-side-menu-item-link__submenu
        display: block
        position: relative
        padding: 4px 0
        color: darken($color-grey, 50%)
        text-decoration: none
        white-space: nowrap
        text-overflow: ellipsis
        overflow: hidden
        width: 200px

        &::after
          content: ''
          position: absolute
          width: 1px
          height: 100%
          background: darken($color-grey, 30%)
          left: -16px

        &.ug-side-menu-item-link__submenu--active
          color: $color-primary
          text-shadow: 0px 0px 1px $color-primary
          &::after
            background: $color-primary
            box-shadow: 0px 0px 2px 1px $color-primary

.ug-side-menu-item-wrapper.ug-side-menu-item-wrapper--desktop
  position: relative

  &:hover > .ug-side-menu-item-link .v-icon
    color: $color-light !important

  &:hover > .ug-side-menu-item-link
    &::after
      animation: animate-height $animation-time ease-out forwards

  .ug-side-menu-item-link
    position: relative
    display: block
    padding: 6px 12px 6px 12px

    &::after
      content: ''
      animation: animate-height--reversed $animation-time ease-in
      position: absolute
      top: 0
      left: calc(100% - 4px)
      height: 0
      width: 4px
      background: var(--v-light-base)

    &.ug-side-menu-item-link--active
      .v-icon
        color: $color-light !important

      &::after
        animation: animate-height--half $animation-time ease-out forwards
        top: 25%
        left: 0
        background: $color-primary

    &.ug-side-menu-item-link--exact-active
      &::after
        animation: animate-height $animation-time ease-out forwards
        top: 0
        left: calc(100% - 4px)
        background: $color-light

.ug-side-menu-item__submenu.ug-side-menu-item__submenu--desktop
  z-index: 101
  background: rgb($color-dark, .85)
  border-radius: 0
  padding: 8px 0
  width: auto

  .ug-side-menu-item-link__submenu
    display: block
    position: relative
    transition: background .3s
    color: $color-grey
    padding: 2px 8px 2px 16px
    font-size: 1rem

    &::after
      content: ""
      position: absolute
      left: 8px
      top: 0
      height: 100%
      width: 1px
      background: darken($color-grey, 30%)

    &:hover
      background: rgb($color-dark, 1)

    &.ug-side-menu-item-link__submenu--active
      font-weight: bold

      &::after
        background: $color-primary
        box-shadow: 0px 0px 2px 1px $color-primary

@keyframes animate-height--half
  0%
    height: 0

  100%
    height: 50%

@keyframes animate-height
  0%
    height: 0

  100%
    height: 100%

@keyframes animate-height--reversed
  0%
    height: 100%

  100%
    height: 0
</style>
