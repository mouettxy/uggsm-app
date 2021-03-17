<route>
{
  "name": "analytic",
  "meta": {
    "header": "Аналитика",
    "resource": "Analytics"
  }
}
</route>

<template lang="pug">
.page-analytics.pa-4
  ug-token-filter(
    ref='filter',
    :tokens='tokens',
    :default-filters='defaultFilters',
    @update='handleFiltersUpdate',
    saved-filter='test',
    cache='test-cache'
  )

  v-card.mt-8
    v-card-text
      v-row
        v-col(cols='auto')
          ug-base-btn(
            @click='disableAllFilters',
            label='Выключить фильтры',
            color='error'
          )
        v-col(cols='auto')
          ug-base-btn(
            @click='enableAllFilters',
            label='Включить фильтры',
            color='success'
          )
      v-row
        v-col(cols='2')
          ug-base-input(v-model='savedFilter')
        v-col(cols='2')
          ug-base-btn(
            @click='setSavedFilter',
            label='Установить фильтр',
            color='primary'
          )
      v-row
        v-col(cols='2')
          ug-base-input(v-model='saveFilterAs')
        v-col(cols='2')
          ug-base-btn(
            @click='saveFilter',
            label='Создать фильтр',
            color='primary'
          )
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { statusesSelect } from '@/api/helpers/enums'

import UgTokenFilter from '@/components/base/token-filter/token-filter.vue'
import { authModule } from '@/store'
import { Filter, Token } from '@/typings/TokenFilter'

@Component({
  components: {
    UgTokenFilter,
  },
})
export default class PageAnalytics extends Vue {
  public savedFilter = ''

  public saveFilterAs = ''

  public defaultFilters: any = []

  public tokens: Token[] = [
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
  ]

  public activeFilters: Filter[] = []

  get filters() {
    return JSON.stringify(this.activeFilters, null, 4)
  }

  mounted() {
    this.buildDefaultFilter()
  }

  buildDefaultFilter() {
    this.defaultFilters = [
      {
        name: 'Текущий пользователь',
        filter: [
          {
            token: {
              value: 'master',
              name: 'Никнейм мастера',
              type: 'array',
              autocomplete: '/master',
              compares: ['contains', 'not contains'],
              disabled: false,
            },
            value: [
              {
                text: authModule.user?.credentials,
                value: authModule.user?._id,
              },
            ] as any,
            compares: 'contains',
            disabled: false,
            display: false,
          },
        ],
      },
    ]
  }

  saveFilter() {
    //@ts-ignore
    const { filter } = this.$refs

    //@ts-ignore
    console.log(filter.createSavedFilter(this.saveFilterAs))
  }

  setSavedFilter() {
    //@ts-ignore
    const { filter } = this.$refs

    //@ts-ignore
    filter.setSavedFilter(this.savedFilter)
  }

  disableAllFilters() {
    //@ts-ignore
    const { filter } = this.$refs

    //@ts-ignore
    filter.disableAll()
  }

  enableAllFilters() {
    //@ts-ignore
    const { filter } = this.$refs

    //@ts-ignore
    filter.enableAll()
  }

  handleFiltersUpdate(filters: Filter[]) {
    this.activeFilters = filters
  }
}
</script>
