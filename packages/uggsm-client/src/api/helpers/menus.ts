import { map } from 'lodash'

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
    resource: 'Order',
  },
  {
    linkName: 'clients',
    title: 'Клиенты',
    icon: 'mdi-account-group',
    divider: false,
    resource: 'Client',
  },
  {
    linkName: 'cash',
    title: 'Касса',
    icon: 'mdi-cash-register',
    divider: false,
    resource: 'Cash',
  },
  {
    linkName: 'calls',
    title: 'Звонки',
    icon: 'mdi-phone',
    divider: true,
    resource: 'Calls',
  },
  /* {
    linkName: 'analytic',
    title: 'Аналитика',
    icon: 'mdi-google-analytics',
    divider: false,
    resource: 'Analytics',
  }, */
  {
    linkName: 'reports',
    title: 'Отчёты',
    icon: 'mdi-filter',
    divider: true,
    resource: 'Report',
  },
  {
    linkName: 'users',
    title: 'Пользователи',
    icon: 'mdi-account-tie',
    divider: true,
    resource: 'Users',
  },
  {
    linkName: 'settings',
    title: 'Настройки',
    icon: 'mdi-cog',
    resource: 'Settings',
  },
]

export const reportsMenu = [
  {
    linkName: 'reportsOrders',
    title: 'Закрыто',
    icon: 'mdi-bat',
    divider: false,
    resource: 'Report',
  },
  {
    linkName: 'reportsOrdersWithoutWork',
    title: 'Закрыто на 0',
    icon: 'mdi-account-cancel',
    divider: false,
    resource: 'Report',
  },
  {
    linkName: 'reportsOrdersCount',
    title: 'Создано',
    icon: 'mdi-counter',
    divider: false,
    resource: 'Report',
  },
]

export const settingsMenu = [
  {
    linkName: 'settingsNewUser',
    title: 'Новый пользователь',
    icon: 'mdi-account-plus',
    divider: false,
    resource: 'Settings',
  },
  {
    linkName: 'settingsNewOffice',
    title: 'Новый офис',
    icon: 'mdi-office-building-marker',
    divider: true,
    resource: 'Settings',
  },
  {
    linkName: 'settingsManageDailySubscriptions',
    title: 'Управление ежедневными отчётами',
    icon: 'mdi-calendar',
    divider: true,
    resource: 'Settings',
  },
]

export const normalizedMenus = map([...defaultMenu, ...reportsMenu, ...settingsMenu], (e) => ({
  text: e.title,
  value: e.linkName,
}))
