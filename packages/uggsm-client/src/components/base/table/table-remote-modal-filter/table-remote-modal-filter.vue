<template lang="pug">
ug-modal-right(
  v-model='modal',
  eager
)
  template(#activator='{on, attrs}')
    ug-table-remote-btn(
      v-on='on',
      v-bind='attrs',
      :label='isMobile ? "Фильтры" : "Управление фильтром"',
      :block='isMobile',
      icon='mdi-filter-menu'
    )
  v-card-title.table_lightgrey.d-flex.justify-space-between
    span Управление фильтром
    ug-base-btn(
      @click='modal = false',
      icon='mdi-close'
    )
  v-card-text.py-4
    ug-token-filter(
      ref='filter',
      :type='filterName',
      :tokens='filterTokens'
    )
    v-divider.mt-4.mb-2
    ug-token-filter-manager(:filter='filterName')
</template>

<script>
import UgModalRight from '@/components/base/ui/modal-right/modal-right'
import UgTableRemoteBtn from '@/components/base/table/table-remote/table-remote-btn/table-remote-btn'
import UgTokenFilter from '@/components/base/token-filter/token-filter'
import UgTokenFilterManager from '@/components/base/token-filter-manager/token-filter-manager'
import UgBaseBtn from '@/components/base/ui/base-btn/base-btn'

import Responsive from '@/mixins/responsive'

export default {
  name: 'ug-table-remote-modal-filter',

  components: {
    UgModalRight,
    UgTableRemoteBtn,
    UgTokenFilter,
    UgTokenFilterManager,
    UgBaseBtn,
  },

  mixins: [Responsive],

  props: {
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

  data: () => ({
    modal: false,
  }),
}
</script>
