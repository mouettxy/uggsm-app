<template lang="pug">
.ug-token-filter-manager
  v-row(align='center')
    v-col(
      cols='12',
      md='8',
      lg='9'
    )
      ug-base-input(
        v-model.trim='saveFilterModel',
        :single-line='false',
        label='Сохраните текущий фильтр'
      )
    v-col(
      cols='12',
      md='4',
      lg='3'
    )
      ug-base-btn(
        @click='createCustomFilter',
        label='Сохранить фильтр',
        icon-left='mdi-filter-plus',
        depressed,
        color='primary',
        block
      )
  v-row
    v-col(cols='12')
      v-list.ug-token-filter-manager__list(dense)
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
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'

export default {
  name: 'ug-token-filter-manager',

  props: {
    filter: {
      required: true,
      type: String,
    },
  },

  data: () => ({
    saveFilterModel: '',
  }),

  computed: {
    ...mapState({
      vuexSavedFilters: (state) => state.filters.filterList,
      vuexDefaultFilterEntry: (state) => state.filters.defaultFilterEntry,
    }),

    savedFilters() {
      return this.vuexSavedFilters[this.filter]
    },

    defaultFilter() {
      return this.vuexDefaultFilterEntry[this.filter]
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
      vuexRemoveCustom: 'filters/removeCustom',
      vuexAddCustom: 'filters/addCustom',

      vuexGetDefaultFilterName: 'filters/getDefaultFilterName',
    }),

    ...mapMutations({
      vuexSetDefaultFilter: 'filters/SET_DEFAULT_FILTER_ENTRY',
    }),

    createCustomFilter() {
      this.vuexAddCustom({
        name: this.filter,
        filterName: this.saveFilterModel,
      })
    },

    setDefaultFilter(filterName) {
      this.vuexSetDefaultFilter({
        name: this.filter,
        filterName,
      })
    },

    removeCustomFilter(filterName) {
      this.vuexRemoveCustom({
        name: this.filter,
        filterName,
      })
    },

    selectFilter(type, name) {
      this.vuexSetFromSaved({
        name: this.filter,
        type,
        filterName: name,
      })
    },
  },
}
</script>

<style lang="sass">
.ug-token-filter-manager__list
  .v-list-item__action
    margin: 0
</style>
