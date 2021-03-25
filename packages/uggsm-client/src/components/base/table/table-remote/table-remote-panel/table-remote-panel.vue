<template lang="pug">
.ug-table-remote-panel
  ug-table-remote-panel-top(
    :include-office-field='includeOfficeField',
    :headers.sync='headersModel',
    :headers-id='headersId'
  )
    template(#panel-top:inside)
      slot(name='panel-top:inside')
    template(#panel-top:outside)
      slot(name='panel-top:outside')
    template(#panel-top:inside:mobile)
      slot(name='panel-top:inside:mobile')
    template(#panel-top:outside:mobile)
      slot(name='panel-top:outside:mobile')
  .ug-table-remote-panel__delimeter
    .ug-table-remote-panel__delimeter--inner
  ug-table-remote-panel-bottom(
    :search.sync='searchModel',
    :filter-tokens='filterTokens',
    :filter-name='filterName'
  )
    template(#bottom-panel)
      slot(name='bottom-panel')
</template>

<script>
import UgTableRemotePanelTop from './table-remote-panel-top/table-remote-panel-top'
import UgTableRemotePanelBottom from './table-remote-panel-bottom/table-remote-panel-bottom'

export default {
  name: 'table-remote-panel',

  components: {
    UgTableRemotePanelTop,
    UgTableRemotePanelBottom,
  },

  props: {
    headers: {
      required: false,
      type: Array,
      default: () => [],
    },

    headersId: {
      required: false,
      type: String,
      default: '',
    },

    includeOfficeField: {
      required: false,
      type: Boolean,
    },

    search: {
      required: true,
      type: String,
    },

    filterName: {
      required: true,
      type: String,
    },

    filterTokens: {
      required: false,
      type: Array,
      default: () => [],
    },
  },

  computed: {
    headersModel: {
      get: function () {
        return this.headers
      },

      set: function (value) {
        this.$emit('update:headers', value)
      },
    },

    searchModel: {
      get: function () {
        return this.search
      },

      set: function (value) {
        this.$emit('update:search', value)
      },
    },
  },
}
</script>

<style lang="sass">
.ug-table-remote-panel
  background: var(--v-table_lightgrey-base)
  padding: 6px 0

  .ug-table-remote-panel__delimeter
    padding: 0 12px
    margin: 8px 0
    .ug-table-remote-panel__delimeter--inner
      height: 1px
      background: var(--v-table_darkgrey-base)
</style>
