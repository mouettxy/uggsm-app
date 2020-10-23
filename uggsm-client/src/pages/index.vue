<route>
{
  "name": "index",
  "meta": {
    "header": "Рабочий стол"
  }
}
</route>

<template lang="pug">
.page-index.pa-4
  v-card
    v-card-title
      span Что нового?
      small.text--disabled.d-inline.ml-8 Последнее обновление: {{ date }}
    v-card-text
      v-list
        v-list-item(:to='{ name: "reportsOrders" }')
          v-list-item-content.success--text
            v-list-item-title Отчёт по заявкам
        v-list-item
          v-list-item-content
            v-list-item-title.success--text Возможность удаления работы
        v-list-item
          v-list-item-content
            v-list-item-title.success--text По умолчанию отображаются НЕ закрытые заявки
        v-list-item(:to='{ name: "cash" }')
          v-list-item-content
            v-list-item-title.success--text Возможность открытия заявки из кассы
        v-list-item
          v-list-item-content
            v-list-item-title.info--text Корректная дата в таблице заявок и ленте действий
        v-list-item
          v-list-item-content
            v-list-item-title.grey--text Правки печати
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import moment from 'moment'

@Component
export default class PageIndex extends Vue {
  public date = moment('23.10.2020', 'DD.MM.YYYY').format('DD MMMM YYYY')
}
</script>
