<template lang="pug">
ug-token-filter-edit(
  :token-index='filterIndex',
  :token='filterEntry.token',
  :filter-value='filterEntry.value',
  :filter-compare='filterEntry.compares',
  @update-filter='handleUpdateFilter',
  existing
)
  template(#activator='{on, attrs}')
    v-slide-y-transition
      ug-base-chip.ug-token-filter-entry(
        v-if='!filterEntry.disabled',
        v-on='on',
        v-bind='attrs',
        color='#ddd'
      )
        span(v-html='slotContent')
        ug-responsive-menu(:menu-props='{ "offset-y": true }')
          template(#activator='{on, attrs}')
            ug-base-btn(
              v-bind='attrs',
              v-on.stop.prevent='on',
              icon='mdi-dots-horizontal',
              color='dark'
            )
          v-list(dense)
            v-subheader Действия с фильтром
            v-list-item(@click='handleDisableFilter')
              v-list-item-content
                v-list-item-title Выключить фильтр
            v-list-item(@click='handleDeleteFilter')
              v-list-item-content
                v-list-item-title.error--text Удалить фильтр
      ug-base-chip.ug-token-filter-entry.ug-token-filter-entry--not-allowed(
        v-if='filterEntry.disabled',
        color='#eee'
      )
        span(v-html='slotContent')
        ug-responsive-menu(:menu-props='{ "offset-y": true }')
          template(#activator='{on, attrs}')
            ug-base-btn(
              v-bind='attrs',
              v-on.stop.prevent='on',
              icon='mdi-dots-horizontal',
              color='dark'
            )
          v-list(dense)
            v-subheader Действия с фильтром
            v-list-item(@click='handleEnableFilter')
              v-list-item-content
                v-list-item-title Включить фильтр
            v-list-item(@click='handleDeleteFilter')
              v-list-item-content
                v-list-item-title.error--text Удалить фильтр
</template>

<script>
import UgBaseChip from '@/components/base/ui/base-chip/base-chip'
import UgTokenFilterEdit from '../token-filter-edit/token-filter-edit'

import { sprintf } from 'sprintf-js'
import { comparesTranslate, prettifyTokenValue } from '@/helpers/filterHelper'

export default {
  name: 'ug-token-filter-entry',

  components: {
    UgTokenFilterEdit,
    UgBaseChip,
  },

  props: {
    filterEntry: {
      required: false,
      type: Object,
      default: () => ({}),
    },

    filterIndex: {
      required: true,
      type: Number,
    },
  },

  computed: {
    slotContent() {
      const surroundByStrong = (entry) => {
        return '<strong>' + entry + '</strong>'
      }

      const tokenName = this.filterEntry.token.name
      const tokenType = this.filterEntry.token.type
      const tokenValue = prettifyTokenValue(this.filterEntry.token, this.filterEntry.value, this.filterEntry.compares)
      const tokenCompares = comparesTranslate[this.filterEntry.compares]

      if (Array.isArray(tokenValue)) {
        if (tokenType === 'array') {
          let tokenValues
          if (tokenValue.length < 3) {
            tokenValues = tokenValue.map((e) => surroundByStrong(e)).join(', ')
          } else {
            tokenValues = surroundByStrong(`${tokenValue[0]} (+${tokenValue.length - 1})`)
          }

          return `${surroundByStrong(tokenName)} ${sprintf(tokenCompares, tokenValues)}`
        }

        if (this.filterEntry.compares === 'between') {
          const tokenValues = []
          tokenValues[0] = surroundByStrong(tokenValue[0])
          tokenValues[1] = surroundByStrong(tokenValue[1])

          return `${surroundByStrong(tokenName)} ${sprintf(tokenCompares, ...tokenValues)}`
        }
      }

      if (tokenType === 'date') {
        return `${surroundByStrong(tokenName)} ${sprintf(tokenCompares, surroundByStrong(tokenValue))}`
      }

      return `${surroundByStrong(tokenName)} ${sprintf(tokenCompares, surroundByStrong(tokenValue))}`
    },
  },

  methods: {
    handleDisableFilter() {
      this.$emit('disable-filter', this.filterIndex)
    },

    handleEnableFilter() {
      this.$emit('enable-filter', this.filterIndex)
    },

    handleDeleteFilter() {
      this.$emit('delete-filter', this.filterIndex)
    },

    handleUpdateFilter(filter, index) {
      this.$emit('update-filter', filter, index)
    },
  },
}
</script>

<style lang="sass">
.ug-token-filter-entry
  padding-right: 0
  &--not-allowed
    cursor: not-allowed
</style>
