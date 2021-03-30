<template>
  <div
    ref="sidebar"
    class="ug-modal-content"
    :class="{ 'ug-modal-content--sidebar': sidebar, 'ug-modal-content--mobile': isMobile }"
  >
    <header class="ug-modal-content__header">
      <template v-if="sidebar && isMobile">
        <div>
          <slot name="header"></slot>
        </div>
        <ug-base-btn
          class="ml-auto"
          icon="mdi-comment-arrow-left"
          color="dark"
          @click="isSidebarVisible = !isSidebarVisible"
        ></ug-base-btn>
      </template>
      <template v-else>
        <slot name="header"></slot>
      </template>
      <v-progress-linear :active="loading" bottom absolute indeterminate></v-progress-linear>
    </header>
    <main
      class="ug-modal-content__main"
      :class="{
        'ug-modal-content__main--no-padding': mainNoPadding,
        'ug-modal-content__main--no-scroll': mainNoScroll,
      }"
    >
      <slot name="main"></slot>
    </main>
    <footer class="ug-modal-content__footer">
      <slot name="footer"></slot>
    </footer>
    <transition
      v-if="sidebar"
      name="ug-slide-right-transition"
      appear-class="ug-slide-right-transition--appear"
      appear-to-class="ug-slide-right-transition--appear-to"
      :duration="5000"
      appear
    >
      <aside v-if="isSidebarVisible" class="ug-modal-content__sidebar elevation-4">
        <div class="ug-modal-content__sidebar-toolbar">
          <slot name="sidebar-toolbar"></slot>
          <ug-base-btn
            v-if="isMobile"
            icon="mdi-comment-arrow-right"
            color="dark"
            @click="isSidebarVisible = !isSidebarVisible"
          ></ug-base-btn>
        </div>
        <div class="ug-modal-content__sidebar-content ug-scrollbar">
          <slot name="sidebar"></slot>
        </div>
      </aside>
    </transition>
  </div>
</template>

<script>
import UgBaseBtn from '@/components/base/ui/base-btn/base-btn'
import Responsive from '@/mixins/responsive'

export default {
  name: 'ug-modal-content',

  components: {
    UgBaseBtn,
  },

  mixins: [Responsive],

  props: {
    loading: {
      required: false,
      type: Boolean,
    },

    mainNoPadding: {
      required: false,
      type: Boolean,
    },

    mainNoScroll: {
      required: false,
      type: Boolean,
    },

    sidebar: {
      required: false,
      type: Boolean,
    },
  },

  data: () => ({
    isSidebarVisible: true,
  }),

  watch: {
    isMobile(value) {
      if (this.sidebar) {
        if (value) {
          this.isSidebarVisible = false
          return
        }

        this.isSidebarVisible = true
      }
    },
  },

  created() {
    if (this.sidebar && this.isMobile) {
      this.isSidebarVisible = false
    }
  },
}
</script>

<style lang="sass">

.ug-modal-content
  width: 100%
  height: 100%
  display: flex
  position: relative
  flex-flow: column nowrap

  .ug-modal-content__main--no-padding
    padding: 0 !important

  .ug-modal-content__main--no-scroll
    overflow: hidden !important

  &.ug-modal-content--sidebar
    padding-right: 400px

    &.ug-modal-content--mobile
      padding-right: 0px

      .ug-modal-content__sidebar
        width: 100%

    .ug-modal-content__header
      position: relative
      display: flex
      align-items: center
      flex-shrink: 0
      gap: 12px
      padding: 12px

    .ug-modal-content__main
      flex-grow: 1
      padding: 0 16px
      overflow-y: auto
      min-height: 1em

    .ug-modal-content__footer
      display: flex
      flex-shrink: 0
      gap: 12px
      padding: 12px

    .ug-modal-content__sidebar
      position: fixed
      top: 0
      right: 0
      padding: 12px
      background: var(--v-table_lightgrey-base)
      height: 100%
      width: 400px

      .ug-modal-content__sidebar-toolbar
        display: flex
        justify-content: space-between

      .ug-modal-content__sidebar-content
        height: calc(100% - 36px)
        overflow-y: auto

  &:not(.ug-modal-content--sidebar) .ug-modal-content__header
    position: relative
    display: flex
    align-items: center
    flex-shrink: 0
    box-shadow: 0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%) !important
    background: var(--v-table_lightgrey-base)
    gap: 12px
    padding: 12px

  &:not(.ug-modal-content--sidebar) .ug-modal-content__main
    flex-grow: 1
    padding: 0 16px
    overflow-y: auto
    min-height: 1em

  &:not(.ug-modal-content--sidebar) .ug-modal-content__footer
    display: flex
    flex-shrink: 0
    gap: 12px
    padding: 12px

.ug-modal-content__sidebar--animation-enter-active, .ug-modal-content__sidebar--animation-leave-active
  transition: transform .3s

.ug-modal-content__sidebar--animation-enter, .ug-modal-content__sidebar--animation-leave-to
  transform: translateX(100%)
</style>
