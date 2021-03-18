<template lang="pug">
.ug-token-filter-edit-compares
  template(v-for='compare in compares')
    .ug-token-filter-edit-compare
      template(v-if='isString')
        template(v-for='compareType in ["is", "not is", "contains", "not contains"]')
          template(v-if='compare === compareType')
            v-radio(
              :value='compare',
              :label='getRadioLabel(compare)'
            )

            .ug-token-filter-edit-compare__field
              v-expand-transition
                slot(
                  v-if='selectedType === compareType && isAutocompleteEndpoint',
                  name='autocomplete-endpoint-input'
                )
                slot(
                  v-else-if='selectedType === compareType && isAutocomplete',
                  name='autocomplete-input'
                )
                slot(
                  v-else-if='selectedType === compareType && !isAutocomplete',
                  name='plain-input'
                )

      template(v-else-if='isNumber')
        template(v-for='compareType in ["is", "not is", "between", "greater than", "not greater than"]')
          template(v-if='compare === compareType')
            v-radio(
              :value='compare',
              :label='getRadioLabel(compare)'
            )

            .ug-token-filter-edit-compare__field
              v-expand-transition
                slot(
                  v-if='selectedType === compareType && compare === "between"',
                  name='plain-between-input'
                )
                slot(
                  v-else-if='selectedType === compareType && isAutocompleteEndpoint',
                  name='autocomplete-endpoint-input'
                )
                slot(
                  v-else-if='selectedType === compareType && isAutocomplete',
                  name='autocomplete-input'
                )
                slot(
                  v-else-if='selectedType === compareType && !isAutocomplete',
                  name='plain-input'
                )

      template(v-else-if='isBoolean')
        template(v-for='compareType in ["is", "not is"]')
          template(v-if='compare === compareType')
            v-radio(
              :value='compare',
              :label='getRadioLabel(compare)'
            )

            .ug-token-filter-edit-compare__field
              v-expand-transition
                slot(
                  v-if='selectedType === compareType',
                  name='switcher'
                )

      template(v-else-if='isDate')
        template(v-for='compareType in ["between", "greater than", "not greater than"]')
          template(v-if='compare === compareType')
            v-radio(
              :value='compare',
              :label='getRadioLabel(compare)'
            )

            .ug-token-filter-edit-compare__field
              // ! WTF
              transition(
                name='slide-y-transition',
                :duration='{ enter: 500, leave: 800 }',
                mode='in-out',
                appear
              )
                slot(
                  v-if='selectedType === compareType && compare === "between"',
                  name='date-between-input'
                )
                slot(
                  v-else-if='selectedType === compareType',
                  name='date-input'
                )

      template(v-else-if='isArray')
        template(v-for='compareType in ["contains", "not contains"]')
          template(v-if='compare === compareType')
            v-radio(
              :value='compare',
              :label='getRadioLabel(compare)'
            )

            .ug-token-filter-edit-compare__field
              v-expand-transition
                slot(
                  v-if='selectedType === compareType && isAutocompleteEndpoint',
                  name='autocomplete-endpoint-select'
                )
                slot(
                  v-else-if='selectedType === compareType && isAutocomplete',
                  name='autocomplete-select'
                )
                slot(
                  v-else-if='selectedType === compareType && !isAutocomplete',
                  name='plain-select'
                )
</template>

<script>
import { comparesTranslateSolo } from '@/helpers/filterHelper'

export default {
  name: 'ug-token-filter-edit-compares',

  props: {
    token: {
      required: true,
      type: Object,
    },

    selected: {
      required: true,
      type: String,
    },

    value: {
      required: false,
      type: [String, Number, Array, Boolean],
      default: '',
    },
  },

  computed: {
    selectedType: {
      get: function () {
        return this.selected
      },

      set: function (value) {
        this.$emit('update:selected', value)
      },
    },

    compares() {
      return this.token.compares
    },

    isAutocomplete() {
      return !!this.token.autocomplete && typeof this.token.autocomplete !== 'string'
    },

    isAutocompleteEndpoint() {
      return !!this.token.autocomplete && typeof this.token.autocomplete === 'string'
    },

    isString() {
      return this.token.type === 'string'
    },

    isNumber() {
      return this.token.type === 'number'
    },

    isBoolean() {
      return this.token.type === 'boolean'
    },

    isDate() {
      return this.token.type === 'date'
    },

    isArray() {
      return this.token.type === 'array'
    },
  },

  methods: {
    getRadioLabel(compare) {
      return comparesTranslateSolo(compare)
    },
  },
}
</script>

<style lang="sass">
.ug-token-filter-edit-compares
  .ug-token-filter-edit-compare
    .ug-token-filter-edit-compare__field
      padding: 12px 0 12px 32px

      .ug-base-switch
        margin-top: 0

      fieldset
        background: var(--v-light-base)
        border-color: var(--v-table_darkergrey-base)

    .v-radio
      color: var(--v-table_darkergrey-base) !important
      margin-bottom: 0 !important
</style>
