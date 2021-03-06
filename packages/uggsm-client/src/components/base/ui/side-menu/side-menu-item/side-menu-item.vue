<template lang="pug">
.ug-side-menu-item-wrapper
  template(v-if='!menuItem.submenu')
    router-link.ug-side-menu-item(
      :to='{ name: menuItem.linkName }',
      exact-active-class='ug-side-menu-item--exact-active',
      active-class='ug-side-menu-item--active'
    ) 
      v-icon(color='grey') {{ menuItem.icon }}
  template(v-else)
    router-link.ug-side-menu-item(
      :to='{ name: menuItem.linkName }',
      :id='uniqueItemId',
      exact-active-class='ug-side-menu-item--exact-active',
      active-class='ug-side-menu-item--active'
    ) 
      v-icon(color='grey') {{ menuItem.icon }}

    v-menu(
      :activator='`#${uniqueItemId}`',
      tile,
      right,
      open-on-hover,
      offset-x,
      content-class='ug-side-menu-item__submenu elevation-1'
    )
      router-link.ug-side-menu-item__submenu-item(
        v-for='submenuItem in menuItem.submenu',
        :to='{ name: submenuItem.linkName }',
        active-class='ug-side-menu-item__submenu-item--active'
      )
        span {{ submenuItem.title }}
</template>

<script>
export default {
  name: 'ug-side-menu-item',

  props: {
    menuItem: {
      required: true,
      type: Object,
    },
    menuItemIndex: {
      required: true,
      type: Number,
    },
  },

  computed: {
    uniqueItemId() {
      return `ug-side-menu-item-${this.menuItemIndex}`
    },
  },
}
</script>

<style lang="sass">
.ug-side-menu-item-wrapper
  position: relative

  &:hover > .ug-side-menu-item .v-icon
    color: #fafafa !important

  &:hover > .ug-side-menu-item
    &::after
      animation: ug-side-menu__item-animation .15s ease-out forwards

  .ug-side-menu-item
    position: relative
    text-decoration: none
    display: block
    padding: 6px 12px 6px 12px

    &::after
      content: ''
      animation: ug-side-menu__item-animation--reversed .15s ease-in
      position: absolute
      top: 0
      left: calc(100% - 4px)
      height: 0
      width: 4px
      background: var(--v-light-base)

    &.ug-side-menu-item--active
      .v-icon
        color: #fafafa !important

      &::after
        animation: ug-side-menu__item-animation--half .15s ease-out forwards
        top: 25%
        left: 0
        background: var(--v-primary-base)

    &.ug-side-menu-item--exact-active
      &::after
        animation: ug-side-menu__item-animation .15s ease-out forwards
        top: 0
        left: calc(100% - 4px)
        background: var(--v-light-base)

.ug-side-menu-item__submenu
  z-index: 101
  background: rgba(9, 9, 12, .85)
  border-radius: 0
  padding: 8px 0
  width: auto

  .ug-side-menu-item__submenu-item
    display: block
    position: relative
    text-decoration: none
    transition: background .3s
    color: #dadada
    padding: 2px 8px 2px 16px
    font-size: 1rem

    &::after
      content: ""
      position: absolute
      left: 8px
      top: 0
      height: 100%
      width: 1px
      background-color: var(--v-secondary-lighten5)

    &:hover
      background: rgba(9, 9, 12, 1)

    &.ug-side-menu-item__submenu-item--active
      font-weight: bold

      &::after
        width: 3px
        left: 7px

@keyframes ug-side-menu__item-animation--half
  0%
    height: 0

  100%
    height: 50%

@keyframes ug-side-menu__item-animation
  0%
    height: 0

  100%
    height: 100%

@keyframes ug-side-menu__item-animation--reversed
  0%
    height: 100%

  100%
    height: 0
</style>
