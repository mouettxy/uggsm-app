<template lang="pug">
v-card.ug-token-filter-edit(elevation='6')
  v-radio-group.mt-0(
    v-model='selected',
    mandatory,
    label='Настройка фильтра',
    hide-details,
    column
  )
    ug-token-filter-edit-compares(
      :value='prettyValue',
      :token='token',
      :selected.sync='selected'
    )
      // BETWEEN
      template(#plain-between-input)
        .d-flex.align-center
          ug-base-input(
            v-model='value[0]',
            label='Введите условие'
          )
          .ug-token-filter-edit__delimeter
            .ug-token-filter-edit__delimeter--inner
          ug-base-input(
            v-model='value[1]',
            label='Введите условие'
          )
      template(#date-between-input)
        div
          .d-flex.align-center
            div
              ug-datetime-picker-2(
                v-model='value[0]',
                :add='0',
                start-of-day,
                label='Введите условие',
                hide-details
              )
            .ug-token-filter-edit__delimeter
              .ug-token-filter-edit__delimeter--inner
            div
              ug-datetime-picker-2(
                v-model='value[1]',
                :add='0',
                label='Введите условие',
                hide-details,
                end-of-day
              )

      // AUTOCOMPLETE
      template(#autocomplete-endpoint-input)
        div autocomplete-endpoint-input
      template(#autocomplete-input)
        div autocomplete-input
      template(#autocomplete-endpoint-select)
        div autocomplete-endpoint-select
      template(#autocomplete-select)
        div autocomplete-select

      // PLAIN
      template(#plain-input)
        ug-base-input(
          v-model='value',
          label='Введите условие'
        )
      template(#date-input)
        div
          ug-datetime-picker-2(
            v-model='value',
            :add='0',
            start-of-day,
            label='Введите условие',
            hide-details
          )
      template(#plain-select)
        ug-tag-input(
          v-model='value',
          label='Введите условия'
        )

      // MISC
      template(#switcher)
        ug-base-switch(
          v-model='value',
          label='Введите условие'
        )
  v-card-actions.pa-0.py-2
    v-row(no-gutters)
      v-col(cols='6')
        ug-base-btn(
          @click='$emit("close", $event)',
          label='Отмена',
          depressed,
          color='table_darkgrey'
        )
      v-col.text-right(cols='6')
        ug-base-btn(
          label='Добавить',
          depressed,
          color='primary'
        )
</template>

<script>
import UgTokenFilterEditCompares from './token-filter-edit-compares/token-filter-edit-compares'
import { Portal, PortalTarget } from 'portal-vue'
import moment from 'moment'

export default {
  name: 'ug-token-filter-edit',

  components: {
    UgTokenFilterEditCompares,
    Portal,
    PortalTarget,
  },

  props: {
    token: {
      required: true,
      type: Object,
    },
  },

  data: function () {
    return {
      selected: this.token.compares[0],
      value: '',
    }
  },

  computed: {
    prettyValue() {
      if (this.token.type === 'boolean') {
        return this.value ? 'Истина' : 'Ложь'
      }

      if (this.token.type === 'date') {
        if (this.selected === 'between') {
          const dates = this.value.map((e) => moment(e).format('DD MMMM YYYY'))
          return dates.includes('Invalid date') ? ['', ''] : dates
        }

        const date = moment(this.value).format('DD MMMM YYYY')

        return date === 'Invalid date' ? '' : date
      }

      return this.value
    },
  },

  watch: {
    selected: {
      immediate: true,
      handler: function (value) {
        if (value === 'between') {
          if (this.token.type === 'number') {
            this.value = [0, 1]
            return
          }

          this.value = ['', '']
          return
        }

        if (this.token.type === 'array') {
          this.value = []
          return
        }

        if (this.token.type === 'number') {
          this.value = 0
          return
        }

        if (this.token.type === 'boolean') {
          this.value = false
          return
        }

        this.value = ''
      },
    },
  },
}
</script>

<style lang="sass">
.ug-token-filter-edit
  position: relative
  padding: 12px !important
  background: var(--v-table_lightgrey-base) !important
  .ug-token-filter-edit__delimeter
    margin: 0 16px
    height: 20px
    width: 1px
    .ug-token-filter-edit__delimeter--inner
      width: 1px
      height: inherit
      background: var(--v-table_darkergrey-base) !important
  .v-input--radio-group__input
    legend
      font-size: 1.35rem
      margin-bottom: 24px
      color: #232323
      padding-bottom: 0 !important
</style>
