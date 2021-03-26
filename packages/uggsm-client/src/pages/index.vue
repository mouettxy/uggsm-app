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
          ) Важные изменения.
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
  public news = [
    {
      date: moment('26.03.2021', 'DD.MM.YYYY').format('DD MMMM YYYY'),
      items: [
        {
          type: 'feature',
          text: 'Добавлено уведомление о обновлении приложения.',
        },
      ],
    },
    {
      date: moment('23.03.2021', 'DD.MM.YYYY').format('DD MMMM YYYY'),
      items: [
        {
          type: 'feature',
          text: 'Более удобное меню на мобильных устройствах.',
        },
        {
          type: 'feature',
          text: 'Добавлена печать чека для офиса в Волгограде',
        },
      ],
    },
    {
      date: moment('21.03.2021', 'DD.MM.YYYY').format('DD MMMM YYYY'),
      breaking: true,
      items: [
        {
          type: 'feature',
          beta: true,
          text: 'Добавлены кнопки создания заявки и создания заявки по умолчанию в новую таблицу заявок.',
          link: { name: 'ordersNext' },
        },
        {
          type: 'feature',
          beta: true,
          text:
            'Добавлен новый вид таблицы клиентов. Опробовать можно кликнув на это сообщение или из меню приложения.',
          link: { name: 'clientsNext' },
        },
        {
          type: 'feature',
          beta: true,
          text: 'Добавлен новый вид таблицы кассы. Опробовать можно кликнув на это сообщение или из меню приложения.',
          link: { name: 'cashNext' },
        },
        {
          type: 'feature',
          beta: true,
          text: 'Добавлен новый вид таблицы звонков. Опробовать можно кликнув на это сообщение или из меню приложения.',
          link: { name: 'callsNext' },
        },
        {
          type: 'fix',
          text: 'Исправлено некорректное отображение таблицы пользователей в связи с недавними обновлениями.',
        },
      ],
    },
    {
      date: moment('20.03.2021', 'DD.MM.YYYY').format('DD MMMM YYYY'),
      items: [
        {
          type: 'feature',
          beta: true,
          text:
            'Добавлено улучшенное отображение для таблицы заявок с гибкой системой фильтров и оптимизацией под мобильные устройства. Опробовать можно кликнув на это сообщение, или из меню внутри страницы заявок нажав на ссылку [Beta] Заказы.',
          link: { name: 'ordersNext' },
        },
      ],
    },
    {
      date: moment('14.03.2021', 'DD.MM.YYYY').format('DD MMMM YYYY'),
      breaking: false,
      items: [
        {
          type: 'feature',
          text:
            'Убрана кнопка "Закрытые" которая позволяла показать только закрытые или все кроме закрытых заказы. Теперь кнопка выключена (отображаются все заказы) по умолчанию. При необходимости скрыть закрытые заказы необходимо сделать это через фильтр.',
        },
        {
          type: 'feature',
          text: 'Добавлена функциональность сброса всех фильтров',
        },
      ],
    },
    {
      date: moment('10.03.2021', 'DD.MM.YYYY').format('DD MMMM YYYY'),
      items: [
        {
          type: 'feature',
          text: 'Улучшен вид и отображение на мобильных устройствах окна редактирования клиентов',
        },
        {
          type: 'fix',
          text: 'Исправлена ошибка когда итоговая сумма кассы отображалась неверно',
        },
      ],
    },
    {
      date: moment('09.03.2021', 'DD.MM.YYYY').format('DD MMMM YYYY'),
      items: [
        {
          type: 'feature',
          text: 'Улучшен вид и отображение на мобильных устройствах всех отчётов',
        },
        {
          type: 'feature',
          text: 'Добавлено автоматическое обновление страницы ежедневных отчётов',
        },
      ],
    },
    {
      date: moment('08.03.2021', 'DD.MM.YYYY').format('DD MMMM YYYY'),
      items: [
        {
          type: 'feature',
          text: 'Улучшен вид и отображение на мобильных устройствах страницы управления подпиской на ежедневные отчёты',
        },
        {
          type: 'feature',
          text: 'Улучшен вид и отображение на мобильных устройствах страницы авторизации',
        },
        {
          type: 'feature',
          text: 'Улучшен вид и отображение на мобильных устройствах страницы создания офиса',
        },
        {
          type: 'feature',
          text: 'Улучшен вид и отображение на мобильных устройствах страницы создания пользователя',
        },
      ],
    },
    {
      date: moment('07.03.2021', 'DD.MM.YYYY').format('DD MMMM YYYY'),
      items: [
        {
          type: 'feature',
          text: 'Улучшен вид меню, добавлено корректное отображение на мобильных устройствах',
        },
        {
          type: 'feature',
          text:
            'Улучшен вид выбора офиса в таблицах, исправлены ситуации когда офис по умолчанию не мог быть выбран автоматически',
        },
        {
          type: 'feature',
          text: 'Улучшена система смены статуса',
        },
      ],
    },
    {
      date: moment('01.03.2021', 'DD.MM.YYYY').format('DD MMMM YYYY'),
      items: [
        {
          type: 'feature',
          text: 'Улучшен вид форм прихода/расхода, добавлено корректное отображение на мобильных устройствах',
        },
        {
          type: 'feature',
          text:
            'При прослушивании звонков, при открытии плеера добавлено авто-воспроизведение аудио, а при закрытии автоматическая пауза',
        },
        {
          type: 'fix',
          text:
            'Исправлена ошибка в результате которой могло быть ложное срабатывание системы сброса авторизации при неудачной попытке нахождения офиса',
        },
        {
          type: 'fix',
          text:
            'Исправлена ошибка которая не позволяла создавать заявки из-за неккоректного поведения поля ввода номера телефона клиента',
        },
      ],
    },
    {
      date: moment('26.02.2021', 'DD.MM.YYYY').format('DD MMMM YYYY'),
      items: [
        {
          type: 'fix',
          text: 'Исправлена ошибка которая не позволяла создавать новые офисы',
        },
      ],
    },
    {
      date: moment('23.02.2021', 'DD.MM.YYYY').format('DD MMMM YYYY'),
      items: [
        {
          type: 'feature',
          beta: true,
          text: 'Добавлена таблица для управления пользователями',
        },
        {
          type: 'fix',
          text: 'Исправлена ошибка когда СМС-уведомление не отправлялось при смене статуса гарантийной заявки',
        },
      ],
    },
    {
      date: moment('21.02.2021', 'DD.MM.YYYY').format('DD MMMM YYYY'),
      breaking: true,
      items: [
        {
          type: 'feature',
          text: 'Улучшение системы ролей',
        },
        {
          type: 'feature',
          text: 'Добавлен фильтр по дате (промежутку дат) заявки',
        },
        {
          type: 'fix',
          text: 'Исправлено сьезжание интерфейса при статусе оплаты заявки "Оплачено"',
        },
        {
          type: 'fix',
          text: 'Исправлено несоответствие меню страницам отчётов',
        },
      ],
    },
    {
      date: moment('11.02.2021', 'DD.MM.YYYY').format('DD MMMM YYYY'),
      breaking: false,
      items: [
        {
          type: 'feature',
          text: 'Добавлены предупреждения при перезагрузках/неисправностях у сервера',
        },
        {
          type: 'fix',
          text: 'Исправлено поведение гарантийных заявок. Теперь при создании в них не включаются старые работы',
        },
        {
          type: 'fix',
          text: 'Исправлено поведение дат в отчёте по закрытым заявкам',
        },
      ],
    },
    {
      date: moment('08.02.2021', 'DD.MM.YYYY').format('DD MMMM YYYY'),
      breaking: false,
      items: [
        {
          type: 'feature',
          text: 'Добавлена связь ролей и формы регистрации',
        },
        {
          type: 'feature',
          text: 'Обновлён вид форм настройки',
        },
        {
          type: 'feature',
          text: 'Временно убран пункт меню "Аналитика"',
        },
        {
          type: 'feature',
          text: 'Обновлён вид таблицы клиентов',
        },
        {
          type: 'feature',
          text: 'Добавлено уведомление о перезагрузке сервера',
        },
      ],
    },
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

  public date = this.news[0].date
}
</script>
