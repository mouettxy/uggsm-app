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
      ug-token-filter-manager(filter='tests')
</template>

<script>
import { statusesSelect } from '@/api/helpers/enums'
import UgTokenFilter from '@/components/base/token-filter/token-filter'
import UgTokenFilterManager from '@/components/base/token-filter-manager/token-filter-manager'

export default {
  name: 'ug-page-filter-playground',

  components: {
    UgTokenFilter,
    UgTokenFilterManager,
  },

  data: function () {
    return {
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

  methods: {
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
