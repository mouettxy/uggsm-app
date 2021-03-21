<template lang="pug">
.ug-table-remote-menu-filter
  ug-responsive-menu(:menu-props='{ "offset-y": true, "max-height": 300, "max-width": 300 }')
    template(#activator='{on, attrs}')
      ug-table-remote-btn(
        v-on='on',
        v-bind='attrs',
        :label='isMobile ? "Мои" : "Мои фильтры"',
        :block='isMobile',
        icon='mdi-filter-plus'
      )
    v-card
      template(v-if='!savedFilters.default.length && !savedFilters.custom.length')
        .pa-4
          span.warning--text Для этой таблицы нет фильтров по умолчанию и вы не сохранили не одного фильтра
      template(v-if='savedFilters.default.length')
        v-list(dense)
          v-subheader Фильтры по умолчанию
          v-list-item(
            v-for='filter in savedFilters.default',
            :key='filter.name',
            @click='selectFilter("default", filter.name)'
          )
            v-list-item-content
              v-list-item-title {{ filter.name }}
      template(v-if='savedFilters.custom.length')
        v-list(dense)
          v-subheader Пользовательские фильтры
          v-list-item(
            v-for='filter in savedFilters.custom',
            :key='filter.name',
            @click='selectFilter("custom", filter.name)'
          )
            v-list-item-content
              v-list-item-title {{ filter.name }}
</template>

<script>
import UgTableRemoteBtn from '@/components/base/table/table-remote/table-remote-btn/table-remote-btn'
import UgResponsiveMenu from '@/components/base/ui/responsive-menu/responsive-menu'
import Responsive from '@/mixins/responsive'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'ug-token-filter-saved-menu',

  components: {
    UgResponsiveMenu,
    UgTableRemoteBtn,
  },

  mixins: [Responsive],

  props: {
    filterName: {
      required: true,
      type: String,
    },
  },

  computed: {
    ...mapState({
      vuexSavedFilters: (state) => state.filters.filterList,
    }),

    savedFilters() {
      return this.vuexSavedFilters[this.filterName]
    },
  },

  methods: {
    ...mapActions({
      vuexSetFromSaved: 'filters/setFromSaved',
    }),

    selectFilter(type, name) {
      this.vuexSetFromSaved({
        name: this.filterName,
        type,
        filterName: name,
      })
    },
  },
}
</script>
