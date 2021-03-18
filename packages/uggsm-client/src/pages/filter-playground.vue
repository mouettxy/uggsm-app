<route>
{
  "name": "filterPlayground",
  "meta": {
    "header": "Песочница с фильтром"
  }
}
</route>

<template lang="pug">
.page-analytics.pa-4
  ug-token-filter(
    ref='filter',
    :tokens='tokens',
    type='tests'
  )

  v-card.mt-8
    v-card-text
      v-row(v-if='savedFilters')
        v-col(cols='4')
          v-list.ug-token-filter-manage__list(dense)
            template(v-if='savedFilters.default.length')
              v-list-group(
                :value='true',
                prepend-icon='mdi-bookmark-multiple',
                no-action
              )
                template(#activator)
                  v-list-item-title Фильтры по умолчанию

                v-list-item(
                  v-for='filter in savedFilters.default',
                  @click='selectFilter("default", filter.name)',
                  link
                )
                  v-list-item-icon(v-if='defaultFilterName === filter.name')
                    v-icon(color='success') mdi-bookmark-check
                  v-list-item-content
                    v-list-item-title {{ filter.name }}
                  v-list-item-action
                    ug-base-btn(
                      v-if='defaultFilterName !== filter.name',
                      @click='setDefaultFilter(filter.name)',
                      small,
                      icon='mdi-bookmark-check'
                    )
            template(v-else)
              v-list-item
                v-list-item-icon
                  v-icon(color='error') mdi-bookmark-multiple
                v-list-item-content
                  v-list-item-title.error--text Фильтры по умолчанию

            template(v-if='savedFilters.custom.length')
              v-list-group(
                prepend-icon='mdi-bookmark',
                no-action
              )
                template(#activator)
                  v-list-item-title Фильтры пользователя

                v-list-item(
                  v-for='filter in savedFilters.custom',
                  :key='filter.name',
                  @click='selectFilter("custom", filter.name)'
                )
                  v-list-item-icon(v-if='defaultFilterName === filter.name')
                    v-icon(color='success') mdi-bookmark-check
                  v-list-item-content
                    v-list-item-title {{ filter.name }}
                  v-list-item-action.d-flex.flex-row
                    ug-base-btn(
                      v-if='defaultFilterName !== filter.name',
                      @click='setDefaultFilter(filter.name)',
                      small,
                      icon='mdi-bookmark-check'
                    )
                    ug-base-btn(
                      @click='removeCustomFilter(filter.name)',
                      small,
                      icon='mdi-trash-can'
                    )
            template(v-else)
              v-list-item
                v-list-item-icon
                  v-icon(color='error') mdi-bookmark
                v-list-item-content
                  v-list-item-title.error--text Фильтры пользователя

      v-row
        v-col(cols='4')
          v-row(align='center')
            v-col(cols='6')
              ug-base-input(v-model='resetLocalStorageModel')
            v-col(cols='6')
              ug-base-btn(
                @click='resetLocalStorage',
                label='Сбросить сохраненные',
                depressed,
                color='error',
                block
              )
      v-row(align='center')
        v-col(cols='4')
          v-row(align='center')
            v-col(cols='12')
              ug-base-btn(
                @click='disableAllFilters',
                label='Выключить фильтры',
                depressed,
                color='error',
                block
              )

          v-row(align='center')
            v-col(cols='12')
              ug-base-btn(
                @click='enableAllFilters',
                label='Включить фильтры',
                depressed,
                color='success',
                block
              )
        v-col(cols='4')
          v-row(align='center')
            v-col(cols='6')
              ug-base-input(v-model.trim='saveFilterModel')
            v-col(cols='6')
              ug-base-btn(
                @click='createCustomFilter',
                label='Создать фильтр',
                depressed,
                color='primary',
                block
              )
</template>

<script>
import { statusesSelect } from '@/api/helpers/enums'
import UgTokenFilter from '@/components/base/token-filter/token-filter.vue'
import { mapActions, mapMutations, mapState } from 'vuex'

export default {
  name: 'ug-page-filter-playground',

  components: {
    UgTokenFilter,
  },

  data: function () {
    return {
      resetLocalStorageModel: 'filters',
      setFilterModel: '',
      saveFilterModel: '',
      tokens: [
        {
          value: 'id',
          name: 'ID Заказа',
          type: 'number',
          compares: ['is', 'between', 'greater than', 'not greater than'],
          disabled: false,
        },
        {
          value: 'date',
          name: 'Дата заказа',
          type: 'date',
          compares: ['between', 'greater than', 'not greater than'],
          disabled: false,
        },
        {
          value: 'status',
          name: 'Статус заказа',
          type: 'array',
          autocomplete: statusesSelect,
          compares: ['contains', 'not contains'],
          unique: true,
          disabled: false,
        },
        {
          value: 'master',
          name: 'Никнейм мастера',
          type: 'array',
          autocomplete: '/master',
          compares: ['contains', 'not contains'],
          disabled: false,
        },
        {
          value: 'guaranty',
          name: 'На гарантии',
          type: 'boolean',
          compares: ['is', 'not is'],
          disabled: false,
        },
      ],
    }
  },

  computed: {
    ...mapState({
      vuexSavedFilters: (state) => state.filters.filterList,
      vuexDefaultFilterEntry: (state) => state.filters.defaultFilterEntry,
    }),

    savedFilters() {
      return this.vuexSavedFilters.tests
    },

    defaultFilter() {
      return this.vuexDefaultFilterEntry.tests
    },

    defaultFilterName() {
      if (this.defaultFilter) {
        return this.defaultFilter
      }

      const unitedFilters = [...this.savedFilters.default, ...this.savedFilters.custom]

      if (unitedFilters.length) {
        return unitedFilters[0].name
      }

      return ''
    },
  },

  methods: {
    ...mapActions({
      vuexSetFromSaved: 'filters/setFromSaved',
      vuexAddCustom: 'filters/addCustom',
      vuexRemoveCustom: 'filters/removeCustom',
      vuexGetDefaultFilterName: 'filters/getDefaultFilterName',
    }),

    ...mapMutations({
      vuexSetDefaultFilter: 'filters/SET_DEFAULT_FILTER_ENTRY',
    }),

    setDefaultFilter(filterName) {
      this.vuexSetDefaultFilter({
        name: 'tests',
        filterName,
      })
    },

    removeCustomFilter(filterName) {
      this.vuexRemoveCustom({
        name: 'tests',
        filterName,
      })
    },

    createCustomFilter() {
      this.vuexAddCustom({
        name: 'tests',
        filterName: this.saveFilterModel,
      })
    },

    selectFilter(type, name) {
      this.vuexSetFromSaved({
        name: 'tests',
        type,
        filterName: name,
      })
    },

    resetLocalStorage() {
      localStorage.removeItem(this.resetLocalStorageModel)
    },

    disableAllFilters() {
      const { filter } = this.$refs

      filter.disableAll()
    },

    enableAllFilters() {
      const { filter } = this.$refs

      filter.enableAll()
    },
  },
}
</script>

<style lang="sass">
.ug-token-filter-manage__list
  .v-list-item__action
    margin: 0
</style>
