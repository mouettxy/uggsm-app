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
        .text--disabled.d-inline.ml-4(style='font-size: 1rem') {{ item.date }}
        template(v-if='item.breaking')
          v-chip.ml-2(
            :color='item.breakingPass ? "lightgrey" : "red"',
            small,
            label
          ) Важные изменения. Требуется перезагрузить страницу несколько раз.
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
                  template(v-if='child.beta')
                    v-list-item-title
                      v-chip.mr-2(
                        small,
                        label,
                        color='warning'
                      ) BETA
                      span {{ child.text }}
                  template(v-else)
                    v-list-item-title {{ child.text }}
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import moment from 'moment'

@Component
export default class PageIndex extends Vue {
  public date = moment('07.02.2021', 'DD.MM.YYYY').format('DD MMMM YYYY')

  public news = [
    {
      date: moment('07.02.2021', 'DD.MM.YYYY').format('DD MMMM YYYY'),
      breaking: false,
      items: [
        {
          type: 'feature',
          text: 'Добавление системы прав доступа на основе ролей',
          beta: true,
        },
      ],
    },
    {
      date: moment('05.02.2021', 'DD.MM.YYYY').format('DD MMMM YYYY'),
      breaking: false,
      items: [
        {
          type: 'feature',
          text: 'Изменения в авторизации и безопасности.',
        },
        {
          type: 'feat',
          text: 'Автоматический выход из аккаунта через сутки.',
        },
      ],
    },
    {
      date: moment('20.11.2020', 'DD.MM.YYYY').format('DD MMMM YYYY'),
      breaking: true,
      breakingPass: true,
      items: [
        {
          type: 'feature',
          text: 'В таблице заявок теперь видно мастера который указан в заявке.',
        },
        {
          type: 'feature',
          text: 'Возможность сортировки по мастеру/мастерам с сохранением при перезагрузке.',
        },
      ],
    },
    {
      date: moment('01.11.2020', 'DD.MM.YYYY').format('DD MMMM YYYY'),
      items: [
        {
          type: 'feature',
          text: 'Ежедневный отчёт.',
          link: '/reports/orders-daily',
        },
        {
          type: 'feature',
          text: 'Управление подпиской на ежедневный отчёт.',
          link: '/settings/manage-daily-subscriptions',
        },
        {
          type: 'feature',
          text: 'Отчёт по количеству заявок.',
          link: '/reports/orders-count',
        },
        {
          type: 'feature',
          text: 'Отчёт по закрытым заявкам без работы или кассы.',
          link: '/reports/orders-closed-incorrect',
        },
      ],
    },
    {
      date: moment('31.10.2020', 'DD.MM.YYYY').format('DD MMMM YYYY'),
      items: [
        {
          type: 'feature',
          text: 'Оплата в кассу больше не требует указания клиента',
        },
        {
          type: 'fix',
          text: 'Убрана неисправность когда заявка сохранялась с ошибкой и без ID.',
        },
      ],
    },
    {
      date: moment('29.10.2020', 'DD.MM.YYYY').format('DD MMMM YYYY'),
      items: [
        {
          type: 'feature',
          text: 'Печать гарантийного талона и акта приема для iMarket.',
        },
        {
          type: 'feature',
          text: 'Убрано ограничение в количестве подсказок для ввода у полей мастер и менеджер в заявке.',
        },
      ],
    },
    {
      date: moment('28.10.2020', 'DD.MM.YYYY').format('DD MMMM YYYY'),
      items: [
        {
          type: 'feature',
          text:
            'Предзаполнение некоторых полей в новой заявке. Добавлено отображение пароля в окне редактирования заявки.',
        },
      ],
    },
    {
      date: moment('27.10.2020', 'DD.MM.YYYY').format('DD MMMM YYYY'),
      items: [{ type: 'chore', text: 'Исправление Принял(а) на Выдал(а) и т.д относящиеся к печати' }],
    },
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
