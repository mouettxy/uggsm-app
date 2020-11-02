export const defaultMenu = [
  {
    linkName: 'index',
    title: 'Рабочий стол',
    icon: 'mdi-home',
    divider: false,
  },
  {
    linkName: 'orders',
    title: 'Заявки',
    icon: 'mdi-bat',
    divider: true,
  },
  {
    linkName: 'clients',
    title: 'Клиенты',
    icon: 'mdi-account-group',
    divider: false,
  },
  {
    linkName: 'cash',
    title: 'Касса',
    icon: 'mdi-cash-register',
    divider: true,
  },
  {
    linkName: 'analytic',
    title: 'Аналитика',
    icon: 'mdi-google-analytics',
    divider: false,
  },
  {
    linkName: 'reports',
    title: 'Отчёты',
    icon: 'mdi-filter',
    divider: true,
  },
  {
    linkName: 'settings',
    title: 'Настройки',
    icon: 'mdi-cog',
    divider: true,
  },
]

export const reportsMenu = [
  {
    linkName: 'reportsOrders',
    title: 'Закрыто',
    icon: 'mdi-bat',
    divider: false,
  },
  {
    linkName: 'reportsOrdersWithoutWork',
    title: 'Создано',
    icon: 'mdi-account-cancel',
    divider: false,
  },
  {
    linkName: 'reportsOrdersCount',
    title: 'В работе',
    icon: 'mdi-counter',
    divider: false,
  },
]

export const settingsMenu = [
  {
    linkName: 'settingsNewUser',
    title: 'Новый пользователь',
    icon: 'mdi-account-plus',
    divider: false,
  },
  {
    linkName: 'settingsNewOffice',
    title: 'Новый офис',
    icon: 'mdi-office-building-marker',
    divider: true,
  },
  {
    linkName: 'settingsManageDailySubscriptions',
    title: 'Управление ежедневными отчётами',
    icon: 'mdi-calendar',
    divider: true,
  },
]
