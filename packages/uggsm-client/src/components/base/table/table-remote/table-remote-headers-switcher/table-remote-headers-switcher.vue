<template lang="pug">
ug-responsive-menu(
  :menu-props='{ "close-on-content-click": false, "max-height": 400, "content-class": "ug-table-remote-headers-switcher" }'
)
  template(#activator='{ on, attrs }')
    .ug-table-remote-headers-switcher__activator(
      v-on='on',
      v-bind='attrs'
    )
      ug-base-chip(color='table_darkgrey')
        v-icon(
          small,
          left
        ) mdi-cog
        span {{ compact ? "Колонки" : "Настроить колонки" }}
  v-card
    v-list.ug-table-remote-headers-switcher__list
      v-list-item(
        v-for='header in model',
        :key='header.value'
      )
        v-list-item-action
          v-switch(
            v-model='header.show',
            @change='addToStorage',
            color='#272727'
          )
        v-list-item-title {{ header.text }}
</template>

<script>
import UgBaseChip from '@/components/base/ui/base-chip/base-chip'
import UgResponsiveMenu from '@/components/base/ui/responsive-menu/responsive-menu'
import { addToStorage, getFromStorage } from '@/api/helpers/storageManager'

export default {
  name: 'ug-table-remote-headers-switcher',

  components: {
    UgBaseChip,
    UgResponsiveMenu,
  },

  model: {
    prop: 'headers',
    event: 'update',
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

    compact: {
      required: false,
      type: Boolean,
    },
  },

  data: function () {
    return {
      menu: false,
    }
  },

  computed: {
    model: {
      get: function () {
        return this.headers
      },

      set: function (value) {
        this.$emit('update', value)
      },
    },
  },

  mounted: function () {
    const storageData = this.getFromStorage()

    if (storageData) {
      this.model = storageData
    }
  },

  methods: {
    getFromStorage() {
      if (this.headersId) {
        const storageData = getFromStorage(this.headersId)

        if (storageData !== null) {
          return storageData
        }
      }

      return null
    },

    addToStorage() {
      if (this.headersId) {
        addToStorage(this.headersId, this.headers)
      }
    },
  },
}
</script>

<style lang="sass">
.ug-table-remote-headers-switcher__list
  background: var(--v-table_lightgrey) !important
</style>
