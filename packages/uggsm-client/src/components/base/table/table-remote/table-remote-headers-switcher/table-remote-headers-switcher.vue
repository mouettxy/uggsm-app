<template lang="pug">
ug-responsive-menu(
  :menu-props='{ "close-on-content-click": false, "max-height": 400, "content-class": "ug-table-remote-headers-switcher" }'
)
  template(#activator='{ on, attrs }')
    .ug-table-remote-headers-switcher__activator(
      v-on='on',
      v-bind='attrs'
    )
      ug-base-chip(color='#d4d4d4')
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
            color='#272727'
          )
        v-list-item-title {{ header.text }}
</template>

<script>
import UgBaseChip from '@/components/base/ui/base-chip/base-chip'
import UgResponsiveMenu from '@/components/base/ui/responsive-menu/responsive-menu'

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
        this.$emit('input', value)
      },
    },
  },
}
</script>

<style lang="sass">
.ug-table-remote-headers-switcher__list
  background: #d4d4d4 !important
</style>
