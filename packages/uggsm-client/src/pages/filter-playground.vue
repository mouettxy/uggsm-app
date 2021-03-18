<route>
{
  "name": "filterPlayground",
  "meta": {
    "header": "Песочница с фильтром"
  }
}
</route>

<template>
  <div class="ug-page-analytics pa-4">
    <ug-token-filter ref="filter" :tokens="tokens" type="tests"></ug-token-filter>
    <v-card class="mt-8">
      <v-card-text>
        <v-row v-if="savedFilters">
          <v-col cols="4">
            <v-list class="ug-token-filter-manage__list" dense>
              <template v-if="savedFilters.default.length">
                <v-list-group no-action prepend-icon="mdi-bookmark-multiple" :value="true">
                  <template #activator>
                    <v-list-item-title>Фильтры по умолчанию</v-list-item-title>
                  </template>
                  <v-list-item v-for="filter in savedFilters.default" link @click="selectFilter(filter.name)">
                    <v-list-item-icon v-if="defaultFilterName === filter.name">
                      <v-icon color="success">mdi-bookmark-check</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>{{ filter.name }}</v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                      <ug-base-btn
                        v-if="defaultFilterName !== filter.name"
                        icon="mdi-bookmark-check"
                        small
                        @click="setDefaultFilter(filter.name)"
                      ></ug-base-btn>
                    </v-list-item-action>
                  </v-list-item>
                </v-list-group>
              </template>
              <template v-else>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="error">mdi-bookmark-multiple</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title class="error--text">Фильтры по умолчанию</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
              <template v-if="savedFilters.custom.length">
                <v-list-group no-action prepend-icon="mdi-bookmark">
                  <template #activator>
                    <v-list-item-title>Фильтры пользователя</v-list-item-title>
                  </template>
                  <v-list-item
                    v-for="filter in savedFilters.custom"
                    :key="filter.name"
                    @click="selectFilter(filter.name)"
                  >
                    <v-list-item-icon v-if="defaultFilterName === filter.name">
                      <v-icon color="success">mdi-bookmark-check</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>{{ filter.name }}</v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action class="d-flex flex-row">
                      <ug-base-btn
                        v-if="defaultFilterName !== filter.name"
                        icon="mdi-bookmark-check"
                        small
                        @click="setDefaultFilter(filter.name)"
                      ></ug-base-btn>
                      <ug-base-btn icon="mdi-trash-can" small @click="removeCustomFilter(filter.name)"></ug-base-btn>
                    </v-list-item-action>
                  </v-list-item>
                </v-list-group>
              </template>
              <template v-else>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="error">mdi-bookmark</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title class="error--text">Фильтры пользователя</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-list>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-row align="center">
              <v-col cols="6">
                <ug-base-input v-model="resetLocalStorageModel"></ug-base-input>
              </v-col>
              <v-col cols="6">
                <ug-base-btn
                  block
                  color="error"
                  depressed
                  label="Сбросить сохраненные"
                  @click="resetLocalStorage"
                ></ug-base-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col cols="4">
            <v-row align="center">
              <v-col cols="12">
                <ug-base-btn
                  block
                  color="error"
                  depressed
                  label="Выключить фильтры"
                  @click="disableAllFilters"
                ></ug-base-btn>
              </v-col>
            </v-row>
            <v-row align="center">
              <v-col cols="12">
                <ug-base-btn
                  block
                  color="success"
                  depressed
                  label="Включить фильтры"
                  @click="enableAllFilters"
                ></ug-base-btn>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="4">
            <v-row align="center">
              <v-col cols="6">
                <ug-base-input v-model.trim="saveFilterModel"></ug-base-input>
              </v-col>
              <v-col cols="6">
                <ug-base-btn
                  block
                  color="primary"
                  depressed
                  label="Создать фильтр"
                  @click="createCustomFilter"
                ></ug-base-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { statusesSelect } from '@/api/helpers/enums'
import UgTokenFilter from '@/components/base/token-filter/token-filter.vue'
import UgBaseBtn from '@/components/base/ui/base-btn/base-btn'
import UgBaseInput from '@/components/base/ui/base-input/base-input'
import { mapActions, mapMutations, mapState } from 'vuex'

export default {
  name: 'ug-page-filter-playground',

  components: {
    UgTokenFilter,
    UgBaseBtn,
    UgBaseInput,
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
