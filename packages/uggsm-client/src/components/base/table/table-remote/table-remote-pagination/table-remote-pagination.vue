<template lang="pug">
.ug-table-remote-pagination.d-flex(:class='{ "justify-space-between": !!$scopedSlots["pagination-left"] }')
  .ug-table-remote-pagination__slot
    slot(name='pagination-left')
  .ug-table-remote-pagination__content.d-flex.align-center
    v-icon(
      @click='handlePaginateBack',
      color='dark'
    ) mdi-chevron-left
    .ug-table-remote-pagination-delimeter
      .ug-table-remote-pagination-delimeter--inner
    input(
      v-model.number='pageBuffer',
      :style='{ width: paginationInputWidth }',
      @input='handlePageChange',
      type='number',
      step='1',
      min='1'
    )
    span.ml-2.text-no-wrap из {{ serverPages }}
    .ug-table-remote-pagination-delimeter
      .ug-table-remote-pagination-delimeter--inner
    v-icon(
      @click='handlePaginateForward',
      color='dark'
    ) mdi-chevron-right
</template>

<script>
export default {
  name: 'ug-table-remote-pagination',

  model: {
    prop: 'page',
    event: 'input',
  },

  props: {
    page: {
      required: false,
      type: [Number, String],
      default: 1,
    },

    serverPages: {
      required: false,
      type: Number,
      default: 1,
    },
  },

  data: function () {
    return {
      pageBuffer: this.page,
    }
  },

  computed: {
    paginationInputWidth() {
      return `calc(${String(this.pageBuffer).length + 'ch'} + 26px)`
    },
  },

  watch: {
    pageBuffer: function (value) {
      this.$emit('input', value)
    },
  },

  methods: {
    handlePageChange(event) {
      if (event.inputType !== 'deleteContentBackward') {
        if ((this.serverPages > 0 && this.pageBuffer > this.serverPages) || typeof this.pageBuffer !== 'number') {
          this.pageBuffer = this.serverPages
        }
      } else {
        if (!String(this.pageBuffer).length) {
          this.pageBuffer = 1
        }
      }
    },

    handlePaginateBack() {
      const resultingPage = this.pageBuffer - 1

      if (resultingPage > 0) {
        this.pageBuffer = resultingPage
      }
    },

    handlePaginateForward() {
      if (this.serverPages > 0) {
        const resultingPage = this.pageBuffer + 1

        if (resultingPage < this.serverPages + 1) {
          this.pageBuffer = resultingPage
        }
      }
    },
  },
}
</script>

<style lang="sass">
.ug-table-remote-pagination
  display: flex
  justify-content: flex-end
  color: var(--v-table_darkergrey-base)
  align-items: center
  padding: 0 12px
  margin: 8px 0
  .v-icon
    cursor: pointer
    &:hover
      transform: scale(1.5)
      color: var(--v-primary-base) !important
  input
    padding: 4px 12px
    border: 1px solid var(--v-table_darkgrey-base)
    border-radius: 8px
    &:focus
      outline: none
      box-shadow: 0px 0px 4px rgb(0, 0, 0, .3)
    &::-webkit-outer-spin-button, &::-webkit-inner-spin-button
      display: none
  .ug-table-remote-pagination-delimeter
    height: 16px
    width: 1px
    margin: 0 8px
    .ug-table-remote-pagination-delimeter--inner
      height: inherit
      background: var(--v-table_darkgrey-base)
</style>
