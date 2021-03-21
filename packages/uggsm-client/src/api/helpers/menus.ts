import { map } from 'lodash'

export const reportsMenu = [
  {
    linkName: 'reportsOrders',
    title: 'Закрыто',
  },
  {
    linkName: 'reportsOrdersWithoutWork',
    title: 'Закрыто на 0',
  },
  {
    linkName: 'reportsOrdersCount',
    title: 'Создано',
  },
]

export const settingsMenu = [
  {
    linkName: 'settingsNewUser',
    title: 'Новый пользователь',
  },
  {
    linkName: 'settingsNewOffice',
    title: 'Новый офис',
  },
  {
    linkName: 'settingsDailySubscriptions',
    title: 'Управление ежедневными отчётами',
  },
]

export const defaultMenu = [
  {
    linkName: 'index',
    title: 'Рабочий стол',
    icon: 'mdi-home',
  },
  {
    linkName: 'orders',
    title: 'Заявки',
    icon: 'mdi-archive',
    submenu: [
      {
        linkName: 'ordersNext',
        title: '[Beta] Заказы',
      },
    ],
  },
  {
    linkName: 'clients',
    title: 'Клиенты',
    icon: 'mdi-account-group',
    submenu: [
      {
        linkName: 'clientsNext',
        title: '[Beta] Клиенты',
      },
    ],
  },
  {
    linkName: 'cash',
    title: 'Касса',
    icon: 'mdi-cash-register',
    submenu: [
      {
        linkName: 'cashNext',
        title: '[Beta] Касса',
      },
    ],
  },
  {
    linkName: 'users',
    title: 'Пользователи',
    icon: 'mdi-account-tie',
  },
  {
    linkName: 'calls',
    title: 'Звонки',
    icon: 'mdi-phone',
    submenu: [
      {
        linkName: 'callsNext',
        title: '[Beta] Звонки',
      },
    ],
  },
  {
    linkName: 'reports',
    title: 'Отчёты',
    icon: 'mdi-file-chart',
    submenu: reportsMenu,
  },
  {
    linkName: 'settings',
    title: 'Настройки',
    icon: 'mdi-cog',
    submenu: settingsMenu,
  },
]

export const normalizedMenus = map([...defaultMenu, ...reportsMenu, ...settingsMenu], (e) => ({
  text: e.title,
  value: e.linkName,
}))
