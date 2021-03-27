<template>
  <div class="ug-modal-content">
    <header class="ug-modal-content__header elevation-4">
      <slot name="header"></slot>
      <v-progress-linear :active="loading" bottom absolute indeterminate></v-progress-linear>
    </header>
    <main class="ug-modal-content__main">
      <slot name="main"></slot>
    </main>
    <footer class="ug-modal-content__footer">
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'ug-modal-content',

  props: {
    loading: {
      required: false,
      type: Boolean,
    },
  },
}
</script>

<style lang="sass">
.ug-modal-content
  width: 100%
  height: 100%
  display: flex
  flex-direction: column
  flex-wrap: nowrap

  .ug-modal-content__header
    position: relative
    display: flex
    flex-shrink: 0
    background: var(--v-table_lightgrey-base)
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
</style>
