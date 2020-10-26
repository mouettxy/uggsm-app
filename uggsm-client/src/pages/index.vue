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
      template(v-for='item in news')
        .text--disabled.d-inline.ml-4(style='font-size: 1.1rem') {{ item.date }}
        v-list
          template(v-for='child in item.items')
            template(v-if='child.link')
              v-list-item(:to='child.link')
                v-list-item-content(
                  :class='{ "success--text": child.type === "feature", "info--text": child.type === "fix", "grey--text": child.type === "chore" }'
                )
                  v-list-item-title {{ child.text }}
            template(v-else)
              v-list-item
                v-list-item-content(
                  :class='{ "success--text": child.type === "feature", "info--text": child.type === "fix", "grey--text": child.type === "chore" }'
                )
                  v-list-item-title {{ child.text }}
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import moment from 'moment'

@Component
export default class PageIndex extends Vue {
  public date = moment('26.10.2020', 'DD.MM.YYYY').format('DD MMMM YYYY')

  public news = [
    {
      date: moment('26.10.2020', 'DD.MM.YYYY').format('DD MMMM YYYY'),
      items: [
        { type: 'feature', text: 'Добавлен расчёт стоимости работ и имя клиента в таблицу заявок' },
        { type: 'feature', text: 'Возможность выбора исполнителя при закрытии работы' },
        { type: 'feature', text: 'Сохранение скрытых колонок в таблице заявок' },
      ],
    },
    {
      date: moment('23.10.2020', 'DD.MM.YYYY').format('DD MMMM YYYY'),
      items: [
        { type: 'feature', text: 'Отчёт по заявкам', link: { name: 'reportsOrders' } },
        { type: 'feature', text: 'Возможность удаления работы' },
        { type: 'feature', text: 'По умолчанию отображаются НЕ закрытые заявки' },
        { type: 'feature', text: 'Возможность открытия заявки из кассы', link: { name: 'cash' } },
        { type: 'fix', text: 'Корректная дата в таблице заявок и ленте действий' },
        { type: 'chore', text: 'Правки печати' },
      ],
    },
  ]
}
</script>
