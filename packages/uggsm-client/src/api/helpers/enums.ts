export const statuses = [
  'Отремонтирован',
  'Новый',
  'В работе',
  'На тестировании',
  'Пересогласовать',
  'Позвонить повторно',
  'Ждёт запчасть',
  'Нужно решить',
  'Готов',
  'Готов, без ремонта',
  'На продаже',
  'Закрыт',
  'Выкуплен СЦ',
  'Обещали найти',
  'Закрыт с вопросом',
]

export const groupedStatuses = [
  {
    text: 'Новые',
    statuses: [
      {
        color: '#1858a1',
        status: 'Отремонтирован',
      },
      {
        color: '#1858a1',
        status: 'Новый',
      },
    ],
  },
  {
    text: 'Инвентаризация',
    statuses: [
      {
        color: '#ff6961',
        status: 'Пересогласовать',
      },
    ],
  },
  {
    text: 'На исполнении',
    statuses: [
      {
        color: '#689f38',
        status: 'В работе',
      },
      {
        color: '#689f38',
        status: 'На тестировании',
      },
    ],
  },
  {
    text: 'Отложенные',
    statuses: [
      {
        color: '#FB8C00',
        status: 'Позвонить повторно',
      },
      {
        color: '#FB8C00',
        status: 'Ждёт запчасть',
      },
      {
        color: '#FB8C00',
        status: 'Нужно решить',
      },
    ],
  },
  {
    text: 'Готовые',
    statuses: [
      {
        color: '#525252',
        status: 'Готов',
      },
      {
        color: '#525252',
        status: 'Готов, без ремонта',
      },
      {
        color: '#525252',
        status: 'На продаже',
      },
    ],
  },
  {
    text: 'Закрытые успешно',
    statuses: [
      {
        color: '#626262',
        status: 'Закрыт',
      },
      {
        color: '#626262',
        status: 'Выкуплен СЦ',
      },
      {
        color: '#626262',
        status: 'Обещали найти',
      },
    ],
  },
  {
    text: 'Закрытые неуспешно',
    statuses: [
      {
        color: '#b9b9b9',
        status: 'Закрыт с вопросом',
      },
    ],
  },
]