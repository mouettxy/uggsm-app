<template lang="pug">
ug-responsive-menu(:menu-props='menuProps')
  template(#activator='{on, attrs}')
    slot(
      name='activator',
      :on='on',
      :attrs='attrs'
    )
      v-list-item(
        v-on='on',
        v-bind='attrs'
      )
        v-list-item-content
          v-list-item-title {{ token.name }}
  template(#default='{ close }')
    v-card.ug-token-filter-edit(elevation='6')
      v-radio-group.mt-0(
        v-model='selected',
        :label='existing ? `Редактирование фильтра ${token.name}` : `Настройка фильтра ${token.name}`',
        mandatory,
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
            ug-base-autocomplete(
              v-model='value',
              :predefined-items='predefinedValue',
              :endpoint='token.autocomplete',
              return-object,
              query-search='q',
              label='Выберите условие'
            )
          template(#autocomplete-input)
            ug-base-select(
              v-model='value',
              :items='token.autocomplete',
              return-object,
              label='Выберите условие'
            )
          template(#autocomplete-endpoint-select)
            ug-tag-autocomplete(
              v-model='value',
              :path='token.autocomplete',
              return-object,
              query-search='q',
              label='Выберите условие',
              fetch-on-mount
            )
          template(#autocomplete-select)
            ug-select-many(
              v-model='value',
              :items='token.autocomplete',
              return-object,
              label='Выберите условие'
            )

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
              @click='close()',
              label='Отмена',
              depressed,
              color='#ddd'
            )
          v-col.text-right(cols='6')
            ug-base-btn(
              :label='existing ? "Обновить" : "Добавить"',
              @click='handleAddFilter(close)',
              depressed,
              color='primary'
            )
</template>

<script>
import UgTokenFilterEditCompares from './token-filter-edit-compares/token-filter-edit-compares'
import { getDefaultTokenValue, prettifyTokenValue } from '@/helpers/filterHelper'

export default {
  name: 'ug-token-filter-edit',

  components: {
    UgTokenFilterEditCompares,
  },

  props: {
    token: {
      required: true,
      type: Object,
    },

    tokenIndex: {
      required: true,
      type: Number,
    },

    existing: {
      required: false,
      type: Boolean,
    },

    filterCompare: {
      required: false,
      type: String,
      default: '',
    },

    filterValue: {
      required: false,
      type: [String, Number, Array, Object, Boolean, Date],
      default: '',
    },
  },

  data: function () {
    return {
      selected: this.token.compares[0],
      value: '',
    }
  },

  computed: {
    predefinedValue() {
      if (!this.existing) {
        return []
      }

      return this.filterValue ? [this.filterValue] : []
    },

    menuProps() {
      if (this.existing) {
        return { 'close-on-content-click': false, 'offset-y': true, 'min-width': 425, 'max-width': 425 }
      }

      return { 'close-on-content-click': false, 'offset-x': true, 'min-width': 425, 'max-width': 425 }
    },

    prettyValue() {
      return prettifyTokenValue(this.token, this.value, this.selected)
    },
  },

  watch: {
    selected: {
      immediate: true,
      handler: function () {
        this.resetValue()
      },
    },
  },

  mounted: function () {
    if (this.existing) {
      this.selected = this.filterCompare
      this.value = this.filterValue
    }
  },

  methods: {
    resetValue() {
      const newValue = getDefaultTokenValue(this.token.type, this.selected)

      if (this.filterCompare === this.selected) {
        this.value = this.filterValue || newValue
        return
      }

      this.value = newValue
    },

    handleAddFilter(closeFn) {
      if (this.existing) {
        this.$emit(
          'update-filter',
          {
            token: this.token,
            value: this.value,
            compares: this.selected,
            disabled: false,
            display: false,
          },
          this.tokenIndex
        )

        closeFn()

        this.resetValue()

        return
      }

      this.$emit('add-filter', {
        token: this.token,
        value: this.value,
        compares: this.selected,
        disabled: false,
        display: false,
      })

      closeFn()

      this.resetValue()
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
