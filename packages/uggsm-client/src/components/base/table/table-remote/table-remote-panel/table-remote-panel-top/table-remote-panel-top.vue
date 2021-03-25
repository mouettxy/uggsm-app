<template lang="pug">
.ug-table-remote-panel-top
  template(v-if='isMobile')
    v-row(
      no-gutters,
      justify='space-between'
    )
      v-col(
        cols='8',
        v-if='includeOfficeField'
      )
        ug-office-switcher(
          name-color='#dddddd',
          code-color='#cacaca'
        )
      v-col(
        cols='4',
        :class='{ "text-right": includeOfficeField, "text-left": !includeOfficeField }'
      )
        ug-table-remote-headers-switcher(
          v-model='headers',
          compact
        )
      slot(name='panel-top:inside:mobile')
    slot(name='panel-top:outside:mobile')
  template(v-else)
    v-row(
      no-gutters,
      align='center'
    )
      v-col.pr-2(
        cols='auto',
        v-if='includeOfficeField'
      )
        ug-office-switcher(
          name-color='#dddddd',
          code-color='#cacaca'
        )
      v-col(cols='auto')
        span.text-h5 {{ $route.meta.header }}

      v-col.ml-auto.px-1(cols='auto')
        ug-table-remote-headers-switcher(v-model='headers')
      slot(name='panel-top:inside')
    slot(name='panel-top:outside')
</template>

<script>
import UgOfficeSwitcher from '@/components/office/office-switcher/office-switcher'
import UgTableRemoteHeadersSwitcher from './../../table-remote-headers-switcher/table-remote-headers-switcher'

import Responsive from '@/mixins/responsive'

export default {
  name: 'ug-table-remote-panel-top',

  components: {
    UgTableRemoteHeadersSwitcher,
    UgOfficeSwitcher,
  },

  mixins: [Responsive],

  props: {
    headers: {
      required: false,
      type: Array,
      default: () => [],
    },

    includeOfficeField: {
      required: false,
      type: Boolean,
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
  },
}
</script>

<style lang="sass">
.ug-table-remote-panel-top
  padding-left: 12px
  padding-right: 12px
</style>
