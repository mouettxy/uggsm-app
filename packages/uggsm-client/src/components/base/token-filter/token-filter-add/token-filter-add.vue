<template lang="pug">
.ug-token-filter-add
  ug-responsive-menu(:menu-props='{ "close-on-content-click": false, "offset-x": true }')
    template(#activator='{on, attrs}')
      ug-token-filter-btn(
        v-on='on',
        v-bind='attrs',
        icon
      )
    v-card.ug-token-filter-add__options(elevation='4')
      v-list(dense)
        template(v-for='token in tokens')
          ug-responsive-menu(
            :menu-props='{ "close-on-content-click": false, "offset-x": true, "min-width": 425, "max-width": 425 }'
          )
            template(#activator='{on, attrs, value}')
              v-list-item(
                v-on='on',
                v-bind='attrs'
              )
                v-list-item-content
                  v-list-item-title {{ token.name }}
            template(#default='{ close }')
              ug-token-filter-edit(
                :token='token',
                @close='close()'
              )
</template>

<script>
import UgTokenFilterBtn from '../token-filter-btn/token-filter-btn'
import UgTokenFilterEdit from '../token-filter-edit/token-filter-edit'

export default {
  name: 'ug-token-filter-add',

  components: {
    UgTokenFilterBtn,
    UgTokenFilterEdit,
  },

  props: {
    tokens: {
      required: false,
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style lang="sass">
.ug-token-filter-add
  display: inline-block

.ug-token-filter-add__options
  background: var(--v-table_lightgrey-base) !important
  .v-list
    background: transparent
</style>
