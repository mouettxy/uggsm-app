import { Filter } from './../typings/TokenFilter'
import {
  VuexFilterList,
  VuexFilterListItem,
  VuexFilterListItemEntry,
  VuexFilterListNamespaces,
} from '@/typings/TokenFilter'
import { cloneDeep, isUndefined } from 'lodash'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { authModule } from '.'

@Module({
  namespaced: true,
  name: 'filters',
})
export default class Filters extends VuexModule {
  public filterList: VuexFilterList = {
    tests: {
      default: [],
      custom: [],
      current: [],
    },
    orders: {
      default: [],
      custom: [],
      current: [],
    },
    clients: {
      default: [],
      custom: [],
      current: [],
    },
    calls: {
      default: [],
      custom: [],
      current: [],
    },
    cashes: {
      default: [],
      custom: [],
      current: [],
    },
  }

  @Mutation
  SET_DEFAULT_FILTER(filter: { name: VuexFilterListNamespaces; data: VuexFilterListItemEntry[] }) {
    this.filterList[filter.name].default = filter.data
  }

  @Mutation
  SET_CUSTOM_FILTER(filter: { name: VuexFilterListNamespaces; data: VuexFilterListItemEntry[] }) {
    this.filterList[filter.name].custom = filter.data
  }

  @Mutation
  SET_CURRENT_FILTER(filter: { name: VuexFilterListNamespaces; data: Filter[] }) {
    this.filterList[filter.name].current = filter.data
  }

  @Action
  addDefault(filter: { name: VuexFilterListNamespaces; data: VuexFilterListItemEntry }) {
    const defaultFilter = this.filterList[filter.name].default || []

    const exitingFilterIndex = defaultFilter.findIndex((e) => e.name === filter.data.name)

    if (exitingFilterIndex !== -1) {
      const copyDefaultFilter = cloneDeep(defaultFilter)

      copyDefaultFilter[exitingFilterIndex] = filter.data

      this.context.commit('SET_DEFAULT_FILTER', {
        name: filter.name,
        data: copyDefaultFilter,
      })

      return
    }

    this.context.commit('SET_DEFAULT_FILTER', {
      name: filter.name,
      data: [...defaultFilter, filter.data],
    })
  }

  @Action
  addCustom(filter: { name: VuexFilterListNamespaces; filterName: string }) {
    const customFilter = this.filterList[filter.name].custom || []
    const filterData = cloneDeep(this.filterList[filter.name].current || [])

    const exitingFilterIndex = customFilter.findIndex((e) => e.name === filter.filterName)

    if (exitingFilterIndex !== -1) {
      const copyCustomFilter = cloneDeep(customFilter)

      copyCustomFilter[exitingFilterIndex] = {
        name: filter.filterName,
        filter: filterData,
      }

      this.context.commit('SET_CUSTOM_FILTER', {
        name: filter.name,
        data: copyCustomFilter,
      })

      return
    }

    this.context.commit('SET_CUSTOM_FILTER', {
      name: filter.name,
      data: [
        ...customFilter,
        {
          name: filter.filterName,
          filter: filterData,
        },
      ],
    })
  }

  @Action
  addCurrent(filter: { name: VuexFilterListNamespaces; data: VuexFilterListItemEntry }) {
    this.context.commit('SET_CURRENT_FILTER', {
      name: filter.name,
      data: filter.data,
    })
  }

  @Action
  removeDefault(filter: { name: VuexFilterListNamespaces; filterName: string }) {
    const defaultFilter = this.filterList[filter.name].default.filter((e) => e.name !== filter.filterName)

    this.context.commit('SET_DEFAULT_FILTER', {
      name: filter.name,
      data: defaultFilter,
    })
  }

  @Action
  removeCustom(filter: { name: VuexFilterListNamespaces; filterName: string }) {
    const customFilter = this.filterList[filter.name].custom.filter((e) => e.name !== filter.filterName)

    this.context.commit('SET_CUSTOM_FILTER', {
      name: filter.name,
      data: customFilter,
    })
  }

  @Action
  removeCurrent(filter: { name: VuexFilterListNamespaces }) {
    this.context.commit('SET_CURRENT_FILTER', {
      name: filter.name,
      data: [],
    })
  }

  @Action
  setFromSaved(payload: { name: VuexFilterListNamespaces; type: 'default' | 'custom'; filterName: string }) {
    this.context.commit('SET_CURRENT_FILTER', {
      name: payload.name,
      data: cloneDeep(this.filterList[payload.name][payload.type].find((e) => e.name === payload.filterName)?.filter),
    })
  }

  @Action
  initDefaultFilter(type: VuexFilterListNamespaces) {
    if (type === 'tests') {
      this.context.dispatch('addDefault', {
        name: type,
        data: {
          name: 'Текущий пользователь',
          filter: [
            {
              token: {
                value: 'master',
                name: 'Никнейм мастера',
                type: 'array',
                autocomplete: '/master',
                compares: ['contains', 'not contains'],
                disabled: false,
              },

              value: [
                {
                  text: authModule.user?.credentials as string,
                  value: authModule.user?._id as string,
                },
              ],

              compares: 'contains',
              disabled: false,
              display: false,
            },
          ],
        },
      })
    }
  }
}
