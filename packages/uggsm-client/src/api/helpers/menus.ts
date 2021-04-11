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
  {
    linkName: 'reportsOrdersProfit',
    title: 'Прибыль',
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
  },
  {
    linkName: 'clients',
    title: 'Клиенты',
    icon: 'mdi-account-group',
  },
  {
    linkName: 'cash',
    title: 'Касса',
    icon: 'mdi-cash-register',
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
  },
  {
    linkName: 'reports',
    title: 'Отчёты',
    icon: 'mdi-file-chart',
    submenu: reportsMenu,
  },
  {
    linkName: 'access',
    title: 'Доступ к ресурсам',
    icon: 'mdi-database-clock',
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
