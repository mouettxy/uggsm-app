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
    :tokens='tokens',
    :predefined-filters='predefinedFilters',
    @update='handleFiltersUpdate',
    cache='test-cache'
  )

  v-card.mt-8
    v-card-text
      pre {{ filters }}
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import UgTokenFilter from '@/components/base/token-filter/token-filter.vue'
import { Token, Filter } from '@/components/base/token-filter/token-filter.helpers'

@Component({
  components: {
    UgTokenFilter,
  },
})
export default class PageAnalytics extends Vue {
  public predefinedFilters: Filter[] = [
    {
      token: {
        value: 'id',
        name: 'ID Заказа',
        type: 'number',
        compares: ['is', 'between', 'greater than', 'not greater than'],
        disabled: false,
      },
      compares: 'is',
      type: 'number',
      value: 10002,
      disabled: false,
      display: true,
    },
  ]

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
      compares: ['contains', 'not contains'],
      unique: true,
      disabled: false,
    },
    {
      value: 'master',
      name: 'Никнейм мастера',
      type: 'string',
      compares: ['is', 'not is'],
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

  handleFiltersUpdate(filters: Filter[]) {
    this.activeFilters = filters
  }
}
</script>
