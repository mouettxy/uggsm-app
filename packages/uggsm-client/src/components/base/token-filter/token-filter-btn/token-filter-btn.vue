<template lang="pug">
ug-base-btn.ug-token-filter-btn(
  :render-slot='renderSlot',
  :icon='defaultIcon',
  @click='$emit("click", $event)',
  depressed
)
  span(v-html='slotContent')
</template>

<script>
import { sprintf } from 'sprintf-js'
import UgBaseBtn from '@/components/base/ui/base-btn/base-btn'
import { comparesTranslate } from '../token-filter.helpers'
import moment from 'moment'

export default {
  name: 'ug-token-filter-btn',

  components: {
    UgBaseBtn,
  },

  props: {
    icon: {
      required: false,
      type: Boolean,
    },

    renderSlot: {
      required: false,
      type: Boolean,
    },

    filterEntry: {
      required: false,
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    defaultIcon() {
      if (this.icon && !this.renderSlot) {
        return 'mdi-plus'
      }

      return ''
    },

    slotContent() {
      if (this.renderSlot) {
        const surroundByStrong = (entry) => {
          return '<strong>' + entry + '</strong>'
        }

        const tokenName = this.filterEntry.token.name
        const tokenType = this.filterEntry.type
        const tokenValue = this.filterEntry.value
        const tokenCompares = comparesTranslate[this.filterEntry.compares]

        if (Array.isArray(tokenValue)) {
          if (tokenType === 'array') {
            const tokenValues = tokenValue.map((e) => surroundByStrong(e)).join(', ')

            return `${tokenName} ${sprintf(tokenCompares, ...tokenValues)}`
          }

          if (tokenType === 'date' && this.filterEntry.compares === 'between') {
            const tokenValues = []
            tokenValues[0] = surroundByStrong(moment(tokenValue[0]).startOf('day').format('DD MMMM YY HH:mm'))
            tokenValues[1] = surroundByStrong(moment(tokenValue[1]).endOf('day').format('DD MMMM YY HH:mm'))

            return `${tokenName} ${sprintf(tokenCompares, ...tokenValues)}`
          }
        }

        if (tokenType === 'date') {
          return `${tokenName} ${sprintf(
            tokenCompares,
            surroundByStrong(moment(tokenValue).startOf('day').format('DD MMMM YY HH:mm'))
          )}`
        }

        return `${surroundByStrong(tokenName)} ${sprintf(tokenCompares, surroundByStrong(tokenValue))}`
      }

      return ''
    },
  },
}
</script>

<style lang="sass">
.ug-token-filter-btn
  background: #ddd !important
  border-radius: 8px
  text-transform: none
  font-size: 1rem !important
  font-weight: normal
  letter-spacing: 0.05em
</style>
